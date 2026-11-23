-- Athlete clothing requests and instructor-only order list.
-- Run in Supabase before publishing the clothing-order screens.

create table if not exists public.clothing_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null,
  status text not null default 'New' check (status in ('New', 'Confirmed', 'Completed', 'Cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clothing_orders_created_idx on public.clothing_orders (created_at desc);
alter table public.clothing_orders enable row level security;
revoke all on table public.clothing_orders from anon, authenticated;

create or replace function public.submit_clothing_order(p_items jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_item jsonb;
begin
  if auth.uid() is null then raise exception 'You must be signed in to submit an order.'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 20 then
    raise exception 'Choose between one and twenty clothing items.';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if v_item->>'garment' not in ('Hoodie', 'Crew jumper', 'T-shirt', 'Drop Shoulder T-shirt') then raise exception 'Invalid clothing item.'; end if;
    if v_item->>'garment' = 'Hoodie' and coalesce(v_item->>'hoodie_style', '') not in ('Zip front', 'Overhead') then raise exception 'Choose a hoodie style.'; end if;
    if v_item->>'size' not in ('XS', 'S', 'M', 'L', 'XL', '2XL', '3XL') then raise exception 'Invalid size.'; end if;
    if v_item->>'garment_colour' not in ('Black', 'Hot pink', 'Charcoal', 'White', 'Navy') and not (
      char_length(coalesce(v_item->>'garment_colour', '')) between 1 and 40
      and coalesce(v_item->>'garment_colour_hex', '') ~ '^#[0-9A-F]{6}$'
    ) then raise exception 'Invalid garment colour.'; end if;
    if jsonb_typeof(v_item->'rear_logo') <> 'boolean' then raise exception 'Choose whether you want a rear logo.'; end if;
    if (v_item->>'rear_logo')::boolean and v_item->>'logo_colour' not in ('Pink', 'White', 'Black') then raise exception 'Invalid logo colour.'; end if;
  end loop;

  insert into public.clothing_orders (user_id, items) values (auth.uid(), p_items) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.get_instructor_clothing_orders()
returns table (id uuid, athlete_name text, items jsonb, status text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_instructor() then raise exception 'Instructor access required.'; end if;
  return query
  select o.id,
    coalesce(nullif(trim(concat_ws(' ', p.first_name, p.last_name)), ''), p.full_name, 'Athlete') as athlete_name,
    o.items, o.status, o.created_at
  from public.clothing_orders o
  left join public.profiles p on p.id = o.user_id
  order by o.created_at desc;
end;
$$;

revoke all on function public.submit_clothing_order(jsonb) from public;
revoke all on function public.get_instructor_clothing_orders() from public;
grant execute on function public.submit_clothing_order(jsonb) to authenticated;
grant execute on function public.get_instructor_clothing_orders() to authenticated;
