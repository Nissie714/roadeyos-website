-- Instructor-only PAR-Q status and reset controls.
-- A reset removes the current declaration, locks new bookings, and records
-- which instructor performed the reset and when.

create table if not exists public.health_declaration_resets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reset_by uuid not null references auth.users(id),
  previous_status text not null,
  previous_signed_at timestamptz,
  reason text not null default 'Discussed with instructor — declaration completed incorrectly',
  reset_at timestamptz not null default now()
);

alter table public.health_declaration_resets enable row level security;
revoke all on table public.health_declaration_resets from anon, authenticated;

create or replace function public.get_instructor_parq_statuses()
returns table (
  user_id uuid,
  athlete_name text,
  athlete_email text,
  declaration_status text,
  signed_at timestamptz,
  last_reset_at timestamptz
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
    h.declaration_status,
    h.signed_at,
    (select max(r.reset_at) from public.health_declaration_resets r where r.user_id = p.id)
  from public.profiles p
  join auth.users u on u.id = p.id
  left join public.health_declarations h on h.user_id = p.id
  order by 2, u.email;
end;
$$;

create or replace function public.reset_member_parq(p_user_id uuid)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_declaration public.health_declarations%rowtype;
begin
  if not public.is_instructor() then
    raise exception 'Instructor access required.';
  end if;
  if p_user_id is null then
    raise exception 'Choose a registered athlete.';
  end if;

  select * into v_declaration
  from public.health_declarations
  where user_id = p_user_id
  for update;

  if not found then
    raise exception 'This athlete does not have an active PAR-Q to reset.';
  end if;

  insert into public.health_declaration_resets (
    user_id, reset_by, previous_status, previous_signed_at
  ) values (
    p_user_id, auth.uid(), v_declaration.declaration_status, v_declaration.signed_at
  );

  delete from public.health_declarations where user_id = p_user_id;
end;
$$;

revoke all on function public.get_instructor_parq_statuses() from public;
revoke all on function public.reset_member_parq(uuid) from public;
grant execute on function public.get_instructor_parq_statuses() to authenticated;
grant execute on function public.reset_member_parq(uuid) to authenticated;
