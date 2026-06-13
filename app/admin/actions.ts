"use server"

import { redirect } from "next/navigation"
import {
  validateAdminCredentials,
  createAdminSession,
  destroyAdminSession,
} from "@/lib/admin-auth"

export type AdminLoginState = { error: string | null }

export async function adminLoginAction(
  _prev: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Please enter your email and password." }
  }

  if (!validateAdminCredentials(email, password)) {
    return { error: "Invalid administrator credentials." }
  }

  await createAdminSession()
  redirect("/admin")
}

export async function adminLogoutAction() {
  await destroyAdminSession()
  redirect("/admin/login")
}
