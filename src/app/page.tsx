'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ClientOnly from '@/components/ClientOnly'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8 text-red-600">
          Find My Heart ❤️
        </h1>
        
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <p className="text-lg mb-6">
            A special puzzle game for you and your loved one to play together, even when apart.
          </p>
          
          <ClientOnly>
            <AuthContent />
          </ClientOnly>
        </div>
      </div>
    </main>
  )
}

function AuthContent() {
  const { user, signInWithGoogle, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div className="text-red-600">Loading...</div>
  }

  const handleStartPlaying = () => {
    router.push('/game')
  }

  return (
    <div className="space-y-4">
      {user ? (
        <button 
          onClick={handleStartPlaying}
          className="inline-block bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors"
        >
          Start Playing
        </button>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="inline-flex items-center bg-white border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors"
        >
          <Image 
            src="/images/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Sign in with Google
        </button>
      )}
    </div>
  )
}
