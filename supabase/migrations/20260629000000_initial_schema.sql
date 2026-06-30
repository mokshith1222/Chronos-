-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Workspaces Table
create table public.workspaces (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Profiles Table (Extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  active_workspace_id uuid references public.workspaces(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Workspace Members (Many-to-Many for Profiles <-> Workspaces)
create table public.workspace_members (
  workspace_id uuid references public.workspaces(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text check (role in ('owner', 'admin', 'member')) default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (workspace_id, user_id)
);

-- 3. Projects Table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  name text not null,
  color text default '#000000',
  is_archived boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tasks Table
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  status text check (status in ('todo', 'in_progress', 'done')) default 'todo',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Time Entries Table (The core ledger)
create table public.time_entries (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  -- duration is stored in seconds for easy math, can be calculated on read
  duration integer, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
alter table public.workspaces enable row level security;
alter table public.profiles enable row level security;
alter table public.workspace_members enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.time_entries enable row level security;

-- Profiles: Users can only read/update their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Workspaces: Users can only see workspaces they are members of
create policy "Users can view their workspaces" on public.workspaces for select 
using (id in (select workspace_id from public.workspace_members where user_id = auth.uid()));

-- Projects: Bound to workspace membership
create policy "Users can view workspace projects" on public.projects for select 
using (workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()));

create policy "Users can create projects in their workspaces" on public.projects for insert 
with check (workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()));

-- Tasks: Bound to project access
create policy "Users can view project tasks" on public.tasks for select 
using (project_id in (select id from public.projects where workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid())));

-- Time Entries: Bound to workspace
create policy "Users can view workspace time entries" on public.time_entries for select 
using (workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid()));

create policy "Users can insert own time entries" on public.time_entries for insert 
with check (user_id = auth.uid());

create policy "Users can update own time entries" on public.time_entries for update 
using (user_id = auth.uid());

-- ==========================================
-- REALTIME SUBSCRIPTIONS
-- ==========================================
-- To make the app feel "alive", we enable realtime for the core tables
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.time_entries;
