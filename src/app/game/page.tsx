'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import ClientOnly from '@/components/ClientOnly'

// Define puzzle patterns
const PATTERNS = [
  {
    question: '❤️ 💕 ❤️ 💕 ❤️ ?',
    answer: '💕',
    hint: 'The pattern alternates between ❤️ and 💕'
  },
  {
    question: '💝 💖 💗 💖 💝 ?',
    answer: '💗',
    hint: 'Look at how the pattern mirrors itself'
  },
  {
    question: '❤️ 💓 💗 💓 ❤️ ?',
    answer: '💗',
    hint: 'The pattern repeats in reverse'
  },
  {
    question: '💘 💝 💖 💝 💘 ?',
    answer: '💖',
    hint: 'Notice how it goes out and comes back'
  },
  {
    question: '💖 💗 💖 💗 💖 ?',
    answer: '💗',
    hint: 'Simple alternating pattern'
  },
  {
    question: '💝 💖 💝 💖 💝 ?',
    answer: '💖',
    hint: 'Look for the repeating sequence'
  }
]

// Heart piece positions for a heart shape
const HEART_POSITIONS = [
  { top: '0%', left: '25%', rotate: '-45deg' },    // Top left of heart
  { top: '0%', left: '55%', rotate: '45deg' },     // Top right of heart
  { top: '20%', left: '10%', rotate: '-20deg' },   // Middle left
  { top: '20%', left: '70%', rotate: '20deg' },    // Middle right
  { top: '40%', left: '25%', rotate: '0deg' },     // Bottom left
  { top: '40%', left: '55%', rotate: '0deg' },     // Bottom right
]

export default function GamePage() {
  return (
    <ClientOnly>
      <GameContent />
    </ClientOnly>
  )
}

function GameContent() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [heartPieces, setHeartPieces] = useState(Array(6).fill(false))
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [message, setMessage] = useState('')
  const [showCongrats, setShowCongrats] = useState(false)
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleSubmitAnswer = () => {
    if (userAnswer === PATTERNS[currentPuzzle].answer) {
      const newHeartPieces = [...heartPieces]
      newHeartPieces[currentPuzzle] = true
      setHeartPieces(newHeartPieces)
      setMessage('Correct! You found a piece of the heart! ❤️')
      setUserAnswer('')
      setShowHint(false)
      
      // Check if all pieces are collected
      if (currentPuzzle === PATTERNS.length - 1) {
        setTimeout(() => {
          setShowCongrats(true)
        }, 1000)
      } else {
        setTimeout(() => {
          setCurrentPuzzle(prev => prev + 1)
          setMessage('')
        }, 2000)
      }
    } else {
      setMessage('Try again! Maybe use the hint? 💭')
    }
  }

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      {/* User Info Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {user?.photoURL && (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-gray-700">Welcome, {user?.displayName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl w-full space-y-8 mt-16">
        {/* Game Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Find My Heart</h1>
          <p className="text-gray-600">Complete puzzles to build your heart ❤️</p>
        </div>

        {/* Heart Visualization */}
        <div className="relative w-96 h-96 mx-auto">
          {heartPieces.map((isComplete, index) => (
            <motion.div
              key={index}
              className={`absolute w-32 h-32 ${
                isComplete ? 'bg-red-500' : 'bg-red-200'
              } rounded-full shadow-lg`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: isComplete ? 1 : 0.8,
                backgroundColor: isComplete ? '#ef4444' : '#fecaca'
              }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1 
              }}
              style={{
                top: HEART_POSITIONS[index].top,
                left: HEART_POSITIONS[index].left,
                transform: `rotate(${HEART_POSITIONS[index].rotate})`,
              }}
            />
          ))}
        </div>

        {/* Puzzle Area */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Pattern Puzzle {currentPuzzle + 1}</h2>
          <div className="space-y-4">
            <div className="text-2xl text-center mb-4">
              {PATTERNS[currentPuzzle].question}
            </div>
            
            <div className="flex gap-4 justify-center items-center">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button 
                onClick={handleSubmitAnswer}
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
              >
                Submit
              </button>
            </div>

            {message && (
              <div className={`text-center ${message.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-red-400 hover:text-red-500 transition-colors"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              {showHint && (
                <p className="mt-2 text-gray-600 italic">
                  Hint: {PATTERNS[currentPuzzle].hint}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Congratulations Popup */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setShowCongrats(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-8 text-center max-w-md mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-red-600 mb-4">
                Congratulations! 🎉
              </h2>
              <p className="text-xl mb-6">
                You've found all the pieces and completed the heart! ❤️
              </p>
              <button
                onClick={() => setShowCongrats(false)}
                className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
} 