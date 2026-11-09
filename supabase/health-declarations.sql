-- Private athlete pre-exercise health declarations.
-- Run once in the Supabase SQL Editor before publishing the website change.

create table if not exists public.health_declarations (
  user_id uuid primary key references auth.users(id) on delete cascade,
  answers jsonb not null,
  signature_name text not null,
  declaration_status text not null check (declaration_status in ('self_declared_fit', 'advice_required')),
  form_version text not null default 'roadeyos-health-declaration-v1',
  signed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.health_declarations enable row level security;
revoke all on table public.health_declarations from anon, authenticated;

create or replace function public.save_my_health_declaration(
  p_answers jsonb,
  p_signature_name text,
  p_declaration_status text
)
returns timestamptz
language plpgsql security definer set search_path = public
as $$
declare
  v_signed_at timestamptz := now();
  v_expected_keys text[] := array[
    'heart_condition', 'chest_pain_activity', 'chest_pain_rest',
    'dizziness_fainting', 'joint_problem', 'heart_medication', 'other_reason'
  ];
  v_key text;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.';
  end if;
  if nullif(trim(p_signature_name), '') is null then
    raise exception 'Your full-name signature is required.';
  end if;
  if p_declaration_status not in ('self_declared_fit', 'advice_required') then
    raise exception 'Invalid declaration status.';
  end if;
  foreach v_key in array v_expected_keys loop
    if not (p_answers ? v_key) or jsonb_typeof(p_answers -> v_key) <> 'boolean' then
      raise exception 'Every health question must be answered.';
    end if;
  end loop;
  if p_declaration_status = 'self_declared_fit' and exists (
    select 1 from jsonb_each(p_answers) item where item.value = 'true'::jsonb
  ) then
    raise exception 'The declaration status does not match the supplied answers.';
  end if;

  insert into public.health_declarations (
    user_id, answers, signature_name, declaration_status, form_version, signed_at, updated_at
  ) values (
    auth.uid(), p_answers, trim(p_signature_name), p_declaration_status,
    'roadeyos-health-declaration-v1', v_signed_at, v_signed_at
  )
  on conflict (user_id) do update set
    answers = excluded.answers,
    signature_name = excluded.signature_name,
    declaration_status = excluded.declaration_status,
    form_version = excluded.form_version,
    signed_at = excluded.signed_at,
    updated_at = excluded.updated_at;

  return v_signed_at;
end;
$$;

create or replace function public.get_my_health_declaration()
returns table (
  answers jsonb,
  signature_name text,
  declaration_status text,
  signed_at timestamptz
)
language sql security definer stable set search_path = public
as $$
  select h.answers, h.signature_name, h.declaration_status, h.signed_at
  from public.health_declarations h
  where h.user_id = auth.uid();
$$;

revoke all on function public.save_my_health_declaration(jsonb, text, text) from public;
revoke all on function public.get_my_health_declaration() from public;
grant execute on function public.save_my_health_declaration(jsonb, text, text) to authenticated;
grant execute on function public.get_my_health_declaration() to authenticated;

-- Enforce the declaration requirement in the database as well as the website,
-- so a booking cannot bypass the on-screen controls.
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
  if not exists (
    select 1 from public.health_declarations
    where user_id = auth.uid() and declaration_status = 'self_declared_fit'
  ) then
    raise exception 'A completed fit-to-participate PAR-Q is required before booking. If your PAR-Q identified a health matter, please contact Yolanda to discuss suitable exercise options.';
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

revoke all on function public.book_class(uuid) from public;
grant execute on function public.book_class(uuid) to authenticated;
