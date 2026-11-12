-- Private emergency contacts. Athletes manage their own record; instructors
-- can access consented contacts when needed for health or safety.
create table if not exists public.emergency_contacts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  contact_name text not null,
  relationship text not null,
  telephone text not null,
  consent_to_instructor_access boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.emergency_contacts enable row level security;
revoke all on table public.emergency_contacts from anon, authenticated;

create or replace function public.get_my_emergency_contact()
returns table (contact_name text, relationship text, telephone text, consent_to_instructor_access boolean)
language sql security definer stable set search_path = public as $$
  select e.contact_name, e.relationship, e.telephone, e.consent_to_instructor_access from public.emergency_contacts e where e.user_id = auth.uid();
$$;

create or replace function public.save_my_emergency_contact(p_contact_name text, p_relationship text, p_telephone text, p_consent boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Sign in required.'; end if;
  if nullif(trim(p_contact_name), '') is null or nullif(trim(p_relationship), '') is null or nullif(trim(p_telephone), '') is null then raise exception 'All emergency-contact fields are required.'; end if;
  if p_consent is not true then raise exception 'Consent is required before these details can be saved.'; end if;
  insert into public.emergency_contacts (user_id, contact_name, relationship, telephone, consent_to_instructor_access, updated_at)
  values (auth.uid(), trim(p_contact_name), trim(p_relationship), trim(p_telephone), true, now())
  on conflict (user_id) do update set contact_name = excluded.contact_name, relationship = excluded.relationship, telephone = excluded.telephone, consent_to_instructor_access = excluded.consent_to_instructor_access, updated_at = now();
end;
$$;

create or replace function public.get_instructor_emergency_contacts()
returns table (athlete_name text, athlete_email text, contact_name text, relationship text, telephone text)
language plpgsql security definer stable set search_path = public as $$
begin
  if not public.is_instructor() then raise exception 'Instructor access required.'; end if;
  return query select coalesce(nullif(trim(concat_ws(' ', p.first_name, p.last_name)), ''), nullif(p.full_name, ''), split_part(u.email, '@', 1)), u.email::text, e.contact_name, e.relationship, e.telephone
  from public.emergency_contacts e join auth.users u on u.id = e.user_id left join public.profiles p on p.id = e.user_id
  where e.consent_to_instructor_access is true order by 1, 2;
end;
$$;

revoke all on function public.get_my_emergency_contact() from public;
revoke all on function public.save_my_emergency_contact(text, text, text, boolean) from public;
revoke all on function public.get_instructor_emergency_contacts() from public;
grant execute on function public.get_my_emergency_contact() to authenticated;
grant execute on function public.save_my_emergency_contact(text, text, text, boolean) to authenticated;
grant execute on function public.get_instructor_emergency_contacts() to authenticated;
