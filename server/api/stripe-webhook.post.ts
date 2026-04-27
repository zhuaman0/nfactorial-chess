import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2026-04-22.dahlia' })

  const sig = getRequestHeader(event, 'stripe-signature')
  const rawBody = await readRawBody(event)

  if (!sig || !rawBody) {
    throw createError({ statusCode: 400, statusMessage: 'Missing stripe-signature or body' })
  }

  let stripeEvent: Stripe.Event
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, config.stripeWebhookSecret)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Webhook signature verification failed' })
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId

    if (userId) {
      // Use service role key to bypass RLS for this trusted server operation
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        config.supabaseServiceKey,
      )
      await supabase.from('profiles').update({ is_pro: true }).eq('id', userId)
    }
  }

  return { received: true }
})
