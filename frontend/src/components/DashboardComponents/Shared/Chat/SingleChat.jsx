import React, { useEffect, useState } from 'react';
import ChatBody from './ChatBody';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import EmptyState from './EmptyState';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/store/authStore';
import { useChat } from '@/hooks/use-chat';
import { useSocket } from '@/hooks/use-socket';
import { useParams } from 'react-router';

const SingleChat = () => {
  const chatId = useParams()?.id;
  const { fetchSingleChat, isSingleChatLoading, singleChat } = useChat();
  const { socket } = useSocket();
  const { user } = useAuthStore();

  const [replyTo, setReplyTo] = useState(null);

  const currentUserId = user?._id || null;
  let chat = singleChat?.chat;
  let messages = singleChat?.messages || [];

  useEffect(() => {
    if (!chatId) return;
    fetchSingleChat(chatId);
  }, [fetchSingleChat, chatId]);

  // Join/leave socket room on chatId change
  useEffect(() => {
    if (!chatId || !socket) return;

    socket.emit('chat:join', chatId);
    return () => {
      socket.emit('chat:leave', chatId);
    };
  }, [chatId, socket]);

  if (isSingleChatLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner className="w-11 h-11 !text-primary" />
      </div>
    );
  }

  // Re-read after loading completes
  chat = singleChat?.chat;
  messages = singleChat?.messages || [];

  if (!chat) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Conversation not found.</p>
      </div>
    );
  }

  return (
    <div className="relative h-svh flex flex-col">
      <ChatHeader chat={chat} currentUserId={currentUserId} />

      <div className="flex-1 overflow-y-auto bg-background">
        {messages.length === 0 ? (
          <EmptyState
            title="Start the conversation"
            description="No messages yet — send the first one!"
          />
        ) : (
          <ChatBody chatId={chatId} messages={messages} onReply={setReplyTo} />
        )}
      </div>

      <ChatFooter
        replyTo={replyTo}
        chatId={chatId}
        currentUserId={currentUserId}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
};

export default SingleChat;
