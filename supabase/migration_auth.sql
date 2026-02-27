-- ============================================================
-- RLS Policies for Supabase Auth
-- Run this in Supabase Dashboard > SQL Editor after enabling
-- Google OAuth in Authentication > Providers
-- ============================================================

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow all on interview_sessions" ON interview_sessions;
DROP POLICY IF EXISTS "Allow all on messages" ON messages;
DROP POLICY IF EXISTS "Allow all on topic_mastery" ON topic_mastery;

-- interview_sessions: users can only access their own sessions
CREATE POLICY "Users can view own sessions"
  ON interview_sessions FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own sessions"
  ON interview_sessions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own sessions"
  ON interview_sessions FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- messages: users can access messages of their own sessions
CREATE POLICY "Users can view messages of own sessions"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = messages.session_id
      AND interview_sessions.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert messages to own sessions"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = messages.session_id
      AND interview_sessions.user_id = auth.uid()::text
    )
  );

-- topic_mastery: users can only access their own mastery records
CREATE POLICY "Users can view own topic mastery"
  ON topic_mastery FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own topic mastery"
  ON topic_mastery FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own topic mastery"
  ON topic_mastery FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
