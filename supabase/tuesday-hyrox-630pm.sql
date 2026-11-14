-- Move the regular Tuesday HYROX session from 19:15 to 18:30.
-- Existing future sessions are updated in place so their bookings remain attached.

update public.class_sessions
set starts_at = (
  ((starts_at at time zone 'Europe/London')::date + time '18:30')
  at time zone 'Europe/London'
)
where class_name = 'HYROX'
  and status = 'scheduled'
  and starts_at > now()
  and extract(isodow from starts_at at time zone 'Europe/London') = 2
  and (starts_at at time zone 'Europe/London')::time = time '19:15';

create or replace function public.ensure_rolling_class_sessions()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.class_sessions (class_name, starts_at, duration_minutes, capacity)
  select timetable.class_name,
    ((weeks.week_start + (timetable.day_number - 1))::date + timetable.class_time) at time zone 'Europe/London',
    60,
    25
  from (
    values
      (1, time '18:00', 'Bootcamp'),
      (2, time '09:30', 'Bootcamp'),
      (2, time '18:30', 'HYROX'),
      (3, time '18:00', 'Bootcamp'),
      (4, time '09:30', 'Bootcamp'),
      (5, time '09:30', 'HYROX'),
      (5, time '18:00', 'HYROX'),
      (6, time '09:00', 'Bootcamp')
  ) as timetable(day_number, class_time, class_name)
  cross join (
    select generate_series(
      date_trunc('week', current_date)::date,
      date_trunc('week', current_date)::date + interval '7 weeks',
      interval '1 week'
    )::date as week_start
  ) as weeks
  where ((weeks.week_start + (timetable.day_number - 1))::date + timetable.class_time) at time zone 'Europe/London' > now()
  on conflict (starts_at) do nothing;
end;
$$;

revoke all on function public.ensure_rolling_class_sessions() from public;
