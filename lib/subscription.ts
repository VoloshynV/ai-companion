import { auth } from '@clerk/nextjs'

import prismadb from '@/lib/prismadb'

const DAY_IN_MS = 1000 * 60 * 60 * 24

export const checkSubscription = async () => {
  const { userId } = auth()

  if (!userId) {
    return false
  }

  const userSubscription = await prismadb.userSubscription.findFirst({
    where: {
      userId,
    },
    select: {
      striptCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
      stripeSubscriptionId: true,
    },
  })
  if (!userSubscription) {
    return false
  }

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.striptCurrentPeriodEnd!.getTime() + DAY_IN_MS > Date.now()

  return !!isValid
}
