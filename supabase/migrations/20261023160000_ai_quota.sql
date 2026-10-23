-- Quota d'appels à l'IA : 20 par heure et par compte, pour qu'un robot ou un double-clic répété ne vide pas le crédit API.

create table public.ai_requests (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index ai_requests_user_created_idx on public.ai_requests (user_id, created_at desc);

alter table public.ai_requests enable row level security;

create policy "ai_requests: lecture des siennes" on public.ai_requests
  for select to authenticated using (user_id = (select auth.uid()));
create policy "ai_requests: ajout des siennes" on public.ai_requests
  for insert to authenticated with check (user_id = (select auth.uid()));

-- Vrai si l'appel est permis, et le compte alors. security invoker : la RLS s'applique.
create function public.consume_ai_quota() returns boolean
language plpgsql security invoker set search_path = '' as $$
begin
  if auth.uid() is null then
    return false;
  end if;
  if (select count(*) from public.ai_requests where user_id = auth.uid() and created_at > now() - interval '1 hour') >= 20 then
    return false;
  end if;
  insert into public.ai_requests default values;
  return true;
end;
$$;

revoke execute on function public.consume_ai_quota() from public, anon;
grant execute on function public.consume_ai_quota() to authenticated;
