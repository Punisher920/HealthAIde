
import React, { useState, useEffect, useRef } from "react";
import { ChatSession } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, Loader2, Sparkles, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import SafetyAlertModal from "../components/safety/SafetyAlertModal";
// Removed unused server function imports as they are not needed on the client
// import { openai } from "@/api/functions";
// import { gemini } from "@/api/functions";
// import { claude } from "@/api/functions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client"; // Added import for base44

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const [safetyAlert, setSafetyAlert] = useState(null);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [currentModel, setCurrentModel] = useState('openai');

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = () => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    
    const welcomeMessage = {
      role: "assistant",
      content: "Hi! I'm Nouri, your AI health assistant. I'm here to help you with personalized wellness advice, supplement recommendations, and answer any health-related questions you might have. What would you like to know about today?",
      timestamp: new Date().toISOString()
    };
    
    setMessages([welcomeMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkForSafetyAlerts = (message) => {
    const medicationKeywords = [
      'warfarin', 'st john', 'turmeric', 'ginseng', 'garlic', 
      'echinacea', 'blood thinner', 'antidepressant'
    ];
    
    const foundKeyword = medicationKeywords.find(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    if (foundKeyword) {
      const alert = {
        alert_type: 'drug_interaction',
        substance_name: foundKeyword,
        severity_level: 'major',
        alert_message: `Important safety information about ${foundKeyword} and potential interactions.`,
        detailed_information: `${foundKeyword} can interact with many medications and may affect their effectiveness or increase side effects. Common interactions include blood thinners, diabetes medications, and other supplements.`,
        recommended_action: 'Please consult with your healthcare provider before combining this with other medications or supplements.',
        requires_consultation: true
      };
      
      setSafetyAlert(alert);
      setShowSafetyModal(true);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    checkForSafetyAlerts(inputMessage);

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      let response;
      const payload = {
        messages: newMessages.slice(-10), // Send last 10 messages for context
        userMessage: inputMessage
      };

      // Use Base44 functions SDK to call backend functions
      if (currentModel === 'openai') {
          response = await base44.functions.invoke('openai', payload);
      } else if (currentModel === 'gemini') {
          response = await base44.functions.invoke('gemini', payload);
      } else {
          response = await base44.functions.invoke('claude', payload);
      }

      if (response.data?.error) { // Updated to use optional chaining for data
        throw new Error(response.data.error);
      }

      const assistantMessage = {
        role: "assistant",
        content: response.data?.content || "I'm sorry, I couldn't generate a response right now.", // Access content with optional chaining and provide fallback
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      // Save to chat session
      if (sessionId) {
        await ChatSession.create({
          session_id: sessionId,
          messages: finalMessages,
          topic: inputMessage.slice(0, 50)
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: "assistant",
        content: "I’m having trouble reaching the AI service right now. Please try again shortly.", // Updated error message
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl flex items-center justify-center glow-effect">
              <Bot className="w-7 h-7 text-slate-900" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white glow-text">
              Chat with Nouri
            </h1>
          </div>
          
          <div className="max-w-xs mx-auto mb-4">
            <Select value={currentModel} onValueChange={setCurrentModel}>
              <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white">
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>ChatGPT-4</span>
                  </div>
                </SelectItem>
                <SelectItem value="gemini">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-purple-400" />
                    <span>Google Gemini</span>
                  </div>
                </SelectItem>
                <SelectItem value="claude">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    <span>Anthropic Claude</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-slate-300 text-lg">
            Your AI-powered health assistant is ready to help
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              Online
            </Badge>
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </motion.div>

        <Card className="backdrop-blur-glass neon-border glow-effect">
          <CardHeader className="border-b border-cyan-500/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Nouri Assistant</h3>
                  <p className="text-sm text-emerald-300">
                    Using {currentModel === 'openai' ? 'ChatGPT-4' : currentModel === 'gemini' ? 'Google Gemini' : 'Anthropic Claude'}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Active Chat
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-5 h-5 text-slate-900" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                      <div
                        className={`p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white ml-auto'
                            : 'bg-slate-800/50 text-slate-300 border border-cyan-500/20'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 px-4">
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1 order-2">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-slate-900" />
                  </div>
                  <div className="bg-slate-800/50 text-slate-300 border border-cyan-500/20 p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Nouri is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-cyan-500/20 p-4">
              <div className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Nouri about your health concerns..."
                  className="flex-1 bg-slate-800/50 border-cyan-500/30 text-white placeholder-slate-400 focus:border-cyan-400"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white px-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              
              <div className="mt-3 text-center">
                <p className="text-xs text-slate-500">
                  Nouri provides general wellness information. Always consult healthcare professionals for medical advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <SafetyAlertModal
          alert={safetyAlert}
          isOpen={showSafetyModal}
          onClose={() => setShowSafetyModal(false)}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 p-4 backdrop-blur-glass rounded-xl border border-amber-500/30"
        >
          <p className="text-sm text-amber-300 text-center leading-relaxed">
            <span className="font-semibold">Important Medical Disclaimer:</span> Nouri provides general wellness information 
            for educational purposes only and should not replace professional medical advice, diagnosis, or treatment. 
            Always consult your physician or qualified healthcare provider with questions about medications, supplements, 
            or medical conditions. We may earn commission from affiliate links to recommended products. 
            Never disregard professional medical advice or delay seeking it based on information from this platform.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
