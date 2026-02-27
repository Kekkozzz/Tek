-- ══════════════════════════════════════════════════
-- Fix RLS Policies — Replace permissive USING(true)
-- Run this in the Supabase SQL Editor
-- ══════════════════════════════════════════════════

-- Drop old permissive policies
DROP POLICY IF EXISTS "Allow all on interview_sessions" ON interview_sessions;
DROP POLICY IF EXISTS "Allow all on messages" ON messages;
DROP POLICY IF EXISTS "Allow all on topic_mastery" ON topic_mastery;

-- ── interview_sessions ──
-- Users can only see/modify their own sessions
CREATE POLICY "Users manage own sessions"
  ON interview_sessions FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ── messages ──
-- Users can only access messages belonging to their sessions
CREATE POLICY "Users manage own messages"
  ON messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = messages.session_id
        AND interview_sessions.user_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = messages.session_id
        AND interview_sessions.user_id = auth.uid()::text
    )
  );

-- ── topic_mastery ──
-- Users can only see/modify their own topic mastery
CREATE POLICY "Users manage own topics"
  ON topic_mastery FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
