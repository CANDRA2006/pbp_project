-- CyberHub profile setup. This is additive: it does not drop tables, rows,
-- policies, or triggers. Review any existing profiles schema before running.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  specialization text[] not null default array['WebSec']::text[],
  created_at timestamptz not null default now()
);

-- Fill columns that may be absent on an existing profiles table.
alter table public.profiles
  add column if not exists id uuid references auth.users (id) on delete cascade;
alter table public.profiles
  add column if not exists username text;
alter table public.profiles
  add column if not exists specialization text[] not null default array['WebSec']::text[];
alter table public.profiles
  add column if not exists created_at timestamptz not null default now();

create unique index if not exists profiles_id_unique_idx on public.profiles (id);

alter table public.profiles enable row level security;
grant select, insert, update on table public.profiles to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'Users can read their own profile'
  ) then
    create policy "Users can read their own profile"
      on public.profiles for select to authenticated
      using ((select auth.uid()) = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'Users can create their own profile'
  ) then
    create policy "Users can create their own profile"
      on public.profiles for insert to authenticated
      with check ((select auth.uid()) = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'Users can update their own profile'
  ) then
    create policy "Users can update their own profile"
      on public.profiles for update to authenticated
      using ((select auth.uid()) = id)
      with check ((select auth.uid()) = id);
  end if;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, specialization)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), split_part(coalesce(new.email, ''), '@', 1)),
    case jsonb_typeof(new.raw_user_meta_data -> 'specialization')
      when 'array' then array(select jsonb_array_elements_text(new.raw_user_meta_data -> 'specialization'))
      when 'string' then array[new.raw_user_meta_data ->> 'specialization']::text[]
      else array['WebSec']::text[]
    end
  )
  on conflict (id) do update
    set username = excluded.username,
        specialization = excluded.specialization;
  return new;
end;
$$;

-- Replace this trigger's definition if it already exists, so it cannot keep
-- calling an older/broken handler. This replaces only the trigger definition.
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create profiles for Auth users who existed before this setup was applied.
insert into public.profiles (id, username, specialization)
select
  u.id,
  coalesce(nullif(u.raw_user_meta_data ->> 'username', ''), split_part(coalesce(u.email, ''), '@', 1)),
  case jsonb_typeof(u.raw_user_meta_data -> 'specialization')
    when 'array' then array(select jsonb_array_elements_text(u.raw_user_meta_data -> 'specialization'))
    when 'string' then array[u.raw_user_meta_data ->> 'specialization']::text[]
    else array['WebSec']::text[]
  end
from auth.users as u
on conflict (id) do nothing;
