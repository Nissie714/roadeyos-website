-- Instructor-only urgent notifications for all registered athletes.
-- Run once in the Supabase SQL Editor.

create table if not exists public.instructor_notification_history (
  id uuid primary key default gen_random_uuid(),
  sent_by uuid not null references auth.users(id) on delete restrict,
  message text not null,
  recipient_count integer not null default 0 check (recipient_count >= 0),
  created_at timestamptz not null default now()
);

create index if not exists instructor_notification_history_created_idx
  on public.instructor_notification_history (created_at desc);

alter table public.instructor_notification_history enable row level security;
revoke all on table public.instructor_notification_history from anon, authenticated;

create or replace function public.instructor_broadcast_notification(p_message text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_message text := trim(coalesce(p_message, ''));
  v_count integer;
begin
  if not public.is_instructor() then
    raise exception 'Instructor access required.';
  end if;
  if v_message = '' then
    raise exception 'Please enter a notification message.';
  end if;
  if char_length(v_message) > 300 then
    raise exception 'Notification messages must be 300 characters or fewer.';
  end if;

  insert into public.class_notifications (user_id, session_id, title, message)
  select p.id, null, 'Road-e-yo''s update', v_message
  from public.profiles p;

  get diagnostics v_count = row_count;

  insert into public.instructor_notification_history (sent_by, message, recipient_count)
  values (auth.uid(), v_message, v_count);

  return v_count;
end;
$$;

revoke all on function public.instructor_broadcast_notification(text) from public;
grant execute on function public.instructor_broadcast_notification(text) to authenticated;

create or replace function public.get_instructor_notification_history()
returns table (
  id uuid,
  message text,
  recipient_count integer,
  created_at timestamptz,
  sent_by_name text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_instructor() then
    raise exception 'Instructor access required.';
  end if;

  return query
  select
    h.id,
    h.message,
    h.recipient_count,
    h.created_at,
    coalesce(nullif(trim(concat_ws(' ', p.first_name, p.last_name)), ''), p.full_name, 'Instructor') as sent_by_name
  from public.instructor_notification_history h
  left join public.profiles p on p.id = h.sent_by
  order by h.created_at desc
  limit 100;
end;
$$;

revoke all on function public.get_instructor_notification_history() from public;
grant execute on function public.get_instructor_notification_history() to authenticated;
