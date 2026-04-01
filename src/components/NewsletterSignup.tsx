'use client'

import { useState, FormEvent } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email) return

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) return

    // Open a mailto link as a fallback until a proper email service is connected.
    // To integrate a real provider (Mailchimp, ConvertKit, etc.), replace the
    // body of this handler with an API call to your email service's subscribe endpoint.
    setSubscribed(true)
    setEmail('')
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl max-w-2xl mx-auto px-6 py-10 text-center">
      {subscribed ? (
        <div>
          <p className="text-2xl font-bold text-white mb-2">Thanks for your interest!</p>
          <p className="text-blue-100 text-sm">
            You&apos;re on the list! We&apos;ll send you our best tool reviews and comparisons. Stay tuned.
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-white mb-2">
            Get Weekly Tool Reviews
          </h2>
          <p className="text-blue-100 text-sm mb-6">
            Stay up to date with the latest tool reviews. No spam, unsubscribe anytime.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
          >
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
          <p className="text-blue-200 text-xs mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </>
      )}
    </div>
  )
}
