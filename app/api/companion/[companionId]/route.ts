import prismadb from '@/lib/prismadb'
import { currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { companionId: string } }) {
  try {
    const body = await req.json()
    const user = await currentUser()
    const { src, name, description, instructions, seed, categoryId } = body

    if (!params.companionId) {
      return new NextResponse('Missing companionId', { status: 400 })
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!src || !name || !description || !instructions || !seed || !categoryId) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // TODO: check for subscription

    const companion = await prismadb.companion.update({
      where: {
        id: params.companionId,
      },
      data: {
        categoryId,
        description,
        instructions,
        name,
        seed,
        src,
        userId: user.id,
        userName: user.firstName,
      },
    })

    return NextResponse.json(companion)
  } catch (error) {
    console.log('[COMPANION_PATCH] Error: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
