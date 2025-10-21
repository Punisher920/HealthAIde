
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-emerald-500/10 animate-pulse"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl flex items-center justify-center glow-effect">
                <Bot className="w-7 h-7 text-slate-900" />
              </div>
              <span className="text-cyan-300 font-semibold text-lg">Meet Nouri</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="glow-text">Smarter Health.</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Powered by AI.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              Your personal AI health assistant that provides evidence-based guidance, 
              personalized recommendations, and connects you with premium wellness products.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to={createPageUrl("Chat")}>
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold px-8 py-4 rounded-xl glow-effect">
                  <MessageSquare className="w-6 h-6 mr-2" />
                  Talk to Nouri Now
                </Button>
              </Link>
              <Link to={createPageUrl("Store")}>
                <Button variant="outline" size="lg" className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 px-8 py-4 rounded-xl">
                  Explore Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Evidence-Based</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Personalized</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="backdrop-blur-glass neon-border rounded-3xl p-8 glow-effect">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Nouri Assistant</h3>
                  <p className="text-sm text-emerald-300">Online now</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-2xl p-4 border-l-4 border-cyan-400">
                  <p className="text-slate-300">
                    "Hi! I'm Nouri, your AI health assistant. I can help you with personalized wellness advice, supplement recommendations, and finding the right products for your health goals."
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-2xl p-4 ml-8">
                  <p className="text-slate-400 text-sm">
                    "I'm interested in improving my gut health. What would you recommend?"
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-4 border-l-4 border-emerald-400">
                  <p className="text-slate-300">
                    "Great question! For gut health, I'd recommend starting with probiotics and fiber-rich foods. I can suggest some high-quality products that have helped others with similar goals."
                  </p>
                </div>
              </div>

              <Link to={createPageUrl("Chat")} className="block mt-6">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium">
                  Start Your Conversation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
