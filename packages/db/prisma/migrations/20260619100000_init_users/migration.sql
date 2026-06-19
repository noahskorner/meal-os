create table "public"."users" (
  "id" uuid not null,
  "created_at" timestamptz(6) not null default now(),
  "updated_at" timestamptz(6) not null default now(),
  constraint "users_pkey" primary key ("id"),
  constraint "users_id_fkey"
    foreign key ("id")
    references "auth"."users" ("id")
    on delete cascade
    on update cascade
);

alter table "public"."users" enable row level security;

grant select, insert, update, delete on table "public"."users" to authenticated;

create policy "users_select_own"
on "public"."users"
for select
to authenticated
using (auth.uid() = id);

create policy "users_insert_own"
on "public"."users"
for insert
to authenticated
with check (auth.uid() = id);

create policy "users_update_own"
on "public"."users"
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
