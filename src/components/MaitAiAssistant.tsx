import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Maximize2, Minimize2, Send, Sparkles, Trash2, X } from 'lucide-react';

type AssistantSource = {
  id: string;
  title: string;
  category: string;
  sourceUrl: string;
  lastVerifiedDate: string;
};

type AssistantMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: AssistantSource[];
  isGrounded?: boolean;
};

const SUGGESTED_QUESTIONS = [
  'What does the GGSIPU attendance rule say?',
  'How is the institute affiliated and accredited?',
  'What official information is available about MAIT?',
];

const WELCOME_MESSAGE: AssistantMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Ask about verified MAIT information. I will cite the sources used and say when I cannot verify an answer.',
};

export const MaitAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (messageText: string) => {
    const message = messageText.trim();
    if (!message || isLoading) return;
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'user', content: message }]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'MAIT AI could not answer right now.');
      setMessages((current) => [...current, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources || [],
        isGrounded: data.isGrounded,
      }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'MAIT AI could not answer right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {isOpen && (
        <section
          aria-label="MAIT AI Assistant"
          className={`flex w-[min(100vw-2rem,420px)] flex-col overflow-hidden rounded-xl border border-[#203044]/15 bg-white shadow-2xl ${
            isExpanded
              ? 'fixed inset-3 h-[calc(100dvh-1.5rem)] w-auto sm:inset-6 sm:h-[calc(100dvh-3rem)]'
              : 'h-[min(70vh,620px)]'
          }`}
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-[#203044]/10 bg-[#F7F5EF] px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#16745B] text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-[#203044]">MAIT AI Assistant</h2>
              <p className="text-[10px] text-[#657080]">Answers grounded in approved sources</p>
            </div>
            <button type="button" onClick={clearConversation} aria-label="Clear conversation" title="Clear conversation" className="rounded-md p-2 text-[#657080] hover:bg-white hover:text-[#203044]">
              <Trash2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setIsExpanded((expanded) => !expanded)} aria-label={isExpanded ? 'Minimize assistant' : 'Expand assistant'} title={isExpanded ? 'Minimize' : 'Expand'} className="rounded-md p-2 text-[#657080] hover:bg-white hover:text-[#203044]">
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close assistant" className="rounded-md p-2 text-[#657080] hover:bg-white hover:text-[#203044]">
              <X className="h-4 w-4" />
            </button>
          </header>

          <div ref={historyRef} role="log" aria-live="polite" className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message) => (
              <article key={message.id} className={`max-w-[92%] rounded-lg px-3.5 py-3 text-sm leading-6 ${message.role === 'user' ? 'ml-auto bg-[#203044] text-white' : 'mr-auto border border-[#203044]/10 bg-white text-[#203044]'}`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                  <div className="mt-3 border-t border-[#203044]/10 pt-2">
                    <p className="mb-1.5 text-[10px] font-bold uppercase text-[#657080]">Sources</p>
                    <ul className="space-y-1.5">
                      {message.sources.map((source) => (
                        <li key={source.id}>
                          <a href={source.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1.5 text-xs font-medium text-[#16745B] underline decoration-[#16745B]/40 underline-offset-2 hover:text-[#125d49]">
                            <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
                            <span>{source.title} <span className="text-[#657080]">· verified {source.lastVerifiedDate}</span></span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {message.role === 'assistant' && message.isGrounded === false && (
                  <p className="mt-2 border-t border-[#203044]/10 pt-2 text-[10px] text-[#657080]">No matching verified source was found.</p>
                )}
              </article>
            ))}
            {isLoading && (
              <div role="status" className="mr-auto rounded-lg border border-[#203044]/10 bg-white px-3.5 py-3 text-xs text-[#657080]">
                Searching approved sources and preparing an answer...
              </div>
            )}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button key={question} type="button" onClick={() => sendMessage(question)} className="block w-full rounded-lg border border-[#203044]/10 px-3 py-2 text-left text-xs text-[#203044] hover:border-[#16745B]/40 hover:bg-emerald-50/50">
                    {question}
                  </button>
                ))}
              </div>
            )}
            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">{error}</p>}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(input);
            }}
            className="flex shrink-0 items-end gap-2 border-t border-[#203044]/10 bg-white p-3"
          >
            <label className="sr-only" htmlFor="mait-ai-message">Ask MAIT AI</label>
            <textarea
              id="mait-ai-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage(input);
                }
              }}
              maxLength={1200}
              rows={1}
              placeholder="Ask a question..."
              className="max-h-28 min-h-10 flex-1 resize-y rounded-lg border border-[#203044]/15 px-3 py-2.5 text-sm text-[#203044] outline-none focus:border-[#16745B]"
            />
            <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send question" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#16745B] text-white hover:bg-[#125d49] disabled:cursor-not-allowed disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close MAIT AI Assistant' : 'Open MAIT AI Assistant'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#16745B] text-white shadow-lg transition-colors hover:bg-[#125d49] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#203044]"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </button>
    </div>
  );
};