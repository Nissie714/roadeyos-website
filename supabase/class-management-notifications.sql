-- Instructor class management and athlete notifications.
-- Run once in the Supabase SQL Editor before deploying these screens.

create table if not exists public.class_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.class_sessions(id) on delete set null,
  title text not null,
  message text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists class_notifications_user_created_idx
  on public.class_notifications (user_id, created_at desc);

alter table public.class_notifications enable row level security;

revoke all on table public.class_notifications from anon, authenticated;
grant select on table public.class_notifications to authenticated;
grant update (read_at) on table public.class_notifications to authenticated;

drop policy if exists "Athletes can view their own notifications" on public.class_notifications;
create policy "Athletes can view their own notifications"
on public.class_notifications for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Athletes can mark their own notifications read" on public.class_notifications;
create policy "Athletes can mark their own notifications read"
on public.class_notifications for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create or replace function public.instructor_update_class_time(
  p_session_id uuid,
  p_starts_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_class_name text;
  v_old_starts_at timestamptz;
begin
  if not public.is_instructor() then
    raise exception 'Instructor access required.';
  end if;

  if p_starts_at <= now() then
    raise exception 'The new class time must be in the future.';
  end if;

  select class_name, starts_at
  into v_class_name, v_old_starts_at
  from public.class_sessions
  where id = p_session_id and status = 'scheduled'
  for update;

  if v_class_name is null then
    raise exception 'Class not found.';
  end if;

  update public.class_sessions
  set starts_at = p_starts_at
  where id = p_session_id;

  insert into public.class_notifications (user_id, session_id, title, message)
  select b.user_id,
    p_session_id,
    'Class time changed',
    v_class_name || ' has moved from ' ||
      to_char(v_old_starts_at at time zone 'Europe/London', 'Dy DD Mon at HH24:MI') ||
      ' to ' ||
      to_char(p_starts_at at time zone 'Europe/London', 'Dy DD Mon at HH24:MI') || '.'
  from public.bookings b
  where b.session_id = p_session_id and b.status = 'confirmed';
end;
$$;

create or replace function public.instructor_cancel_class(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_class_name text;
  v_starts_at timestamptz;
begin
  if not public.is_instructor() then
    raise exception 'Instructor access required.';
  end if;

  select class_name, starts_at
  into v_class_name, v_starts_at
  from public.class_sessions
  where id = p_session_id and status = 'scheduled'
  for update;

  if v_class_name is null then
    raise exception 'Class not found.';
  end if;

  insert into public.class_notifications (user_id, session_id, title, message)
  select b.user_id,
    p_session_id,
    'Class cancelled',
    v_class_name || ' on ' ||
      to_char(v_starts_at at time zone 'Europe/London', 'Dy DD Mon at HH24:MI') ||
      ' has been cancelled. Please choose another session.'
  from public.bookings b
  where b.session_id = p_session_id and b.status = 'confirmed';

  update public.bookings
  set status = 'cancelled', updated_at = now()
  where session_id = p_session_id and status = 'confirmed';

  update public.class_sessions
  set status = 'cancelled'
  where id = p_session_id;
end;
$$;

revoke all on function public.instructor_update_class_time(uuid, timestamptz) from public;
revoke all on function public.instructor_cancel_class(uuid) from public;
grant execute on function public.instructor_update_class_time(uuid, timestamptz) to authenticated;
grant execute on function public.instructor_cancel_class(uuid) to authenticated;
