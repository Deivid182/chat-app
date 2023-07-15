import { User, Conversation, Message } from '@prisma/client';

export type FullMessageType = Message & {
  sender: User;
  seen: User[]
}

export type FullConversationType = Conversation & {
  messages: FullMessageType[];
  users: User[]
}