-- Apply to the existing Road-e-yo's database before publishing the updated clothing screens.
-- Existing orders stay intact. Existing class_notifications webhook delivers optional phone push.

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

create or replace function public.get_my_clothing_orders()
returns table (id uuid, items jsonb, status text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'You must be signed in to view your orders.'; end if;
  return query
  select o.id, o.items, o.status, o.created_at
  from public.clothing_orders o
  where o.user_id = auth.uid()
  order by o.created_at desc;
end;
$$;

create or replace function public.instructor_cancel_clothing_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.clothing_orders%rowtype;
begin
  if not public.is_instructor() then raise exception 'Instructor access required.'; end if;

  select * into v_order from public.clothing_orders
  where id = p_order_id for update;
  if not found then raise exception 'Clothing order not found.'; end if;
  if v_order.status in ('Cancelled', 'Completed') then
    raise exception 'This order can no longer be cancelled.';
  end if;

  update public.clothing_orders
  set status = 'Cancelled', updated_at = now()
  where id = p_order_id;

  insert into public.class_notifications (user_id, session_id, title, message)
  values (
    v_order.user_id,
    null,
    'Clothing order cancelled',
    'Your clothing order ' || upper(left(v_order.id::text, 8)) ||
      ' has been cancelled. You can place a new order in the Clothing tab.'
  );
end;
$$;

revoke all on function public.get_my_clothing_orders() from public;
revoke all on function public.instructor_cancel_clothing_order(uuid) from public;
grant execute on function public.get_my_clothing_orders() to authenticated;
grant execute on function public.instructor_cancel_clothing_order(uuid) to authenticated;
