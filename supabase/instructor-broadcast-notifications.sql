-- Instructor-only urgent notifications for all registered athletes.
-- Run once in the Supabase SQL Editor.

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
  from public.profiles p
  where not exists (
    select 1 from public.instructor_users i where i.user_id = p.id
  );

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.instructor_broadcast_notification(text) from public;
grant execute on function public.instructor_broadcast_notification(text) to authenticated;
