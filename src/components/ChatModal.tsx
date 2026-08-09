import React, { useState, useEffect } from 'react';
import { Order, ChatMessage } from '../types';
import {
  MessageSquare,
  Send,
  Phone,
  CheckCheck
} from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  currentUserId: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, order, currentUserId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (order) {
      fetch("/api/messages")
        .then((res) => res.json())
        .then((data: ChatMessage[]) => {
          const orderMsgs = data.filter((m) => m.orderId === order.id || m.recipientId === order.farmerId || m.senderId === order.farmerId);
          if (orderMsgs.length === 0) {
            setMessages([
              {
                id: "initial-1",
                orderId: order.id,
                senderId: order.farmerId,
                senderName: order.farmerName,
                recipientId: order.sellerId,
                text: `Namaste! Regarding your order of ${order.quantityKg} kg ${order.cropName}, harvest is ready and packed in clean wooden crates.`,
                timestamp: new Date().toISOString()
              }
            ]);
          } else {
            setMessages(orderMsgs);
          }
        })
        .catch((err) => console.error("Chat load error:", err));
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      orderId: order.id,
      senderId: currentUserId,
      senderName: currentUserId === order.farmerId ? order.farmerName : order.sellerName,
      recipientId: currentUserId === order.farmerId ? order.sellerId : order.farmerId,
      text: inputText,
      timestamp: new Date().toISOString()
    };

    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMsg)
    }).catch(err => console.error("Send msg error:", err));

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const presetQuickTexts = [
    "Is transport rickshaw ready for dispatch?",
    "Please send 100% fresh Grade A produce.",
    "Order accepted! Loading vehicle now."
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#1A2E1A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-[#E0E7DE] overflow-hidden my-6 flex flex-col h-[550px]">
        {/* Header */}
        <div className="bg-[#2D6A4F] text-white p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#D8F3DC]">{order.cropName} (Order #{order.id})</h3>
              <p className="text-[11px] text-[#D8F3DC]/80">
                Direct Chat: {currentUserId === order.farmerId ? order.sellerName : order.farmerName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${currentUserId === order.farmerId ? order.sellerPhone : order.farmerPhone}`}
              className="bg-[#1B4332] text-[#D8F3DC] hover:bg-[#112D23] p-1.5 rounded-xl text-xs font-bold border border-[#2D6A4F]"
              title="Call Directly"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="text-[#D8F3DC] hover:text-white text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Message area */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#F4F7F2]/50">
          {messages.map((m) => {
            const isMe = m.senderId === currentUserId;
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${
                    isMe
                      ? 'bg-[#2D6A4F] text-white rounded-tr-none shadow-xs'
                      : 'bg-white text-[#1A2E1A] border border-[#E0E7DE] rounded-tl-none shadow-xs'
                  }`}
                >
                  <span className={`text-[10px] font-bold block ${isMe ? 'text-[#D8F3DC]' : 'text-[#2D6A4F]'}`}>{m.senderName}</span>
                  <p className="font-medium text-xs">{m.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Preset chips */}
        <div className="p-2 bg-[#F4F7F2] border-t border-[#E0E7DE] flex gap-1.5 overflow-x-auto flex-shrink-0">
          {presetQuickTexts.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(preset)}
              className="bg-white hover:bg-[#D8F3DC] text-[#1A2E1A] border border-[#E0E7DE] text-[10px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#E0E7DE] flex gap-2 flex-shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message..."
            className="flex-1 px-3.5 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
          />
          <button
            type="submit"
            className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold p-2.5 rounded-xl cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
