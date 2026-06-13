"use server"

import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { createAdminClient, hasAdminClientConfig } from "@/lib/supabase/admin"

export type ActionResult = { ok: boolean; error?: string }

async function guard(): Promise<ActionResult | null> {
  const ok = await isAdminAuthenticated()
  if (!ok) return { ok: false, error: "Unauthorized." }
  if (!hasAdminClientConfig()) return { ok: false, error: "Database not connected." }
  return null
}

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------
async function updateRow(
  table: string,
  id: string,
  patch: Record<string, unknown>,
  revalidate: string,
): Promise<ActionResult> {
  const blocked = await guard()
  if (blocked) return blocked
  try {
    const db = createAdminClient()
    const { error } = await db.from(table).update(patch).eq("id", id)
    if (error) return { ok: false, error: error.message }
    revalidatePath(revalidate)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error." }
  }
}

async function deleteRow(table: string, id: string, revalidate: string): Promise<ActionResult> {
  const blocked = await guard()
  if (blocked) return blocked
  try {
    const db = createAdminClient()
    const { error } = await db.from(table).delete().eq("id", id)
    if (error) return { ok: false, error: error.message }
    revalidatePath(revalidate)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error." }
  }
}

async function insertRow(
  table: string,
  values: Record<string, unknown>,
  revalidate: string,
): Promise<ActionResult> {
  const blocked = await guard()
  if (blocked) return blocked
  try {
    const db = createAdminClient()
    const { error } = await db.from(table).insert(values)
    if (error) return { ok: false, error: error.message }
    revalidatePath(revalidate)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error." }
  }
}

// ---------------------------------------------------------------------------
// Students
// ---------------------------------------------------------------------------
export async function setStudentStatus(id: string, status: "active" | "suspended") {
  return updateRow("profiles", id, { status }, "/admin/students")
}

// ---------------------------------------------------------------------------
// Enrollments
// ---------------------------------------------------------------------------
export async function setEnrollmentStatus(
  id: string,
  status: "pending" | "active" | "completed" | "rejected",
) {
  return updateRow("enrollments", id, { status }, "/admin/enrollments")
}

// ---------------------------------------------------------------------------
// Membership applications
// ---------------------------------------------------------------------------
export async function setApplicationStatus(
  id: string,
  status: "pending" | "approved" | "rejected",
) {
  return updateRow("membership_applications", id, { status }, "/admin/applications")
}

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------
export async function setMessageStatus(id: string, status: "new" | "replied" | "archived") {
  return updateRow("contact_messages", id, { status }, "/admin/messages")
}
export async function deleteMessage(id: string) {
  return deleteRow("contact_messages", id, "/admin/messages")
}

// ---------------------------------------------------------------------------
// Programs
// ---------------------------------------------------------------------------
export async function setProgramStatus(id: string, status: "draft" | "published" | "archived") {
  const isPublished = status === "published"
  return updateRow("programs", id, { is_published: isPublished }, "/admin/programs")
}
export async function deleteProgram(id: string) {
  return deleteRow("programs", id, "/admin/programs")
}
export async function createProgram(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim()
  const slug =
    String(formData.get("slug") ?? "").trim() ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  
  // Parse outcomes if provided
  let outcomes = []
  try {
    const outcomesStr = String(formData.get("outcomes") ?? "")
    if (outcomesStr) outcomes = JSON.parse(outcomesStr)
  } catch {}
  
  return insertRow(
    "programs",
    {
      title,
      slug,
      category: String(formData.get("category") ?? "pharmacists"),
      category_label: String(formData.get("category_label") ?? "Pharmacists"),
      level: String(formData.get("level") ?? "Certificate"),
      mode: String(formData.get("mode") ?? "Online"),
      duration: String(formData.get("duration") ?? ""),
      fees_ksh: Number(formData.get("fees_ksh") ?? 0),
      summary: String(formData.get("summary") ?? ""),
      description: String(formData.get("description") ?? ""),
      outcomes,
      thumbnail_url: String(formData.get("thumbnail_url") ?? ""),
      featured: String(formData.get("featured") ?? "false") === "true",
      is_published: false,
    },
    "/admin/programs",
  )
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------
export async function deleteNews(id: string) {
  return deleteRow("news", id, "/admin/news")
}
export async function setNewsPublished(id: string, published: boolean) {
  return updateRow("news", id, { published }, "/admin/news")
}
export async function createNews(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim()
  const slug =
    String(formData.get("slug") ?? "").trim() ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  return insertRow(
    "news",
    {
      title,
      slug,
      excerpt: String(formData.get("excerpt") ?? ""),
      body: String(formData.get("body") ?? ""),
      category: String(formData.get("category") ?? "News"),
      published: formData.get("published") === "on",
    },
    "/admin/news",
  )
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
export async function deleteEvent(id: string) {
  return deleteRow("events", id, "/admin/events")
}
export async function createEvent(formData: FormData) {
  const startsAt = String(formData.get("starts_at") ?? "")
  return insertRow(
    "events",
    {
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? ""),
      location: String(formData.get("location") ?? ""),
      starts_at: startsAt ? new Date(startsAt).toISOString() : null,
      speakers: String(formData.get("speakers") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    },
    "/admin/events",
  )
}

// ---------------------------------------------------------------------------
// Research
// ---------------------------------------------------------------------------
export async function deleteResearch(id: string) {
  return deleteRow("research_projects", id, "/admin/research")
}
export async function createResearch(formData: FormData) {
  return insertRow(
    "research_projects",
    {
      title: String(formData.get("title") ?? "").trim(),
      area: String(formData.get("area") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      status: String(formData.get("status") ?? "active"),
    },
    "/admin/research",
  )
}
export async function deletePublication(id: string) {
  return deleteRow("publications", id, "/admin/research")
}
export async function createPublication(formData: FormData) {
  return insertRow(
    "publications",
    {
      title: String(formData.get("title") ?? "").trim(),
      authors: String(formData.get("authors") ?? ""),
      journal: String(formData.get("journal") ?? ""),
      year: Number(formData.get("year") ?? new Date().getFullYear()),
      url: String(formData.get("url") ?? ""),
    },
    "/admin/research",
  )
}

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------
export async function deleteResource(id: string) {
  return deleteRow("resources", id, "/admin/resources")
}
export async function createResource(formData: FormData) {
  return insertRow(
    "resources",
    {
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? ""),
      category: String(formData.get("category") ?? ""),
      file_url: String(formData.get("file_url") ?? ""),
      access: String(formData.get("access") ?? "public"),
    },
    "/admin/resources",
  )
}

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------
export async function deletePartner(id: string) {
  return deleteRow("partners", id, "/admin/partners")
}
export async function createPartner(formData: FormData) {
  return insertRow(
    "partners",
    {
      name: String(formData.get("name") ?? "").trim(),
      logo_url: String(formData.get("logo_url") ?? ""),
      website_url: String(formData.get("website_url") ?? ""),
      description: String(formData.get("description") ?? ""),
      display_order: Number(formData.get("display_order") ?? 0),
    },
    "/admin/partners",
  )
}
