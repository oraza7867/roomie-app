"use client";

import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Connection {
  id: string;
  name: string;
  college?: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    if (selectedPartner) {
      fetchMessages(selectedPartner.id);
      const interval = setInterval(() => {
        fetchMessages(selectedPartner.id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedPartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConnections = async () => {
    try {
      const data = await apiFetch('/messages/conversations');
      setConnections(data.connections || []);
      if (data.connections && data.connections.length > 0) {
        setSelectedPartner(data.connections[0]);
      }
    } catch (err) {
      console.error('Failed to load connections', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    try {
      const data = await apiFetch(`/messages/${partnerId}`);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedPartner) return;

    const contentToSend = inputMessage;
    setInputMessage('');

    try {
      const data = await apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify({
          receiverId: selectedPartner.id,
          content: contentToSend
        })
      });
      setMessages((prev) => [...prev, data.message]);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-orange-50 border border-orange-100 rounded-3xl p-10 shadow-sm">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            💬
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Roomie Chats Yet</h2>
          <p className="text-gray-600 mb-6 text-sm max-w-md mx-auto">
            Direct chat unlocks when you send or accept a Roomie request on the Discovery page!
          </p>
          <Link
            href="/discover"
            className="inline-flex bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            Find Roomies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Roomie Messages</h1>
        <p className="text-sm text-gray-500 mt-1">Direct chat with your accepted roomie matches.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex h-[650px]">
        {/* Left Sidebar - Connections list */}
        <div className="w-1/3 border-r border-gray-100 bg-gray-50/50 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Accepted Roomies</h2>
          </div>
          <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
            {connections.map((partner) => (
              <button
                key={partner.id}
                onClick={() => setSelectedPartner(partner)}
                className={`w-full p-4 text-left flex items-center gap-3 transition-colors ${
                  selectedPartner?.id === partner.id
                    ? 'bg-orange-50/80 border-l-4 border-orange-600'
                    : 'hover:bg-gray-100/60'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-sm">
                  {partner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{partner.name}</h3>
                  {partner.college && (
                    <p className="text-xs text-gray-500 truncate">{partner.college}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Chat Area */}
        {selectedPartner ? (
          <div className="w-2/3 flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-sm">
                  {selectedPartner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{selectedPartner.name}</h3>
                  <span className="inline-flex items-center text-[10px] text-green-600 font-semibold">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span> Active Connection
                  </span>
                </div>
              </div>
              <Link
                href={`/users/${selectedPartner.id}`}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200"
              >
                View Profile
              </Link>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-gray-50/20">
              {messages.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-sm text-gray-400">No messages yet. Say hi to {selectedPartner.name}! 👋</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.senderId === user?.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                          isMe
                            ? 'bg-orange-600 text-white rounded-br-none shadow-sm'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="leading-relaxed">{m.content}</p>
                        <span
                          className={`block text-[10px] mt-1 ${
                            isMe ? 'text-orange-200 text-right' : 'text-gray-400 text-left'
                          }`}
                        >
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message ${selectedPartner.name}...`}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
              >
                Send
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
