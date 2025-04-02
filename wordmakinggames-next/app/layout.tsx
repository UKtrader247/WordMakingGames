import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Word Making Games - Fun Educational Word Quizzes',
  description: 'Play fun and educational word games to improve your vocabulary and knowledge. Free online word quizzes and puzzles. Perfect for students, teachers, and word game enthusiasts.',
  keywords: 'word games, educational games, vocabulary games, word puzzles, online quizzes, learning games, educational quizzes, word challenges, brain games, educational entertainment',
  authors: [{ name: 'Sarder Iftekhar' }],
  creator: 'Sarder Iftekhar',
  publisher: 'Sarder Iftekhar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://wordmakinggames.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Word Making Games - Fun Educational Word Quizzes',
    description: 'Play fun and educational word games to improve your vocabulary and knowledge. Free online word quizzes and puzzles.',
    url: 'https://wordmakinggames.com',
    siteName: 'Word Making Games',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Word Making Games - Educational Word Quizzes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word Making Games - Fun Educational Word Quizzes',
    description: 'Play fun and educational word games to improve your vocabulary and knowledge. Free online word quizzes and puzzles.',
    images: ['/og-image.jpg'],
    creator: '@sarderiftekhar',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          {children}
        </main>
      </body>
    </html>
  )
} 