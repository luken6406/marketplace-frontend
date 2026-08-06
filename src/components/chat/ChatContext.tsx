import React, { createContext, useContext, useState } from 'react';

interface ActiveContact {
  id: number;
  name: string;
}

interface ChatContextType {
  activeContact: ActiveContact | null;
  openChatWith: (id: number, name: string) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [activeContact, setActiveContact] = useState<ActiveContact | null>(null);

  const openChatWith = (id: number, name: string) => {
    setActiveContact({ id, name });
  };

  const closeChat = () => {
    setActiveContact(null);
  };

  return (
    <ChatContext.Provider value={{ activeContact, openChatWith, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat deve ser usado dentro de um ChatProvider');
  }
  return context;
}