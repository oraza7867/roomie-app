"use client";

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

export default function RequestsPage() {
  const [received, setReceived] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Chat Modal State
  const [activeChatUser, setActiveChatUser] = useState<{ id: string; name: string } | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      const [receivedData, sentData] = await Promise.all([
        apiFetch('/requests/received'),
        apiFetch('/requests/sent')
      ]);
      setReceived(receivedData.requests || []);
      setSent(sentData.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: 'ACCEPTED' | 'REJECTED' | 'CANCEL') => {
    try {
      if (action === 'CANCEL') {
        await apiFetch(`/requests/${id}`, { method: 'DELETE' });
      } else {
        await apiFetch(`/requests/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: action }),
        });
      }
      fetchRequests();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openChat = async (user: { id: string; name: string }) => {
    setActiveChatUser(user);
    setChatLoading(true);
    try {
      const data = await apiFetch(`/chat/${user.id}`);
      setMessages(data.messages || []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatUser || !inputText.trim()) return;

    try {
      const data = await apiFetch('/chat', {
        method: 'POST',
        body: JSON.stringify({
          receiverId: activeChatUser.id,
          text: inputText.trim()
        })
      });
      setMessages([...messages, data.message]);
      setInputText('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">Loading requests...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Roomie Requests</h1>

      <div className="space-y-12">
        {/* Received */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6 flex items-center gap-2">
            <span>📥 Received Requests</span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-semibold">{received.length}</span>
          </h2>
          {received.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
              <p className="text-gray-500 text-sm">No incoming roomie requests right now.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1">
              {received.map(req => {
                const u = req.sender;
                const pref = u.lifestylePreference;
                return (
                  <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-3">
                          <Link href={`/users/${u.id}`} className="font-bold text-xl text-gray-900 hover:text-orange-600 transition-colors">
                            {u.name}
                          </Link>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${req.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : req.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-800'}`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {[u.course, u.year, u.college, u.city].filter(Boolean).join(' • ')}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(req.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {req.message && (
                      <div className="bg-orange-50/60 p-3.5 rounded-xl border border-orange-100 text-sm text-gray-800 italic">
                        "{req.message}"
                      </div>
                    )}

                    {/* Specialized Lifestyle Badges */}
                    {pref && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded font-medium">
                          {pref.sleepSchedule?.replace('_', ' ')}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded font-medium">
                          Cleanliness: {pref.cleanliness}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded font-medium">
                          Noise: {pref.noiseTolerance}
                        </span>
                      </div>
                    )}

                    {req.status === 'PENDING' ? (
                      <div className="flex gap-3 pt-3 border-t border-gray-100">
                        <button onClick={() => handleAction(req.id, 'ACCEPTED')} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm">
                          Accept Connection
                        </button>
                        <button onClick={() => handleAction(req.id, 'REJECTED')} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                          Decline
                        </button>
                      </div>
                    ) : req.status === 'ACCEPTED' ? (
                      <div className="pt-3 border-t border-gray-100 flex gap-3">
                        <button onClick={() => openChat(u)} className="flex-1 bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-500 transition-colors flex items-center justify-center gap-2 shadow-sm">
                          💬 Open Private Chat
                        </button>
                        <Link href={`/users/${u.id}`} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                          View Profile
                        </Link>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Sent */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6 flex items-center gap-2">
            <span>📤 Sent Requests</span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-semibold">{sent.length}</span>
          </h2>
          {sent.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
              <p className="text-gray-500 text-sm">You haven't sent any requests yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1">
              {sent.map(req => {
                const u = req.receiver;
                const pref = u.lifestylePreference;
                return (
                  <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-3">
                          <Link href={`/users/${u.id}`} className="font-bold text-xl text-gray-900 hover:text-orange-600 transition-colors">
                            {u.name}
                          </Link>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${req.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {[u.course, u.year, u.college, u.city].filter(Boolean).join(' • ')}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(req.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {pref && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded font-medium">
                          {pref.sleepSchedule?.replace('_', ' ')}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded font-medium">
                          Cleanliness: {pref.cleanliness}
                        </span>
                      </div>
                    )}

                    {req.status === 'PENDING' ? (
                      <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs text-gray-500 italic">Waiting for response...</span>
                        <button onClick={() => handleAction(req.id, 'CANCEL')} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
                          Cancel Request
                        </button>
                      </div>
                    ) : req.status === 'ACCEPTED' ? (
                      <div className="pt-3 border-t border-gray-100 flex gap-3">
                        <button onClick={() => openChat(u)} className="flex-1 bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-500 transition-colors flex items-center justify-center gap-2 shadow-sm">
                          💬 Open Private Chat
                        </button>
                        <Link href={`/users/${u.id}`} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                          View Profile
                        </Link>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Chat Drawer / Modal */}
      {activeChatUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full h-[500px] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{activeChatUser.name}</h3>
                <p className="text-xs text-green-400">● Connected Roomie</p>
              </div>
              <button onClick={() => setActiveChatUser(null)} className="text-gray-400 hover:text-white font-bold text-xl">
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {chatLoading ? (
                <p className="text-center text-gray-400 text-sm py-10">Loading conversation...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-10">Say hi to your new roomie!</p>
              ) : (
                messages.map((m: any) => {
                  const isMe = m.senderId !== activeChatUser.id;
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-orange-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm'}`}>
                        {m.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
