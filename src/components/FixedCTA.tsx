import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FixedCTA.css';
import { getPage, getSettings } from '../controllers/apiController';
import { AGENCY_DATA, CHAT_SUGGESTIONS, OPENING_MESSAGE } from './agencyData';
import { buildSystemPrompt } from './agentPrompt';

type Tab = 'chat' | 'contact';

interface ChatMessage {
  id: string;
  role: 'agent' | 'user';
  text: string;
}

interface FixedCTAProps {
  contactEmail?: string;
  isOpenExternal?: boolean;
  externalTab?: Tab;
  onClose?: () => void;
}

async function askAI(
  history: { role: 'user' | 'assistant'; content: string }[],
  context: { contactEmail: string },
): Promise<string> {
  const API_BASE = import.meta.env.VITE_API_URL || '/api';
  const systemMsg = { role: 'system', content: buildSystemPrompt({ contactEmail: context.contactEmail }) };
  const allMessages = [systemMsg, ...history];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: allMessages }),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error('Could not reach the server. Please try again.');
  }
  clearTimeout(timeout);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || errorData.error || `Server error ${res.status}`);
  }

  const data = await res.json().catch(() => null);
  if (!data) throw new Error('Invalid response from server.');

  const text =
    data.content?.[0]?.text ||
    data.choices?.[0]?.message?.content ||
    null;

  if (!text) throw new Error('Empty response from server.');
  return text;
}

const INIT_MESSAGE: ChatMessage = { id: 'init', role: 'agent', text: OPENING_MESSAGE };

