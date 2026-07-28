import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Send, Search, ArrowLeft, Circle, CheckCheck,
  Radio, Sparkles, Phone, Video, MoreVertical, Smile, Gift,
} from 'lucide-react';
import { UserProfile, Creator, Conversation, DirectMessage } from '../types';
import {
  collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp,
  where, getDocs, doc, updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface MessagesScreenProps {
  currentUser: UserProfile | null;
  creators: Creator[];
}

// Seed conversations from known creators
function buildConversations(creators: Creator[]): Conversation[] {
  return creators.slice(0, 5).map((c, i) => ({
    id: `conv-${c.id}`,
    participantId: c.id,
    participantName: c.name,
    participantAvatar: c.avatar,
    participantVerified: c.verified,
    lastMessage: i === 0
      ? 'Thanks for watching the stream! 🔥'
      : i === 1
      ? 'Your clip went viral, congrats!'
      : i === 2
      ? 'Let\'s collab on a podcast episode!'
      : i === 3
      ? 'Check my new merch drop 👕'
      : 'South Africa vibes only 🇿🇦',
    lastMessageTime: ['2m ago', '15m ago', '1h ago', '3h ago', 'Yesterday'][i],
    unreadCount: [2, 1, 0, 0, 3][i],
    isOnline: [true, true, false, false, true][i],
  }));
}

const SEED_MESSAGES: Record<string, DirectMessage[]> = {};

export const MessagesScreen: React.FC<MessagesScreenProps> = ({
  currentUser,
  creators,
}) => {
  const [conversations] = useState<Conversation[]>(() => buildConversations(creators));
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to real messages in Firestore when a conversation is open
  useEffect(() => {
    if (!activeConv || !currentUser) return;

    const convId = [currentUser.id, activeConv.participantId].sort().join('_');
    const q = query(
      collection(db, 'directMessages', convId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100),
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs: DirectMessage[] = snap.docs.map((d) => ({
        id: d.id,
        senderId: d.data().senderId,
        senderName: d.data().senderName,
        senderAvatar: d.data().senderAvatar,
        text: d.data().text,
        timestamp: d.data().createdAt?.toDate
          ? new Date(d.data().createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'now',
        read: d.data().read ?? false,
      }));

      if (msgs.length === 0) {
        // Seed a starter message
        setMessages([{
          id: 'seed-1',
          senderId: activeConv.participantId,
          senderName: activeConv.participantName,
          senderAvatar: activeConv.participantAvatar,
          text: activeConv.lastMessage,
          timestamp: activeConv.lastMessageTime,
          read: true,
        }]);
      } else {
        setMessages(msgs);
      }
    }, (err) => {
      console.warn('Messages listener error:', err);
      setMessages([{
        id: 'seed-1',
        senderId: activeConv.participantId,
        senderName: activeConv.participantName,
        senderAvatar: activeConv.participantAvatar,
        text: activeConv.lastMessage,
        timestamp: activeConv.lastMessageTime,
        read: true,
      }]);
    });

    return () => unsub();
  }, [activeConv?.id, currentUser?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !activeConv || !currentUser) return;

    const text = inputText.trim();
    setInputText('');

    const convId = [currentUser.id, activeConv.participantId].sort().join('_');
    const newMsg: DirectMessage = {
      id: `local-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setMessages((prev) => [...prev, newMsg]);

    try {
      await addDoc(collection(db, 'directMessages', convId, 'messages'), {
        senderId: currentUser.id,
        senderName: currentUser.fullName,
        senderAvatar: currentUser.avatar,
        text,
        createdAt: serverTimestamp(),
        read: false,
      });
    } catch (err) {
      console.warn('Failed to send message to Firestore:', err);
    }
  };

  const filteredConvs = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- Conversation list ---
  if (!activeConv) {
    return (
      <div className="flex flex-col pb-20 min-h-screen bg-slate-950">
        {/* Header */}
        <div className="px-4 py-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-500" />
              Messages
            </h1>
            <button className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Online creators quick row */}
        <div className="px-4 py-3 border-b border-slate-800/50 overflow-x-auto">
          <div className="flex gap-3">
            {conversations.filter((c) => c.isOnline).map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveConv(c)}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <div className="relative">
                  <img
                    src={c.participantAvatar}
                    alt={c.participantName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500/60"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
                </div>
                <span className="text-[10px] text-slate-400 max-w-[48px] truncate">{c.participantName.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex flex-col divide-y divide-slate-800/60">
          {filteredConvs.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv)}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-900/60 text-left transition-colors"
            >
              <div className="relative shrink-0">
                <img
                  src={conv.participantAvatar}
                  alt={conv.participantName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conv.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white flex items-center gap-1">
                    {conv.participantName}
                    {conv.participantVerified && (
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center">
                        <CheckCheck className="w-2 h-2 text-white" />
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-500 shrink-0">{conv.lastMessageTime}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-slate-400 truncate max-w-[200px]">{conv.lastMessage}</p>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredConvs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
            <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Follow creators to start messaging</p>
          </div>
        )}

        {!currentUser && (
          <div className="mx-4 mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <p className="text-sm font-semibold text-white">Sign in to message creators</p>
            <p className="text-xs text-slate-400">Connect with your favorite streamers</p>
          </div>
        )}
      </div>
    );
  }

  // --- Active conversation / chat ---
  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-slate-950">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
        <button
          onClick={() => setActiveConv(null)}
          className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <img
          src={activeConv.participantAvatar}
          alt={activeConv.participantName}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-500/40"
        />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-white flex items-center gap-1">
            {activeConv.participantName}
            {activeConv.participantVerified && (
              <span className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center">
                <CheckCheck className="w-2 h-2 text-white" />
              </span>
            )}
          </div>
          <span className={`text-[10px] font-medium ${activeConv.isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
            {activeConv.isOnline ? '● Online' : 'Offline'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full bg-slate-800/60 text-slate-300 hover:text-white">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-slate-800/60 text-slate-300 hover:text-white">
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const isMe = currentUser ? msg.senderId === currentUser.id : false;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!isMe && (
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
              )}
              <div
                className={`max-w-[72%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? 'bg-gradient-to-br from-rose-600 to-red-600 text-white rounded-br-sm'
                    : 'bg-slate-800 text-white rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-600 shrink-0">{msg.timestamp}</span>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-950 pb-20">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <Smile className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors">
            <Gift className="w-4 h-4" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message..."
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
