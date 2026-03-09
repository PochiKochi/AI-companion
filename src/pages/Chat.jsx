import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, MoreVertical, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ChatBubble from '../components/chat/ChatBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import ChatInput from '../components/chat/ChatInput';
import ModeSelector from '../components/chat/ModeSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const modeSystemPrompts = {
  normal: '',
  reflection: '\n\nThe user has activated Reflection Mode. Guide them through these steps one at a time: 1) What happened? 2) What did you feel? 3) Why might it have happened? 4) Are there other ways to see this? 5) What do you want to do next? Take it slowly, one step per response.',
  silent: '\n\nThe user has activated Silent Mode. They want space to think. Only respond occasionally with very short reflective prompts. Keep responses to 1 sentence max. Examples: "Do you want to explore that thought more?" or "What comes up when you sit with that feeling?" Do not give advice or long responses.',
  perspective: '\n\nThe user has activated Perspective Switch mode. Help them see their situation from different angles. Ask them to imagine advising a friend in the same situation, or consider how they might view this in 5 years, or what someone they admire might say. Be creative with perspectives.',
};

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState('normal');
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const { data: prefs } = useQuery({
    queryKey: ['userPrefs'],
    queryFn: async () => {
      const list = await apiClient.entities.UserPreferences.list();
      return list[0] || {};
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Create conversation on first message
  const ensureConversation = async () => {
    if (conversationId) return conversationId;
    const conv = await apiClient.entities.Conversation.create({
      title: 'New conversation',
      mode,
      themes: [],
    });
    setConversationId(conv.id);
    return conv.id;
  };

  const buildSystemPrompt = () => {
    let prompt = `You are InnerSpace, a calm and thoughtful AI companion for honest conversations. Your personality: calm, emotionally intelligent, reflective. Never preachy, never dismissive, never overly cheerful. You are NOT a therapist and never claim to be one.

Techniques you use: Ask thoughtful follow-up questions, help users label emotions precisely, encourage self-awareness, gently challenge negative thinking patterns.

Instead of "Everything will be okay" say "That sounds frustrating. What part of the situation bothers you the most?"
Instead of "Don't worry" say "Do you think this feeling comes more from pressure or from uncertainty?"

Keep responses concise but meaningful. Use warm, natural language.`;

    if (prefs?.preference === 'listening') {
      prompt += '\n\nThe user prefers a listening style. Be more minimal in responses. Give them space.';
    } else if (prefs?.preference === 'reflection') {
      prompt += '\n\nThe user prefers reflective conversations. Ask thoughtful questions to help them explore.';
    } else if (prefs?.preference === 'problem-solving') {
      prompt += '\n\nThe user prefers problem-solving support. Help them think through solutions while staying emotionally attuned.';
    }

    prompt += modeSystemPrompts[mode];

    if (prefs?.display_name) {
      prompt += `\n\nThe user's name is ${prefs.display_name}.`;
    }

    if (messages.length === 0) {
      prompt += '\n\nThis is the start of a new conversation. Begin with a warm, brief greeting and an open-ended question. Do NOT be generic — be genuine and curious.';
    }

    return prompt;
  };

  const sendMessage = async (text) => {
    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    await ensureConversation();

    const chatHistory = newMessages
      .map(m => `${m.role === 'user' ? 'User' : 'InnerSpace'}: ${m.content}`)
      .join('\n\n');

    const systemPrompt = buildSystemPrompt();

    const response = await apiClient.integrations.Core.InvokeLLM({
      prompt: `${systemPrompt}\n\nConversation so far:\n${chatHistory}\n\nRespond as InnerSpace:`,
    });

    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  // First message auto-greeting
  useEffect(() => {
    if (messages.length === 0 && prefs !== undefined) {
      const greet = async () => {
        setIsTyping(true);
        const systemPrompt = buildSystemPrompt();
        const name = prefs?.display_name ? ` The user's name is ${prefs.display_name}.` : '';
        const response = await apiClient.integrations.Core.InvokeLLM({
          prompt: `${systemPrompt}${name}\n\nStart a new conversation with a warm, brief greeting. Be genuine, not generic. Keep it to 2-3 sentences.`,
        });
        setIsTyping(false);
        setMessages([{ role: 'assistant', content: response }]);
      };
      greet();
    }
  }, [prefs]);

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  const getPlaceholder = () => {
    if (mode === 'silent') return 'Just write what comes to mind...';
    if (mode === 'reflection') return 'Tell me what happened...';
    if (mode === 'perspective') return "Describe the situation you're thinking about...";
    return "Share what's on your mind...";
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link
            to={createPageUrl('Home')}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-lavender/30 flex items-center justify-center">
              <motion.div
                animate={isTyping ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-primary/50"
              />
            </div>
            <div>
              <p className="text-sm font-medium">InnerSpace</p>
              <p className="text-[10px] text-muted-foreground">
                {isTyping ? 'Thinking...' : 'Here to listen'}
              </p>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded-full hover:bg-muted/50 transition-colors">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={clearChat} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mode selector */}
      <div className="px-4 py-2 border-b border-border/20 bg-background/50">
        <ModeSelector activeMode={mode} onModeChange={setMode} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} isUser={msg.role === 'user'} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-border/20 bg-background/80 backdrop-blur-sm">
        <ChatInput
          onSend={sendMessage}
          disabled={isTyping}
          placeholder={getPlaceholder()}
        />
      </div>
    </div>
  );
}