const FixedCTA: React.FC<FixedCTAProps> = ({
  contactEmail = AGENCY_DATA.contact.email,
  isOpenExternal = false,
  externalTab,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [pillText, setPillText] = useState("Let's work together");
  const [ctaButtonText, setCtaButtonText] = useState('Get in touch');
  const [resolvedEmail, setResolvedEmail] = useState(contactEmail);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INIT_MESSAGE]);
  const [suggestions, setSuggestions] = useState<string[]>(CHAT_SUGGESTIONS.initial);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSettings().then((settings) => {
      if (settings?.contact_email) setResolvedEmail(settings.contact_email);
      if (settings?.cta_button_text) setCtaButtonText(settings.cta_button_text);
    }).catch(() => { });
  }, []);

  useEffect(() => {
    getPage('site-ui').then((page) => {
      if (page?.content?.lets_work_together_text) {
        setPillText(page.content.lets_work_together_text);
      }
    }).catch(() => { });
  }, []);

  useEffect(() => {
    if (isOpenExternal) {
      setIsOpen(true);
      if (externalTab) {
        setActiveTab(externalTab);
      }
    }
  }, [isOpenExternal, externalTab]);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  const handleToggle = () => {
    setIsOpen((prev) => {
      if (prev) onClose?.();
      return !prev;
    });

    if (submitted) setSubmitted(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const sendChatMessage = useCallback(async (text: string) => {
    if (!text.trim() || chatLoading) return;

    setShowSuggestions(false);
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const history = [...messages, userMsg]
        .filter((m) => m.id !== 'init')
        .map((m) => ({
          role: (m.role === 'agent' ? 'assistant' : 'user') as 'user' | 'assistant',
          content: m.text,
        }));

      const reply = await askAI(history, { contactEmail: resolvedEmail });

      setMessages((prev) => [...prev, { id: `${Date.now()}-a`, role: 'agent', text: reply }]);
      setSuggestions(CHAT_SUGGESTIONS.followUp.sort(() => 0.5 - Math.random()).slice(0, 3));
      setShowSuggestions(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setMessages((prev) => [...prev, {
        id: `${Date.now()}-err`,
        role: 'agent',
        text: `Sorry, I'm having trouble: ${errorMessage}. Please contact us at ${resolvedEmail}.`,
      }]);
    } finally {
      setChatLoading(false);
    }
  }, [chatLoading, messages, resolvedEmail]);

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage(chatInput);
    }
  };

  return (
    <div ref={containerRef} className={`fcta-root ${isOpen ? 'fcta-open' : ''}`}>
      <div className="fcta-panel">
        <div className="fcta-tabs">
          <div className="fcta-tab-group">
            <button className={`fcta-tab ${activeTab === 'chat' ? 'fcta-tab-active' : ''}`} onClick={() => setActiveTab('chat')}>Ask AI</button>
            <button className={`fcta-tab ${activeTab === 'contact' ? 'fcta-tab-active' : ''}`} onClick={() => setActiveTab('contact')}>Contact</button>
          </div>
          <button className="fcta-close" onClick={handleToggle} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="15" y1="3" x2="3" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="fcta-panel-body-shell">
          <div className="fcta-panel-body-content">
            {activeTab === 'chat' && (
              <div className="fcta-panel-body fcta-panel-body-active">
                <div className="fcta-chat-wrap">
                  <div className="fcta-chat-messages">
                    {messages.map((msg) => msg.role === 'agent' ? (
                      <div key={msg.id} className="fcta-msg-agent">
                        <span className="fcta-msg-agent-name">{AGENCY_DATA.name}</span>
                        <span className="fcta-msg-agent-text">{msg.text}</span>
                      </div>
                    ) : (
                      <div key={msg.id} className="fcta-msg-user">
                        <span className="fcta-msg-user-text">{msg.text}</span>
                      </div>
                    ))}

                    {chatLoading && <div className="fcta-typing"><span /><span /><span /></div>}

                    {showSuggestions && !chatLoading && (
                      <div className="fcta-suggestions-shell">
                        <span className="fcta-suggestions-title">Suggested questions</span>
                        <div className="fcta-suggestions">
                          {suggestions.map((suggestion) => (
                            <button key={suggestion} className="fcta-suggestion-chip" onClick={() => sendChatMessage(suggestion)}>
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  <div className="fcta-chat-input-row">
                    <textarea
                      className="fcta-chat-input"
                      placeholder="Ask something..."
                      rows={1}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleChatKeyDown}
                      disabled={chatLoading}
                    />
                    <button className="fcta-chat-send" onClick={() => sendChatMessage(chatInput)} disabled={!chatInput.trim() || chatLoading} aria-label="Send">
                      {chatLoading ? <span className="fcta-spinner-chat" /> : (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="fcta-panel-body fcta-panel-body-active">
                <div className="fcta-contact-row">
                  <span className="fcta-muted-label">Email</span>
                  <a href={`mailto:${resolvedEmail}`} className="fcta-email-link">{resolvedEmail}</a>
                </div>
                <div className="fcta-divider" />

                {submitted ? (
                  <div className="fcta-success">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
                      <path d="M7.5 12.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Message sent. We&apos;ll be in touch.</span>
                  </div>
                ) : (
                  <form className="fcta-form" onSubmit={handleContactSubmit}>
                    <div className="fcta-field">
                      <label className="fcta-muted-label" htmlFor="fcta-name">Name</label>
                      <input
                        id="fcta-name"
                        type="text"
                        className="fcta-input"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        required
                        autoComplete="name"
                      />
                    </div>
                    <div className="fcta-field">
                      <label className="fcta-muted-label" htmlFor="fcta-email">Email</label>
                      <input
                        id="fcta-email"
                        type="email"
                        className="fcta-input"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="fcta-field">
                      <label className="fcta-muted-label" htmlFor="fcta-message">Message</label>
                      <textarea
                        id="fcta-message"
                        className="fcta-input fcta-textarea"
                        placeholder="Tell us about your project..."
                        value={formData.message}
                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                        required
                        rows={3}
                      />
                    </div>
                    <button type="submit" className="fcta-submit" disabled={sending}>
                      {sending ? <span className="fcta-spinner" /> : (
                        <>
                          <span>Send message</span>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <button className="fcta-pill" onClick={handleToggle} aria-label={ctaButtonText} aria-expanded={isOpen}>
        <span className="fcta-pill-icon" aria-hidden="true">
          <span className="fcta-icon-core-center" />
          <span className="fcta-icon-core-orbit">
            <span className="fcta-icon-core-dot fcta-icon-core-dot-1" />
            <span className="fcta-icon-core-dot fcta-icon-core-dot-2" />
            <span className="fcta-icon-core-dot fcta-icon-core-dot-3" />
            <span className="fcta-icon-core-dot fcta-icon-core-dot-4" />
          </span>
          <span className="fcta-icon-orbit">
            <span className="fcta-icon-orbit-dot fcta-icon-orbit-dot-1" />
            <span className="fcta-icon-orbit-dot fcta-icon-orbit-dot-2" />
            <span className="fcta-icon-orbit-dot fcta-icon-orbit-dot-3" />
            <span className="fcta-icon-orbit-dot fcta-icon-orbit-dot-4" />
            <span className="fcta-icon-orbit-dot fcta-icon-orbit-dot-5" />
            <span className="fcta-icon-orbit-dot fcta-icon-orbit-dot-6" />
          </span>
        </span>
        <span className="fcta-pill-text">{pillText}</span>
      </button>
    </div>
  );
};

export default FixedCTA;
