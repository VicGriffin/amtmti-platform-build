-- AMTMTI Platform RLS (Row-Level Security) Policies
-- Policies ensure students see only their own data, admins can manage everything

-- ============================================================================
-- PROFILES RLS
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Students can view and update their own profile
CREATE POLICY "Students can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Students can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- PROGRAMS RLS
-- ============================================================================

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Public: Everyone can view published programs
CREATE POLICY "Published programs are publicly visible"
  ON programs FOR SELECT
  USING (is_published = true);

-- Admins can view all programs
CREATE POLICY "Admins can view all programs"
  ON programs FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admins can create/update/delete programs
CREATE POLICY "Only admins can create programs"
  ON programs FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can update programs"
  ON programs FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can delete programs"
  ON programs FOR DELETE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- COURSES & LESSONS RLS
-- ============================================================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Students can only view courses/lessons from programs they're enrolled in
CREATE POLICY "Enrolled students can view courses"
  ON courses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.program_id = courses.program_id
      AND enrollments.student_id = auth.uid()
      AND enrollments.status IN ('active', 'completed')
    )
  );

CREATE POLICY "Enrolled students can view lessons"
  ON lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lessons.course_id
      AND EXISTS (
        SELECT 1 FROM enrollments
        WHERE enrollments.program_id = courses.program_id
        AND enrollments.student_id = auth.uid()
        AND enrollments.status IN ('active', 'completed')
      )
    )
  );

-- Admins can view all courses and lessons
CREATE POLICY "Admins can view all courses"
  ON courses FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can view all lessons"
  ON lessons FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admins can manage courses and lessons
CREATE POLICY "Only admins can manage courses"
  ON courses FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can manage lessons"
  ON lessons FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- ENROLLMENTS RLS
-- ============================================================================

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Students can view their own enrollments
CREATE POLICY "Students can view their own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = student_id);

-- Students can create enrollments (enroll in programs)
CREATE POLICY "Students can enroll in programs"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Students can update their own enrollment status (view progress)
CREATE POLICY "Students can view their enrollment progress"
  ON enrollments FOR UPDATE
  USING (auth.uid() = student_id AND status != 'completed')
  WITH CHECK (auth.uid() = student_id);

-- Admins can view all enrollments
CREATE POLICY "Admins can view all enrollments"
  ON enrollments FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admins can manage enrollments
CREATE POLICY "Admins can manage enrollments"
  ON enrollments FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- ENROLLMENT LESSONS RLS
-- ============================================================================

ALTER TABLE enrollment_lessons ENABLE ROW LEVEL SECURITY;

-- Students can view and update their own lesson progress
CREATE POLICY "Students can track their lesson progress"
  ON enrollment_lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = enrollment_lessons.enrollment_id
      AND enrollments.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can mark lessons as complete"
  ON enrollment_lessons FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = enrollment_lessons.enrollment_id
      AND enrollments.student_id = auth.uid()
      AND enrollments.status IN ('active', 'completed')
    )
  );

-- Admins can view all progress
CREATE POLICY "Admins can view lesson progress"
  ON enrollment_lessons FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- PAYMENTS RLS
-- ============================================================================

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Students can view their own payments
CREATE POLICY "Students can view their own payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = payments.enrollment_id
      AND enrollments.student_id = auth.uid()
    )
  );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admins can update payment status
CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- NEWS & EVENTS RLS
-- ============================================================================

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public: Everyone can view published news
CREATE POLICY "Published news is publicly visible"
  ON news FOR SELECT
  USING (is_published = true);

-- Admins can view all news
CREATE POLICY "Admins can view all news"
  ON news FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admins can manage news
CREATE POLICY "Only admins can create news"
  ON news FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can update news"
  ON news FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can delete news"
  ON news FOR DELETE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Public: Everyone can view published events
CREATE POLICY "Published events are publicly visible"
  ON events FOR SELECT
  USING (is_published = true);

-- Admins can view all events
CREATE POLICY "Admins can view all events"
  ON events FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admins can manage events
CREATE POLICY "Only admins can manage events"
  ON events FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- RESEARCH RLS
-- ============================================================================

ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;

-- Public: Everyone can view published research
CREATE POLICY "Published research is publicly visible"
  ON research_projects FOR SELECT
  USING (is_published = true);

CREATE POLICY "Research publications are publicly visible"
  ON publications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM research_projects
      WHERE research_projects.id = publications.research_project_id
      AND research_projects.is_published = true
    )
  );

-- Admins can view all research
CREATE POLICY "Admins can view all research"
  ON research_projects FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admins can manage research
CREATE POLICY "Only admins can manage research"
  ON research_projects FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can manage publications"
  ON publications FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can manage collaborations"
  ON collaborations FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- RESOURCES RLS
-- ============================================================================

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Students can view resources from programs they're enrolled in
CREATE POLICY "Enrolled students can view program resources"
  ON resources FOR SELECT
  USING (
    access_level = 'public'
    OR (
      access_level = 'members'
      AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'student'
    )
    OR (
      program_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM enrollments
        WHERE enrollments.program_id = resources.program_id
        AND enrollments.student_id = auth.uid()
      )
    )
  );

-- Admins can view all resources
CREATE POLICY "Admins can view all resources"
  ON resources FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admins can manage resources
CREATE POLICY "Only admins can manage resources"
  ON resources FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- MEMBERSHIP APPLICATIONS RLS
-- ============================================================================

ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
  ON membership_applications FOR SELECT
  USING (auth.user_email() = email);

-- Anyone can create applications
CREATE POLICY "Anyone can create applications"
  ON membership_applications FOR INSERT
  WITH CHECK (true);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON membership_applications FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admins can update applications
CREATE POLICY "Admins can update applications"
  ON membership_applications FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- PARTNERS RLS
-- ============================================================================

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Public: Everyone can view active partners
CREATE POLICY "Active partners are publicly visible"
  ON partners FOR SELECT
  USING (is_active = true);

-- Admins can view all partners
CREATE POLICY "Admins can view all partners"
  ON partners FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admins can manage partners
CREATE POLICY "Only admins can manage partners"
  ON partners FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- CONTACT MESSAGES RLS
-- ============================================================================

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can create contact messages
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Users can view their own messages
CREATE POLICY "Users can view their own messages"
  ON contact_messages FOR SELECT
  USING (auth.user_email() = email);

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
  ON contact_messages FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admins can manage messages
CREATE POLICY "Admins can manage messages"
  ON contact_messages FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- NEWSLETTER RLS
-- ============================================================================

ALTER TABLE newsletter_emails ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_emails FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- CERTIFICATES RLS
-- ============================================================================

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Students can view their own certificates
CREATE POLICY "Students can view their own certificates"
  ON certificates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = certificates.enrollment_id
      AND enrollments.student_id = auth.uid()
    )
  );

-- Public: Anyone can verify a certificate with token
CREATE POLICY "Public can verify certificates"
  ON certificates FOR SELECT
  USING (verification_token IS NOT NULL);

-- Admins can manage certificates
CREATE POLICY "Admins can view all certificates"
  ON certificates FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can manage certificates"
  ON certificates FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- NOTIFICATIONS RLS
-- ============================================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Students can view their own notifications
CREATE POLICY "Students can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- System can create notifications
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Students can update their notifications (mark as read)
CREATE POLICY "Students can update their notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- AUDIT LOGS RLS
-- ============================================================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admins can create audit logs
CREATE POLICY "Only admins can create audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
