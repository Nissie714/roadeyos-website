-- Instructor monthly popularity history based only on confirmed bookings.
-- Run in Supabase before publishing the History tab.

create or replace function public.get_instructor_attendance_history()
returns table (
  month_start date, total_attendances bigint, unique_athletes bigint,
  bootcamp_attendances bigint, hyrox_attendances bigint
)
language plpgsql security definer stable set search_path = public
as $$
begin
  if not public.is_instructor() then raise exception 'Instructor access required.'; end if;
  return query
  with months as (
    select generate_series(
      date '2026-12-01',
      (date_trunc('month', now() at time zone 'Europe/London')::date - interval '1 month')::date,
      interval '1 month'
    )::date as month_start
  )
  select m.month_start,
    count(b.id),
    count(distinct b.user_id),
    count(b.id) filter (where upper(s.class_name) = 'BOOTCAMP'),
    count(b.id) filter (where upper(s.class_name) like 'HYROX%')
  from months m
  left join public.class_sessions s
    on date_trunc('month', s.starts_at at time zone 'Europe/London')::date = m.month_start
  left join public.bookings b
    on b.session_id = s.id and b.status = 'confirmed'
  group by m.month_start
  order by m.month_start;
end;
$$;

revoke all on function public.get_instructor_attendance_history() from public;
grant execute on function public.get_instructor_attendance_history() to authenticated;
