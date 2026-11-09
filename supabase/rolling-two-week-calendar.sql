-- Keep the regular timetable populated while limiting new bookings to two weeks ahead.
-- Run once in the Supabase SQL Editor before deploying the tabbed athlete dashboard.

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
      (2, time '19:15', 'HYROX'),
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

create or replace function public.get_upcoming_sessions()
returns table (
  id uuid,
  class_name text,
  starts_at timestamptz,
  duration_minutes integer,
  capacity integer,
  booked_count bigint,
  booked_by_me boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to view classes.';
  end if;

  perform public.ensure_rolling_class_sessions();

  return query
    select s.id, s.class_name, s.starts_at, s.duration_minutes, s.capacity,
      count(b.id) filter (where b.status = 'confirmed') as booked_count,
      coalesce(bool_or(b.user_id = auth.uid() and b.status = 'confirmed'), false) as booked_by_me
    from public.class_sessions s
    left join public.bookings b on b.session_id = s.id
    where s.status = 'scheduled'
      and s.starts_at > now()
      and s.starts_at < now() + interval '8 weeks'
    group by s.id
    order by s.starts_at;
end;
$$;

create or replace function public.book_class(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity integer;
  v_count integer;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to book a class.';
  end if;

  select capacity into v_capacity
  from public.class_sessions
  where id = p_session_id
    and status = 'scheduled'
    and starts_at > now()
    and starts_at <= now() + interval '2 weeks'
  for update;

  if v_capacity is null then
    raise exception 'This class is not available within the two-week booking window.';
  end if;

  select count(*) into v_count
  from public.bookings
  where session_id = p_session_id and status = 'confirmed';

  if v_count >= v_capacity then
    raise exception 'This class is full.';
  end if;

  insert into public.bookings (session_id, user_id, status, updated_at)
  values (p_session_id, auth.uid(), 'confirmed', now())
  on conflict (session_id, user_id)
  do update set status = 'confirmed', updated_at = now();
end;
$$;

revoke all on function public.ensure_rolling_class_sessions() from public;
revoke all on function public.get_upcoming_sessions() from public;
revoke all on function public.book_class(uuid) from public;
grant execute on function public.get_upcoming_sessions() to authenticated;
grant execute on function public.book_class(uuid) to authenticated;
