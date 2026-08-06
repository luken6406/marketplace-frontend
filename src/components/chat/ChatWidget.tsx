import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext';

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

  // Define contato ativo vindo por props (ex: quando clica em "Mensagem" na ListingPage)
  useEffect(() => {
    if (activeContactId && activeContactName) {
      setSelectedContact({ id: activeContactId, name: activeContactName, email: '' });
      setIsOpen(true);
    }
  }, [activeContactId, activeContactName]);

  // Carrega lista de contatos recentes
  useEffect(() => {
    if (!user?.id || !isOpen) return;

    async function fetchContacts() {
      try {
        const res = await fetch(`http://localhost:3001/api/conversations?userId=${user.id}`);
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

  // Polling para atualizar mensagens da conversa ativa a cada 3 segundos
  useEffect(() => {
    if (!user?.id || !selectedContact?.id || !isOpen) return;

    async function fetchMessages() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/messages?userId=${user?.id}&contactId=${selectedContact?.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error('Erro ao buscar mensagens:', err);
      }
    }

    fetchMessages(); // Busca imediata ao selecionar contato

    const timer = setInterval(fetchMessages, 3000); // Polling a cada 3s

    return () => clearInterval(timer);
  }, [user?.id, selectedContact?.id, isOpen]);

  // Rola para o final da conversa quando chega mensagem nova
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // BLOQUEIO: Evita envio se for para si mesmo
    if (!newMessage.trim() || !user?.id || !selectedContact?.id || isSelfChat) return;

    const messageText = newMessage;
    setNewMessage('');

    try {
      const res = await fetch('http://localhost:3001/api/messages', {
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-full shadow-2xl transition-all cursor-pointer flex items-center justify-center"
        >
          💬 Chat
        </button>
      )}

      {isOpen && (
        <div className="w-80 md:w-96 h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          
          {/* Cabeçalho */}
          <div className="bg-[#0d59db] text-white p-3 flex items-center justify-between shadow-md">
            {selectedContact ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-xs hover:underline text-blue-200 cursor-pointer"
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
              className="text-white hover:text-gray-200 font-bold px-2 py-0.5 rounded text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Corpo do Widget */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50 flex flex-col">
            {!selectedContact ? (
              contacts.length === 0 ? (
                <div className="text-center text-gray-400 text-xs my-auto">
                  Nenhuma conversa iniciada.
                </div>
              ) : (
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className="p-3 bg-white hover:bg-blue-50 rounded-xl border border-gray-200 cursor-pointer transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-400 text-blue-600 font-bold flex items-center justify-center text-xs">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{contact.name}</span>
                    </div>
                  ))}
                </div>
              )
            ) : isSelfChat ? (
              /* AVISO: Quando o usuário tenta abrir chat consigo mesmo */
              <div className="text-center text-gray-500 text-xs my-auto p-4 bg-amber-50 border border-amber-200 rounded-xl">
                ⚠️ Você é o dono deste anúncio. Não é possível enviar mensagens para você mesmo.
              </div>
            ) : (
              /* Mensagens Normais */
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
                        className={`max-w-[75%] p-2.5 rounded-2xl text-xs ${
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

          {/* Rodapé: Escondido se for conversa própria */}
          {selectedContact && !isSelfChat && (
            <form onSubmit={handleSendMessage} className="p-2 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer transition-colors"
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