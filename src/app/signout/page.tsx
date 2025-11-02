"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { OctoLabIcon } from "~/components/ui/octolab-icon"

export default function SignOutPage() {
  useEffect(() => {
    // Automatically sign out and redirect to signin page
    void signOut({ callbackUrl: "/signin" })
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <OctoLabIcon />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Signing out...</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please wait while we sign you out
        </p>
      </div>
    </div>
  )
}
