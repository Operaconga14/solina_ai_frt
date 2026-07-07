'use client';
import MarkdownRenderer from '@/app/components/MarkdownRenerer';
import { ChatSkeleton } from '@/app/components/SkeletonsLine';
import { ChatMessage } from '@/app/types/interfaces';
import { api, formatTime, starterPrompts } from '@/app/utils/helpers';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, MessageSquare, Send, Sparkles, Trash2, User } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function ChatPage() {
  // const { error, success } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get('/chat');
        console.log('Chat messages:', res.data.messages);
        setMessages(res.data.messages ?? []);
      } catch (err) {
        console.error('[Chat] Failed to fetch messages:', err);
        if (axios.isAxiosError(err)) {
          console.error('[Chat] Axios error details:', {
            message: err.message,
            code: err.code,
            response: err.response?.data,
            status: err.response?.status,
          });
        }
      } finally {
        setInitialLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: content.trim() });
      console.log('Chat response:', res.data.message);
      setMessages((prev) => [...prev, res.data.message]);
    } catch (err) {
      console.error('[Chat] Failed to send message:', err);
      if (axios.isAxiosError(err)) {
        console.error('[Chat] Send message error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
      // error(err instanceof Error ? err.message : 'Failed to send message');
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = async () => {
    setClearing(true);
    try {
      await api.delete('/chat');
      setMessages([]);
      console.log('Chat history cleared');
      // success('Chat history cleared');
    } catch (err) {
      console.error('[Chat] Failed to clear chat:', err);
      if (axios.isAxiosError(err)) {
        console.error('[Chat] Clear chat error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
      // error('Failed to clear chat');
    } finally {
      setClearing(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] glass flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">Solirna AI Chat</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-glow" />
              <span className="text-xs text-white/40">AI Co-Founder · Online</span>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            disabled={clearing}
            className="flex items-center gap-2 text-xs text-white/30 hover:text-red-400 transition-colors px-3 py-1.5 glass rounded-lg hover:border-red-500/20 hover:bg-red-500/5"
          >
            {clearing ? (
              <Loader2 className="w-3.5 h-3.5 spinner" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            Clear history
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          {initialLoading ? (
            <div className="space-y-4">
              <ChatSkeleton />
              <ChatSkeleton />
            </div>
          ) : messages.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8 text-violet-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Start a conversation</h2>
              <p className="text-white/40 text-sm max-w-sm mb-8">
                Ask Solirna anything about your startup — market research, validation, strategy, or
                document generation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="glass glass-hover rounded-xl p-3 text-left text-sm text-white/50 hover:text-white/80 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`fade-in flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'assistant'
                        ? 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-900/40'
                        : 'bg-white/10'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-white/70" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`flex flex-col gap-1 max-w-[78%] ${msg.role === 'user' ? 'items-end' : ''}`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm'
                          : 'glass rounded-tl-sm'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <MarkdownRenderer content={msg.content} className="text-sm" />
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-white/20 px-1">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="fade-in flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-violet-400"
                          style={{ animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 lg:px-8 py-4 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Solirna anything... (Enter to send, Shift+Enter for new line)"
              className="input-field resize-none py-3.5 pr-14 min-h-[52px] max-h-32 leading-relaxed"
              rows={1}
              disabled={loading}
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 bottom-2 w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:from-violet-500 hover:to-indigo-500 shadow-lg"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 text-white spinner" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </form>
          <p className="text-[11px] text-white/20 text-center mt-2">
            Solirna AI can make mistakes. Verify important information independently.
          </p>
        </div>
      </div>
    </div>
  );
}
