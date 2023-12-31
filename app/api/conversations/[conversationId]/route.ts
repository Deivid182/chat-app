import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from "@/app/libs/prismadb"
import { pusherServer } from '@/app/libs/pusher';

interface IParams {
  conversationId?: string
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
  const { conversationId } = params;

  try {
    const currentUser = await getCurrentUser()
    if(!currentUser?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true
      }
    })

    if(!existingConversation) return NextResponse.json({ message: "Conversation not found" }, { status: 404 })

    const deletedConversation =await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        }
      }
    })

    existingConversation.users.forEach(user => {
      if(user.email){
        pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
      }
    })

    return NextResponse.json(deletedConversation)

  } catch (error) {
    console.log(error, "ERROR_CONVERSATION_DELETE")
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}