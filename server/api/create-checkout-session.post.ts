import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2026-04-22.dahlia' })

  const body = await readBody(event)
  const { userId, userEmail } = body as { userId: string; userEmail: string }

  if (!userId || !userEmail) {
    throw createError({ statusCode: 400, statusMessage: 'userId and userEmail are required' })
  }

  const origin = getRequestHeader(event, 'origin') || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: userEmail,
    line_items: [{ price: 'price_1TQtGfPCOVqRy0WVjmPRrZD4', quantity: 1 }],
    metadata: { userId },
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/upgrade`,
  })

  return { url: session.url }
})
