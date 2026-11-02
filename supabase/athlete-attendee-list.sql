-- Athlete class attendee list with explicit name-sharing consent.
-- Run once in the Supabase SQL Editor.

alter table public.profiles
  add column if not exists show_name_to_athletes boolean not null default false;

create or replace function public.get_my_class_attendees()
returns table (
  session_id uuid,
  display_name text
)
language sql
security definer
stable
set search_path = public
as $$
  select b.session_id,
    trim(concat(p.first_name, ' ', left(coalesce(p.last_name, ''), 1))) as display_name
  from public.bookings my_booking
  join public.bookings b
    on b.session_id = my_booking.session_id
   and b.status = 'confirmed'
  join public.profiles p on p.id = b.user_id
  join public.class_sessions s on s.id = b.session_id
  where my_booking.user_id = auth.uid()
    and my_booking.status = 'confirmed'
    and s.starts_at > now()
    and p.show_name_to_athletes = true
    and nullif(trim(p.first_name), '') is not null
  order by b.session_id, lower(p.first_name), lower(p.last_name);
$$;

revoke all on function public.get_my_class_attendees() from public;
grant execute on function public.get_my_class_attendees() to authenticated;
