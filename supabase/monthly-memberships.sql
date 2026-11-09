-- Monthly membership dates, instructor controls and renewal notifications.
-- Run this once in the Supabase SQL Editor before publishing the website changes.

create table if not exists public.monthly_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  membership_started_on date not null,
  renewal_due_on date not null,
  status text not null default 'active' check (status in ('active', 'paused', 'cancelled')),
  last_due_notification_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.monthly_memberships enable row level security;
revoke all on table public.monthly_memberships from anon, authenticated;

create or replace function public.get_registered_members_for_membership()
returns table (
  user_id uuid,
  member_name text,
  email text,
  membership_started_on date,
  renewal_due_on date
)
language plpgsql security definer stable set search_path = public
as $$
begin
  if not public.is_instructor() then
    raise exception 'Instructor access required.';
  end if;

  return query
  select p.id,
    coalesce(nullif(trim(concat_ws(' ', p.first_name, p.last_name)), ''), nullif(p.full_name, ''), split_part(u.email, '@', 1)),
    u.email::text,
    m.membership_started_on,
    m.renewal_due_on
  from public.profiles p
  join auth.users u on u.id = p.id
  left join public.monthly_memberships m on m.user_id = p.id and m.status = 'active'
  order by 2, u.email;
end;
$$;

create or replace function public.set_monthly_membership(p_user_id uuid, p_started_on date)
returns date
language plpgsql security definer set search_path = public
as $$
declare
  v_due_on date;
begin
  if not public.is_instructor() then
    raise exception 'Instructor access required.';
  end if;
  if p_started_on is null then
    raise exception 'A membership start date is required.';
  end if;
  if not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'Registered member not found.';
  end if;

  v_due_on := (p_started_on + interval '1 month')::date;

  insert into public.monthly_memberships (user_id, membership_started_on, renewal_due_on, status, last_due_notification_on, updated_at)
  values (p_user_id, p_started_on, v_due_on, 'active', null, now())
  on conflict (user_id) do update set
    membership_started_on = excluded.membership_started_on,
    renewal_due_on = excluded.renewal_due_on,
    status = 'active',
    last_due_notification_on = null,
    updated_at = now();

  return v_due_on;
end;
$$;

create or replace function public.get_my_monthly_membership()
returns table (membership_started_on date, renewal_due_on date, status text)
language sql security definer stable set search_path = public
as $$
  select m.membership_started_on, m.renewal_due_on, m.status
  from public.monthly_memberships m
  where m.user_id = auth.uid() and m.status = 'active';
$$;

-- Inserts one in-app notification on the renewal date. The existing database
-- webhook then sends the same message as a OneSignal phone notification.
create or replace function public.send_due_membership_notifications()
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  v_count integer;
begin
  with due_members as (
    update public.monthly_memberships
    set last_due_notification_on = current_date, updated_at = now()
    where status = 'active'
      and renewal_due_on <= current_date
      and last_due_notification_on is null
    returning user_id
  )
  insert into public.class_notifications (user_id, session_id, title, message)
  select user_id, null, 'Membership', 'Membership now due'
  from due_members;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.get_registered_members_for_membership() from public;
revoke all on function public.set_monthly_membership(uuid, date) from public;
revoke all on function public.get_my_monthly_membership() from public;
revoke all on function public.send_due_membership_notifications() from public;
grant execute on function public.get_registered_members_for_membership() to authenticated;
grant execute on function public.set_monthly_membership(uuid, date) to authenticated;
grant execute on function public.get_my_monthly_membership() to authenticated;

-- Supabase runs this every morning at 09:00 UTC. Running the script again safely
-- replaces the existing schedule instead of creating duplicates.
create extension if not exists pg_cron with schema extensions;
select cron.unschedule(jobid) from cron.job where jobname = 'roadeyos-membership-renewals';
select cron.schedule(
  'roadeyos-membership-renewals',
  '0 9 * * *',
  'select public.send_due_membership_notifications();'
);
