alter table "public"."users" rename to "profiles";

alter table "public"."profiles"
  rename constraint "users_pkey" to "profiles_pkey";

alter table "public"."profiles"
  rename constraint "users_id_fkey" to "profiles_id_fkey";

alter policy "users_select_own"
on "public"."profiles"
rename to "profiles_select_own";

alter policy "users_insert_own"
on "public"."profiles"
rename to "profiles_insert_own";

alter policy "users_update_own"
on "public"."profiles"
rename to "profiles_update_own";
