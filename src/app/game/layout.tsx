'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ClientOnly from '@/components/ClientOnly'

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientOnly>
      <AuthCheck>{children}</AuthCheck>
    </ClientOnly>
  )
}

function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl text-red-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
} 