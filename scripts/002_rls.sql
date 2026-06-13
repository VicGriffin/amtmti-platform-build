-- AMTMTI Platform — Row Level Security policies
-- Run after 001_schema.sql

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.program_categories enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.payments enable row level security;
alter table public.resources enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.research_projects enable row level security;
alter table public.publications enable row level security;
alter table public.membership_applications enable row level security;
alter table public.contact_messages enable row level security;
alter table public.partners enable row level security;
alter table public.notifications enable row level security;
alter table public.certificates enable row level security;

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Public-readable content (anyone can read, only admins can write)
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'programs','program_categories','lessons','news','events',
    'research_projects','publications','partners'
  ] loop
    execute format('drop policy if exists "%s_public_read" on public.%I', t, t);
    execute format('create policy "%s_public_read" on public.%I for select using (true)', t, t);

    execute format('drop policy if exists "%s_admin_write" on public.%I', t, t);
    execute format('create policy "%s_admin_write" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Resources (public + course/member readable by signed-in users)
-- ---------------------------------------------------------------------------
drop policy if exists "resources_read" on public.resources;
create policy "resources_read" on public.resources
  for select using (access = 'public' or auth.uid() is not null);

drop policy if exists "resources_admin_write" on public.resources;
create policy "resources_admin_write" on public.resources
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Enrollments (own rows; admins see all)
-- ---------------------------------------------------------------------------
drop policy if exists "enrollments_select" on public.enrollments;
create policy "enrollments_select" on public.enrollments
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "enrollments_insert" on public.enrollments;
create policy "enrollments_insert" on public.enrollments
  for insert with check (auth.uid() = user_id);

drop policy if exists "enrollments_update" on public.enrollments;
create policy "enrollments_update" on public.enrollments
  for update using (auth.uid() = user_id or public.is_admin());

drop policy if exists "enrollments_delete" on public.enrollments;
create policy "enrollments_delete" on public.enrollments
  for delete using (auth.uid() = user_id or public.is_admin());

-- ---------------------------------------------------------------------------
-- Payments (own rows; admins see all)
-- ---------------------------------------------------------------------------
drop policy if exists "payments_select" on public.payments;
create policy "payments_select" on public.payments
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "payments_insert" on public.payments;
create policy "payments_insert" on public.payments
  for insert with check (auth.uid() = user_id);

drop policy if exists "payments_admin_update" on public.payments;
create policy "payments_admin_update" on public.payments
  for update using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Certificates (own rows; admins manage)
-- ---------------------------------------------------------------------------
drop policy if exists "certificates_select" on public.certificates;
create policy "certificates_select" on public.certificates
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "certificates_admin_write" on public.certificates;
create policy "certificates_admin_write" on public.certificates
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Notifications (own rows + global broadcasts where user_id is null)
-- ---------------------------------------------------------------------------
drop policy if exists "notifications_select" on public.notifications;
create policy "notifications_select" on public.notifications
  for select using (user_id is null or auth.uid() = user_id or public.is_admin());

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = user_id or public.is_admin());

drop policy if exists "notifications_admin_write" on public.notifications;
create policy "notifications_admin_write" on public.notifications
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Membership applications (anyone may submit; admins manage)
-- ---------------------------------------------------------------------------
drop policy if exists "membership_insert" on public.membership_applications;
create policy "membership_insert" on public.membership_applications
  for insert with check (true);

drop policy if exists "membership_select" on public.membership_applications;
create policy "membership_select" on public.membership_applications
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "membership_admin_write" on public.membership_applications;
create policy "membership_admin_write" on public.membership_applications
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Contact messages (anyone may submit; only admins read/manage)
-- ---------------------------------------------------------------------------
drop policy if exists "contact_insert" on public.contact_messages;
create policy "contact_insert" on public.contact_messages
  for insert with check (true);

drop policy if exists "contact_admin_read" on public.contact_messages;
create policy "contact_admin_read" on public.contact_messages
  for select using (public.is_admin());

drop policy if exists "contact_admin_write" on public.contact_messages;
create policy "contact_admin_write" on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());
