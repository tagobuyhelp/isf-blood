'use client';

import { useState } from 'react';
import { Send, Phone, Video, MoreVertical, Mic, Paperclip, Smile } from 'lucide-react';

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const conversations = [
    {
      id: 1,
      name: 'Mr. Jukarbark',
      status: 'Online',
      lastMessage: 'Thank you, Sara. Please visit our Blood Bank at City Hospital Main Building 2nd Floor. Can you come today?',
      time: '10:25 am',
      unread: 0,
      avatar: '/avatar-1.jpg',
      isOnline: true,
      messages: [
        {
          id: 1,
          sender: 'other',
          message: 'Hello! Thank you for registering as a blood donor. We currently need A- blood urgently. Are you available now?',
          time: '10:25 am',
          type: 'text'
        },
        {
          id: 2,
          sender: 'me',
          message: 'Hi! Yes, I\'m A- and available right now. What should I come for the blood donation? Where should I go?',
          time: '10:30 am',
          type: 'text'
        },
        {
          id: 3,
          sender: 'other',
          message: 'Thank you, Sara. Please visit our Blood Bank at City Hospital Main Building 2nd Floor. Can you come today?',
          time: '10:25 am',
          type: 'text'
        },
        {
          id: 4,
          sender: 'me',
          message: '',
          time: '0:40',
          type: 'voice'
        }
      ]
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      status: 'Last seen 2 hours ago',
      lastMessage: 'The patient is stable now. Thank you for your quick response.',
      time: '8:15 am',
      unread: 2,
      avatar: '/avatar-2.jpg',
      isOnline: false,
      messages: [
        {
          id: 1,
          sender: 'other',
          message: 'Emergency! We need O- blood immediately for a critical patient.',
          time: '7:45 am',
          type: 'text'
        },
        {
          id: 2,
          sender: 'me',
          message: 'On my way! Will be there in 15 minutes.',
          time: '7:47 am',
          type: 'text'
        },
        {
          id: 3,
          sender: 'other',
          message: 'The patient is stable now. Thank you for your quick response.',
          time: '8:15 am',
          type: 'text'
        }
      ]
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      // Add message logic here
      setNewMessage('');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
          {/* Chat List - Mobile: Full screen, Desktop: 1/3 */}
          <div className={`bg-white border-r border-gray-200 ${selectedChat ? 'hidden lg:block' : 'block'}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            </div>

            {/* Conversations List */}
            <div className="overflow-y-auto h-full">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                    selectedChat?.id === conversation.id ? 'bg-red-50 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold">
                        {conversation.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{conversation.unread}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{conversation.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window - Mobile: Full screen when selected, Desktop: 2/3 */}
          <div className={`lg:col-span-2 flex flex-col ${selectedChat ? 'block' : 'hidden lg:flex'}`}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                      >
                        ←
                      </button>
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold">
                          {selectedChat.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {selectedChat.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
                        <p className="text-sm text-gray-500">{selectedChat.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-primary transition-colors duration-200">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-primary transition-colors duration-200">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-primary transition-colors duration-200">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {selectedChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${
                        message.sender === 'me' 
                          ? 'bg-primary text-white' 
                          : 'bg-white text-gray-900'
                      } rounded-isf-lg p-3 shadow-sm`}>
                        {message.type === 'text' ? (
                          <p className="text-sm">{message.message}</p>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                            </div>
                            <span className="text-sm">{message.time}</span>
                          </div>
                        )}
                        <p className={`text-xs mt-1 ${
                          message.sender === 'me' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-primary transition-colors duration-200">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type Here..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-primary transition-colors duration-200">
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={toggleRecording}
                      className={`p-2 transition-colors duration-200 ${
                        isRecording ? 'text-red-500' : 'text-gray-500 hover:text-primary'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors duration-200"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}