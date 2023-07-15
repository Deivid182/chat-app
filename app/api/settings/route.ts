import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from "@/app/libs/prismadb"
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json() 

    const { name, image } = body
    if(!currentUser?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        name,
        image
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.log(error, "ERROR_SETTINGS")
    return NextResponse.json({ message: "Internal Error" }, { status: 500 })
  }
}