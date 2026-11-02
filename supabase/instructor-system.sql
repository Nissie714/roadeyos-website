-- Road-e-yo's instructor roles and private class rosters.
-- Run once in the Supabase SQL Editor after booking-system.sql.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;

create table if not exists public.instructor_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.instructor_users enable row level security;

drop policy if exists "Athletes can view their own profile" on public.profiles;
create policy "Athletes can view their own profile" on public.profiles
for select to authenticated using (id = auth.uid());

drop policy if exists "Athletes can update their own profile" on public.profiles;
create policy "Athletes can update their own profile" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, full_name)
  values (
    new.id,
    nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'last_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, first_name, last_name, full_name)
select id,
  nullif(trim(raw_user_meta_data ->> 'first_name'), ''),
  nullif(trim(raw_user_meta_data ->> 'last_name'), ''),
  nullif(trim(raw_user_meta_data ->> 'full_name'), '')
from auth.users
on conflict (id) do update set
  first_name = coalesce(public.profiles.first_name, excluded.first_name),
  last_name = coalesce(public.profiles.last_name, excluded.last_name),
  full_name = coalesce(public.profiles.full_name, excluded.full_name);

create or replace function public.is_instructor()
returns boolean language sql security definer stable set search_path = public
as $$
  select exists (
    select 1 from public.instructor_users where user_id = auth.uid()
  );
$$;

create or replace function public.get_instructor_session_roster_v2()
returns table (
  session_id uuid,
  class_name text,
  starts_at timestamptz,
  duration_minutes integer,
  capacity integer,
  booking_id uuid,
  athlete_name text,
  booked_at timestamptz
)
language plpgsql security definer stable set search_path = public
as $$
begin
  if not public.is_instructor() then
    raise exception 'Instructor access required.';
  end if;

  return query
  select s.id, s.class_name, s.starts_at, s.duration_minutes, s.capacity,
    b.id, coalesce(
      nullif(trim(concat_ws(' ', p.first_name, p.last_name)), ''),
      nullif(p.full_name, ''),
      split_part(u.email, '@', 1)
    ),
    b.created_at
  from public.class_sessions s
  left join public.bookings b on b.session_id = s.id and b.status = 'confirmed'
  left join auth.users u on u.id = b.user_id
  left join public.profiles p on p.id = b.user_id
  where s.status = 'scheduled' and s.starts_at > now()
    and s.starts_at < now() + interval '8 weeks'
  order by s.starts_at, coalesce(p.full_name, u.email);
end;
$$;

revoke all on function public.is_instructor() from public;
revoke all on function public.get_instructor_session_roster_v2() from public;
grant execute on function public.is_instructor() to authenticated;
grant execute on function public.get_instructor_session_roster_v2() to authenticated;

-- After creating the instructor account, replace the email below and run only
-- the following two lines to grant instructor access:
-- insert into public.instructor_users (user_id)
-- select id from auth.users where lower(email) = lower('YOUR-INSTRUCTOR-EMAIL');
