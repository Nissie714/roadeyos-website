-- Change the athlete cancellation cutoff from 12 hours to 6 hours.
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

revoke all on function public.cancel_class(uuid) from public;
grant execute on function public.cancel_class(uuid) to authenticated;
