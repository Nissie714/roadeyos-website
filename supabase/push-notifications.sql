-- OneSignal web-push subscriptions for signed-in athletes.
-- Run once in the Supabase SQL Editor before deploying the OneSignal website code.

create table if not exists public.push_subscriptions (
  subscription_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_idx
  on public.push_subscriptions (user_id) where enabled = true;

alter table public.push_subscriptions enable row level security;
revoke all on table public.push_subscriptions from anon, authenticated;

create or replace function public.register_push_subscription(p_subscription_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to enable notifications.';
  end if;
  if nullif(trim(p_subscription_id), '') is null then
    raise exception 'Invalid push subscription.';
  end if;

  insert into public.push_subscriptions (subscription_id, user_id, enabled, updated_at)
  values (trim(p_subscription_id), auth.uid(), true, now())
  on conflict (subscription_id)
  do update set user_id = auth.uid(), enabled = true, updated_at = now();
end;
$$;

create or replace function public.disable_push_subscription(p_subscription_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.push_subscriptions
  set enabled = false, updated_at = now()
  where subscription_id = trim(p_subscription_id) and user_id = auth.uid();
end;
$$;

revoke all on function public.register_push_subscription(text) from public;
revoke all on function public.disable_push_subscription(text) from public;
grant execute on function public.register_push_subscription(text) to authenticated;
grant execute on function public.disable_push_subscription(text) to authenticated;
