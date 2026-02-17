import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { email } = req.body

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required.' })
    }

    const trimmed = email.trim().toLowerCase()

    if (!isValidEmail(trimmed)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' })
    }

    try {
        // Check if email already exists
        const { data: existing, error: checkError } = await supabase
            .from('email_signups')
            .select('email')
            .eq('email', trimmed)
            .single()

        if (checkError && checkError.code !== 'PGRST116') {
            // PGRST116 is "not found" which is expected for new emails
            console.error('Error checking email:', checkError)
            return res.status(500).json({ error: 'Database error. Please try again.' })
        }

        if (existing) {
            return res.status(409).json({ error: 'This email is already on the waitlist!' })
        }

        // Insert new email
        const { error: insertError } = await supabase
            .from('email_signups')
            .insert([{ email: trimmed }])

        if (insertError) {
            console.error('Error inserting email:', insertError)
            return res.status(500).json({ error: 'Failed to save email. Please try again.' })
        }

        console.log(`[Beta Signup] New signup: ${trimmed}`)

        return res.json({ message: "You're on the list! We'll be in touch soon." })
    } catch (error) {
        console.error('Unexpected error:', error)
        return res.status(500).json({ error: 'Something went wrong. Please try again.' })
    }
}
