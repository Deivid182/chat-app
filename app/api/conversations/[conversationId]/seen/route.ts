import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from "@/app/libs/prismadb"
import { pusherServer } from '@/app/libs/pusher';

interface IParams {
  conversationId?: string;
}

export async function POST( request: Request, { params } : { params: IParams }) {
  const { conversationId } = params; 
  try {
    const currentUser = await getCurrentUser()
    if(!currentUser?.id || !currentUser?.email) return NextResponse.json({ message: "Unauthorized" },  { status: 401 } )

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        messages: {
          include: {
            seen: true
          }
        }
      }
    })

    if(!existingConversation) return NextResponse.json({ message: "Conversation not found" })

    const lastMessage = existingConversation.messages[existingConversation.messages.length - 1]

    if(!lastMessage) return NextResponse.json(existingConversation)

    //update seen of last message

    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      },
      include: {
        seen: true,
        sender: true
      }
    })  

    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage]
    })

    if(lastMessage.seenIds.indexOf(currentUser.id) !== -1){
      return NextResponse.json(existingConversation)
    }

    await pusherServer.trigger(conversationId!, 'message:update', updatedMessage)

    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.log(error, "ERROR_MESSAGES_SEEN")
    return NextResponse.json({ message: 'Something went wrong trying to fetch seen' }, { status: 500 } )
  }
}