-- Keep profile creation inside the Auth transaction so it also works when
-- email confirmation is enabled and signUp() does not return a user session.
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
      on public.profiles for select
      to authenticated
      using ((select auth.uid()) = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'Users can create their own profile'
  ) then
    create policy "Users can create their own profile"
      on public.profiles for insert
      to authenticated
      with check ((select auth.uid()) = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'Users can update their own profile'
  ) then
    create policy "Users can update their own profile"
      on public.profiles for update
      to authenticated
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
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
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

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'on_auth_user_created'
      and tgrelid = 'auth.users'::regclass
      and not tgisinternal
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end;
$$;
