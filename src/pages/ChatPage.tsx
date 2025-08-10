import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Send, User, Clock } from 'lucide-react';

interface Chat {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isPaid: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isPaid?: boolean;
}

const mockChats: Chat[] = [
  {
    id: '1',
    participant: {
      id: '2',
      name: 'Анна Петрова',
    },
    lastMessage: 'Спасибо за интерес к моей истории! Готова обсудить детали.',
    lastMessageTime: new Date('2024-01-15T14:30:00'),
    unreadCount: 2,
    isPaid: true,
  },
  {
    id: '2',
    participant: {
      id: '3',
      name: 'Михаил Иванов',
    },
    lastMessage: 'Да, это действительно большая проблема в нашей сфере.',
    lastMessageTime: new Date('2024-01-14T16:45:00'),
    unreadCount: 0,
    isPaid: true,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    content: 'Здравствуйте! Меня заинтересовала ваша история о доставке еды в офис. Я разрабатываю B2B сервис и хотел бы обсудить детали.',
    timestamp: new Date('2024-01-15T14:00:00'),
    isPaid: true,
  },
  {
    id: '2',
    senderId: '2',
    content: 'Спасибо за интерес к моей истории! Готова обсудить детали. Что именно вас интересует?',
    timestamp: new Date('2024-01-15T14:30:00'),
  },
  {
    id: '3',
    senderId: '1',
    content: 'Меня интересуют конкретные болевые точки в процессе заказа еды. Какие функции были бы наиболее важны в идеальном решении?',
    timestamp: new Date('2024-01-15T14:35:00'),
  },
];

export const ChatPage: React.FC = () => {
  const [chats] = useState<Chat[]>(mockChats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(chats[0]?.id || null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="story-card">
          <CardContent className="py-8 text-center">
            <p className="elegant-text">Войдите в аккаунт для доступа к чатам</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChatId) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="aristocratic-text text-4xl font-bold mb-4">
            Чаты
          </h1>
          <p className="elegant-text text-xl opacity-80">
            Общайтесь с авторами историй и потенциальными клиентами
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <Card className="story-card">
            <CardHeader>
              <CardTitle className="aristocratic-text flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Чаты
              </CardTitle>
              <CardDescription className="elegant-text">
                {chats.length} активных диалогов
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-amber-50 ${
                      selectedChatId === chat.id ? 'bg-amber-50 border-r-2 border-amber-400' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                          {chat.participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="elegant-text font-medium truncate">
                            {chat.participant.name}
                          </p>
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="elegant-text text-sm opacity-70 truncate">
                          {chat.lastMessage}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(chat.lastMessageTime)}</span>
                          </div>
                          {chat.isPaid && (
                            <Badge variant="outline" className="text-xs tag-chip">
                              Оплачен
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <div className="lg:col-span-2">
            {selectedChat ? (
              <Card className="story-card h-full flex flex-col">
                <CardHeader className="border-b border-amber-100">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                        {selectedChat.participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="aristocratic-text text-lg">
                        {selectedChat.participant.name}
                      </CardTitle>
                      <CardDescription className="elegant-text">
                        Онлайн
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === user.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user.id
                              ? 'chat-bubble sent'
                              : 'chat-bubble'
                          }`}
                        >
                          {message.isPaid && (
                            <Badge className="bg-green-100 text-green-800 text-xs mb-2">
                              Первое сообщение ($1.50)
                            </Badge>
                          )}
                          <p className="elegant-text text-sm">
                            {message.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-amber-100 p-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Напишите сообщение..."
                        className="impressionist-input"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="aristocratic-button"
                        disabled={!newMessage.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="story-card h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <p className="elegant-text text-lg">
                    Выберите чат для начала общения
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {chats.length === 0 && (
          <div className="text-center py-12">
            <Card className="story-card max-w-md mx-auto">
              <CardContent className="py-8">
                <MessageCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <p className="elegant-text text-lg mb-4">
                  У вас пока нет чатов
                </p>
                <p className="elegant-text opacity-60">
                  Начните общение, связавшись с авторами интересных историй
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};