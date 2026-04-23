# Supabase RLS Security Policy Directive

**Goal:** Resolve Supabase warnings about Row Level Security (RLS) being disabled on public tables without breaking the current application's functionality.

## Target Tables:
- `room_participants`
- `game_assets`
- `interactions`
- `room_state`

## Instructions for the Agent:
1. **Enable RLS:** You must generate a Supabase migration to enable Row Level Security on the target tables listed above. Use the following command for each table:
   `ALTER TABLE public.[table_name] ENABLE ROW LEVEL SECURITY;`

2. **Permissive Policies (Crucial):** Because the current application logic relies on these tables being publicly accessible (and we do not want to rewrite the app logic right now), you MUST create a fully permissive policy for each table. This policy should allow ALL operations (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) for all roles, effectively keeping the tables open while satisfying the security linter.
   - You must use this exact policy structure for every target table:
     ```sql
     CREATE POLICY "Allow public access" 
     ON public.[table_name] 
     FOR ALL 
     USING (true) 
     WITH CHECK (true);
     ```

3. **No App Code Changes:** Do NOT modify the application's frontend or backend code to include authentication logic, headers, or state changes. The goal is purely to silence the Supabase security warnings by enabling RLS with an open policy at the database level.
