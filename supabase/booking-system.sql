-- Road-e-yo's live class booking system. Run once in the Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  class_name text not null check (class_name in ('Bootcamp', 'HYROX')),
  starts_at timestamptz not null unique,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  capacity integer not null default 25 check (capacity between 1 and 100),
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.class_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, user_id)
);

alter table public.class_sessions enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Athletes can view scheduled classes" on public.class_sessions;
create policy "Athletes can view scheduled classes" on public.class_sessions
for select to authenticated using (status = 'scheduled');

drop policy if exists "Athletes can view their own bookings" on public.bookings;
create policy "Athletes can view their own bookings" on public.bookings
for select to authenticated using (user_id = auth.uid());

create or replace function public.get_upcoming_sessions()
returns table (
  id uuid, class_name text, starts_at timestamptz, duration_minutes integer,
  capacity integer, booked_count bigint, booked_by_me boolean
)
language sql security definer stable set search_path = public
as $$
  select s.id, s.class_name, s.starts_at, s.duration_minutes, s.capacity,
    count(b.id) filter (where b.status = 'confirmed') as booked_count,
    coalesce(bool_or(b.user_id = auth.uid() and b.status = 'confirmed'), false) as booked_by_me
  from public.class_sessions s
  left join public.bookings b on b.session_id = s.id
  where s.status = 'scheduled' and s.starts_at > now()
    and s.starts_at < now() + interval '8 weeks'
  group by s.id order by s.starts_at;
$$;

create or replace function public.book_class(p_session_id uuid)
returns void language plpgsql security definer set search_path = public
as $$
declare v_capacity integer; v_count integer;
begin
  if auth.uid() is null then raise exception 'You must be signed in to book a class.'; end if;
  select capacity into v_capacity from public.class_sessions
    where id = p_session_id and status = 'scheduled' and starts_at > now() for update;
  if v_capacity is null then raise exception 'This class is not available.'; end if;
  select count(*) into v_count from public.bookings
    where session_id = p_session_id and status = 'confirmed';
  if v_count >= v_capacity then raise exception 'This class is full.'; end if;
  insert into public.bookings (session_id, user_id, status, updated_at)
    values (p_session_id, auth.uid(), 'confirmed', now())
    on conflict (session_id, user_id)
    do update set status = 'confirmed', updated_at = now();
end;
$$;

create or replace function public.cancel_class(p_session_id uuid)
returns void language plpgsql security definer set search_path = public
as $$
declare v_starts_at timestamptz;
begin
  if auth.uid() is null then raise exception 'You must be signed in to cancel a class.'; end if;
  select starts_at into v_starts_at from public.class_sessions where id = p_session_id;
  if v_starts_at is null then raise exception 'Class not found.'; end if;
  if v_starts_at <= now() + interval '6 hours' then
    raise exception 'Bookings must be cancelled at least 6 hours before class.';
  end if;
  update public.bookings set status = 'cancelled', updated_at = now()
    where session_id = p_session_id and user_id = auth.uid() and status = 'confirmed';
end;
$$;

revoke all on function public.get_upcoming_sessions() from public;
revoke all on function public.book_class(uuid) from public;
revoke all on function public.cancel_class(uuid) from public;
grant execute on function public.get_upcoming_sessions() to authenticated;
grant execute on function public.book_class(uuid) to authenticated;
grant execute on function public.cancel_class(uuid) to authenticated;

-- Seed eight weeks of the agreed regular timetable in UK local time.
with timetable(day_number, class_time, class_name) as (
  values (1,time '18:00','Bootcamp'), (2,time '09:30','Bootcamp'),
    (2,time '18:30','HYROX'), (3,time '18:00','Bootcamp'),
    (4,time '09:30','Bootcamp'), (5,time '09:30','HYROX'),
    (5,time '18:00','HYROX'), (6,time '09:00','Bootcamp')
), weeks as (
  select generate_series(date_trunc('week', current_date)::date,
    date_trunc('week', current_date)::date + interval '7 weeks', interval '1 week')::date as week_start
)
insert into public.class_sessions (class_name, starts_at, duration_minutes, capacity)
select t.class_name,
  ((w.week_start + (t.day_number - 1))::date + t.class_time) at time zone 'Europe/London',
  60, 25
from weeks w cross join timetable t
where ((w.week_start + (t.day_number - 1))::date + t.class_time) at time zone 'Europe/London' > now()
on conflict (starts_at) do nothing;
