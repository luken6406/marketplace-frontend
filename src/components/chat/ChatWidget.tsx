import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  createdAt: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
}

export interface ChatWidgetProps {
  activeContactId?: number | null;
  activeContactName?: string | null;
  onClose?: () => void;
}

export function ChatWidget({ activeContactId = null, activeContactName = null, onClose }: ChatWidgetProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  const isSelfChat = selectedContact?.id === user?.id;

  useEffect(() => {
    if (activeContactId && activeContactName) {
      setSelectedContact({ id: activeContactId, name: activeContactName, email: '' });
      setIsOpen(true);
    }
  }, [activeContactId, activeContactName]);

  useEffect(() => {
    if (!user?.id || !isOpen) return;

    async function fetchContacts() {
      try {
        const res = await fetch(`${API_URL}/api/conversations?userId=${user?.id}`);
        if (res.ok) {
          const data = await res.json();
          setContacts(data);
        }
      } catch (err) {
        console.error('Erro ao buscar contatos:', err);
      }
    }

    fetchContacts();
  }, [user?.id, isOpen]);

  useEffect(() => {
    if (!user?.id || !selectedContact?.id || !isOpen) return;

    async function fetchMessages() {
      try {
        const res = await fetch(
          `${API_URL}/api/messages?userId=${user?.id}&contactId=${selectedContact?.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error('Erro ao buscar mensagens:', err);
      }
    }

    fetchMessages();
    const timer = setInterval(fetchMessages, 3000);

    return () => clearInterval(timer);
  }, [user?.id, selectedContact?.id, isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id || !selectedContact?.id || isSelfChat) return;

    const messageText = newMessage;
    setNewMessage('');

    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: selectedContact.id,
          text: messageText,
        }),
      });

      if (res.ok) {
        const createdMessage = await res.json();
        setMessages((prev) => [...prev, createdMessage]);
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3.5 rounded-full shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-2 text-base"
        >
          <span>💬</span> Chat
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-x-2 bottom-2 top-16 sm:static sm:inset-auto sm:w-96 sm:h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
          
          {/* Cabeçalho */}
          <div className="bg-[#0d59db] text-white p-3.5 flex items-center justify-between shadow-md shrink-0">
            {selectedContact ? (
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-xs hover:underline text-blue-200 cursor-pointer shrink-0 py-1 px-1"
                >
                  ← Voltar
                </button>
                <span className="font-bold text-sm truncate">{selectedContact.name}</span>
              </div>
            ) : (
              <span className="font-bold text-sm">Minhas Conversas</span>
            )}

            <button
              onClick={() => {
                setIsOpen(false);
                if (onClose) onClose();
              }}
              className="text-white hover:text-gray-200 font-bold px-3 py-1 rounded text-base cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Corpo do Widget */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50 flex flex-col">
            {!selectedContact ? (
              contacts.length === 0 ? (
                <div className="text-center text-gray-400 text-sm my-auto">
                  Nenhuma conversa iniciada.
                </div>
              ) : (
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className="p-3 bg-white hover:bg-blue-50 rounded-xl border border-gray-200 cursor-pointer transition-colors flex items-center gap-3 active:bg-blue-100"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-400 text-blue-600 font-bold flex items-center justify-center text-sm shrink-0">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-800 truncate">{contact.name}</span>
                    </div>
                  ))}
                </div>
              )
            ) : isSelfChat ? (
              <div className="text-center text-gray-600 text-xs my-auto p-4 bg-amber-50 border border-amber-200 rounded-xl">
                ⚠️ Você é o dono deste anúncio. Não é possível enviar mensagens para você mesmo.
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-2">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-xs my-auto">
                    Diga olá para iniciar a conversa!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? 'bg-blue-600 text-white self-end rounded-br-none'
                            : 'bg-gray-200 text-gray-800 self-start rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Rodapé de Envio */}
          {selectedContact && !isSelfChat && (
            <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-gray-200 flex gap-2 shrink-0">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-3 py-2 text-base sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-sm cursor-pointer transition-colors shrink-0"
              >
                Enviar
              </button>
            </form>
          )}

        </div>
      )}

    </div>
  );
}

export default ChatWidget;