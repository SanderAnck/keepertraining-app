-- KeeperCoach: cloudopslag in Supabase. Eén keer uitvoeren in de SQL Editor van je Supabase-project.
-- Eén tabel voor trainingen, oefeningen en keepers. Elke rij is één record uit de app, als JSON.
-- Instellingen en de actieve veldmodus blijven lokaal op elk toestel en komen hier niet.

create sequence if not exists public.records_seq;

create table if not exists public.records (
  user_id    uuid    not null default auth.uid() references auth.users (id) on delete cascade,
  kind       text    not null check (kind in ('sessions', 'exercises', 'keepers')),
  id         text    not null,
  data       jsonb,                          -- het volledige record (leeg bij een verwijderd record)
  updated_at bigint  not null,               -- tijdstip van de wijziging op het toestel (ms), bepaalt wie wint
  deleted    boolean not null default false, -- verwijderd records blijven als markering, zodat andere toestellen ze ook wissen
  seq        bigint  not null default nextval('public.records_seq'), -- volgnummer om enkel nieuwe wijzigingen op te halen
  primary key (user_id, kind, id)
);

create index if not exists records_user_seq on public.records (user_id, seq);

-- Laatste wijziging wint: een oudere versie overschrijft nooit een nieuwere. Elke schrijfactie krijgt een nieuw volgnummer.
create or replace function public.records_before_write() returns trigger
language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE' and new.updated_at < old.updated_at then
    return null;
  end if;
  new.seq := nextval('public.records_seq');
  return new;
end $$;

drop trigger if exists records_before_write on public.records;
create trigger records_before_write before insert or update on public.records
  for each row execute function public.records_before_write();

-- Beveiliging per rij: iedereen ziet en wijzigt alleen de eigen gegevens.
alter table public.records enable row level security;

drop policy if exists "eigen records lezen" on public.records;
drop policy if exists "eigen records toevoegen" on public.records;
drop policy if exists "eigen records wijzigen" on public.records;
drop policy if exists "eigen records wissen" on public.records;
create policy "eigen records lezen"     on public.records for select to authenticated using ((select auth.uid()) = user_id);
create policy "eigen records toevoegen" on public.records for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "eigen records wijzigen"  on public.records for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "eigen records wissen"    on public.records for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.records to authenticated;
grant usage on sequence public.records_seq to authenticated;
