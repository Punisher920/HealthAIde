
import React, { useState, useEffect, useCallback, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Send, Plus, Search, BookOpen, ShoppingBag, AlertTriangle, Brain, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as MessageBubbleModule from "../agents/MessageBubble";
const ResolvedMessageBubble = (MessageBubbleModule && (MessageBubbleModule.default || MessageBubbleModule.MessageBubble))
  ? (MessageBubbleModule.default || MessageBubbleModule.MessageBubble)
  : null;

// Safe fallback bubble to avoid runtime errors if component is not resolved
const FallbackBubble = ({ message }) => (
  <div className={`p-3 rounded-xl ${message.role === 'user' ? 'bg-purple-500/20 text-purple-100' : 'bg-slate-800/50 text-slate-300 border border-purple-500/20'}`}>
    <p className="text-sm whitespace-pre-wrap">{message?.content ?? ''}</p>
  </div>
);

export default function ResearchAgent({ agentName = "healthResearcher", title = "Health Research Agent", subtitle = "Ready to research and develop content" }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [agentError, setAgentError] = useState(null);
  const [isInjecting, setIsInjecting] = useState(false);
  const injectedRef = useRef(new Set()); // conversationIds with injected context

  const loadConversations = useCallback(async () => {
    try {
      setAgentError(null);
      const convos = await base44.agents.listConversations({
        agent_name: agentName
      });
      setConversations(convos || []);
      if ((convos || []).length > 0 && !activeConversation) {
        setActiveConversation(convos[0]);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      setAgentError("Could not load agent conversations. Please ensure the agent exists and you have access.");
    }
  }, [activeConversation, agentName]);

  const injectSystemContext = useCallback(async (conversation) => {
    if (!conversation || injectedRef.current.has(conversation.id)) return;
    setIsInjecting(true);
    setAgentError(null);
    try {
      const { data } = await base44.functions.invoke('systemContext', {});
      const text = data?.text || '';
      if (text) {
        await base44.agents.addMessage(conversation, {
          role: "user", // Send context as a user message to the agent
          content: text
        });
        injectedRef.current.add(conversation.id);
      }
    } catch (error) {
      console.error("Failed to inject context:", error);
      setAgentError("Couldn’t inject system context. Please try again.");
    } finally {
      setIsInjecting(false);
    }
  }, [setAgentError, setIsInjecting]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (activeConversation) {
      const unsubscribe = base44.agents.subscribeToConversation(activeConversation.id, (data) => {
        setMessages(data?.messages || []);
      });
      // Auto-inject system context once per conversation
      if (!injectedRef.current.has(activeConversation.id)) {
        injectSystemContext(activeConversation);
      }
      return unsubscribe;
    }
  }, [activeConversation, injectSystemContext]);

  const createNewConversation = async (topic = "General Research") => {
    setIsCreatingConversation(true);
    setAgentError(null);
    try {
      const conversation = await base44.agents.createConversation({
        agent_name: agentName,
        metadata: {
          name: `${title}: ${topic}`,
          description: `Session focusing on ${topic}`
        }
      });
      setConversations(prev => [conversation, ...(prev || [])]);
      setActiveConversation(conversation);
      // Context will be auto-injected by the effect
    } catch (error) {
      console.error("Error creating conversation:", error);
      setAgentError("Failed to create a new conversation. Please try again.");
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !activeConversation || isLoading) return;

    const optimisticMessage = {
      role: "user",
      content: inputMessage,
      id: `temp-${Date.now()}`
    };

    setMessages(prev => [...prev, optimisticMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");
    setIsLoading(true);
    setAgentError(null);

    try {
      // Ensure context is injected before first user message if needed
      if (!injectedRef.current.has(activeConversation.id)) {
        await injectSystemContext(activeConversation);
      }
      await base44.agents.addMessage(activeConversation, {
        role: "user",
        content: messageToSend
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      setAgentError("Message failed to send. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickResearchPrompts = [
    {
      text: "Research latest gut health supplements",
      icon: Search,
      category: "supplements"
    },
    {
      text: "Create blog post about biohacking trends",
      icon: BookOpen,
      category: "content"
    },
    {
      text: "Find new men's health products to add",
      icon: ShoppingBag,
      category: "products"
    },
    {
      text: "Check for new medication interactions",
      icon: AlertTriangle,
      category: "safety"
    }
  ];

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt.text);
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Conversations Sidebar */}
      <Card className="backdrop-blur-glass neon-border lg:col-span-1">
        <CardHeader className="border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Research Sessions</CardTitle>
            <Button
              size="sm"
              onClick={() => createNewConversation()}
              disabled={isCreatingConversation}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {isCreatingConversation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2 max-h-96 lg:max-h-[600px] overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConversation(conv)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                activeConversation?.id === conv.id
                  ? 'bg-purple-500/20 border border-purple-500/30'
                  : 'bg-slate-800/30 hover:bg-slate-700/50'
              }`}
            >
              <div className="text-sm font-medium text-white truncate">
                {conv.metadata?.name || 'Research Session'}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {new Date(conv.created_date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <Card className="backdrop-blur-glass neon-border lg:col-span-3">
        <CardHeader className="border-b border-purple-500/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-sm text-purple-300">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => injectSystemContext(activeConversation)}
                disabled={!activeConversation || isInjecting}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                {isInjecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Inject Context
              </Button>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Active
              </Badge>
            </div>
          </div>
          {agentError && (
            <div className="mt-3 text-sm text-red-300">
              {agentError}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && !activeConversation && (
              <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                <Brain className="w-16 h-16 mx-auto text-slate-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Session Selected</h3>
                <p className="text-slate-400 mb-6">Create or select a research session to begin.</p>
              </div>
            )}
            {messages.length === 0 && activeConversation && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Research</h3>
                <p className="text-slate-400 mb-6">Ask me to research health topics, find products, or create content</p>

                <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {quickResearchPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 justify-start"
                      onClick={() => handleQuickPrompt(prompt)}
                    >
                      <prompt.icon className="w-4 h-4 mr-2" />
                      {prompt.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id || message.created_date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {typeof ResolvedMessageBubble === 'function'
                    ? <ResolvedMessageBubble message={message} />
                    : <FallbackBubble message={message} />}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t border-purple-500/20 p-4">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask me to research health topics, find products, or create content..."
                className="flex-1 bg-slate-800/50 border-purple-500/30 text-white placeholder-slate-400 focus:border-purple-400"
                disabled={isLoading || !activeConversation}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim() || !activeConversation}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
