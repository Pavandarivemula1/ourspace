'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  MessageSquare,
  Send,
  User,
  ShieldCheck,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/conversations');
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        if (data.conversations.length > 0 && !activeConvoId) {
          setActiveConvoId(data.conversations[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convoId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convoId}/messages`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (activeConvoId) {
      fetchMessages(activeConvoId);
      const interval = setInterval(() => fetchMessages(activeConvoId), 5000);
      return () => clearInterval(interval);
    }
  }, [activeConvoId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvoId || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${activeConvoId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages(activeConvoId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const activeConvo = conversations.find((c) => c.id === activeConvoId);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-4rem)]">
          {/* Top Pill Header (Matching /venues aesthetic) */}
          <div className="p-4 rounded-3xl border border-slate-200 flex items-center justify-between gap-4 bg-white shadow-sm mb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-900">Direct Messages</div>
                <div className="text-xs text-slate-500">
                  Authorized direct communication with accepted introductions and event collaborators.
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-3xl border border-slate-200 flex overflow-hidden bg-white shadow-sm">
            {/* Left Pane: Conversations List */}
            <div className="w-72 sm:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
              <div className="p-4 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                Active Chats ({conversations.length})
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active conversations. Accept an introduction to unlock messaging.
                  </div>
                ) : (
                  conversations.map((c) => {
                    const isActive = c.id === activeConvoId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveConvoId(c.id)}
                        className={`w-full text-left p-4 flex items-start gap-3 transition ${
                          isActive ? 'bg-purple-50/80 border-l-4 border-purple-600 font-medium' : 'hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shrink-0 shadow-2xs">
                          {c.partner?.avatarUrl ? (
                            <img src={c.partner.avatarUrl} alt={c.partner.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                              {c.partner?.name?.[0] || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 truncate">{c.partner?.name || c.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{formatDateTime(c.lastMessageAt)}</span>
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {c.lastMessage?.content || 'Started conversation'}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Pane: Chat Window */}
            <div className="flex-1 flex flex-col bg-white">
              {activeConvo ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shadow-2xs">
                        {activeConvo.partner?.avatarUrl ? (
                          <img src={activeConvo.partner.avatarUrl} alt={activeConvo.partner.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                            {activeConvo.partner?.name?.[0] || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          {activeConvo.partner?.name}
                          <span className="text-[10px] font-semibold text-slate-500">({activeConvo.partner?.role})</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-sm">
                          {activeConvo.partner?.profile?.headline}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/30">
                    {messages.map((m) => {
                      const isMe = m.senderId === user?.id;
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-purple-600 text-white rounded-br-none shadow-sm'
                                : 'bg-white text-slate-900 rounded-bl-none border border-slate-200 shadow-2xs'
                            }`}
                          >
                            {m.content}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                            {formatDateTime(m.createdAt)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Composer */}
                  <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-slate-100 border border-slate-200 text-xs text-slate-900 px-4 py-2.5 rounded-full focus:outline-none focus:border-purple-500 focus:bg-white transition"
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition disabled:opacity-50 shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium">
                  Select a conversation to begin messaging
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
