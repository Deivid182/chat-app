import prisma from "@/app/libs/prismadb"
import bcrypt from "bcrypt"
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if(!email || !password || !name) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword
      }
    })

    return NextResponse.json(user)

  } catch (error: any) {
    console.log(error, "REGISTER ERROR")
    return NextResponse.json({ message: "Email already in use" }, { status: 400 })
  }
}