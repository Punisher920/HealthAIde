
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Product } from "@/api/entities";
import { BlogPost } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageSquare, Sparkles, Shield, Zap, ArrowRight, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

import HeroSection from "../components/home/HeroSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import LatestGuides from "../components/home/LatestGuides";
import WhatsAppCTA from "../components/home/WhatsAppCTA";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [products, posts] = await Promise.all([
        Product.filter({ featured: true }, '-created_date', 6),
        BlogPost.filter({ published: true }, '-created_date', 3)
      ]);
      setFeaturedProducts(products);
      setLatestPosts(posts);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 glow-text">
              Why Choose Nouri?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Experience the future of personalized health guidance with our AI-powered assistant
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: "AI-Powered Guidance",
                description: "Get personalized health recommendations based on the latest research and your unique needs",
                color: "from-cyan-400 to-blue-500"
              },
              {
                icon: Shield,
                title: "Evidence-Based",
                description: "All recommendations are backed by scientific research and vetted by health professionals",
                color: "from-emerald-400 to-green-500"
              },
              {
                icon: Zap,
                title: "Instant Answers",
                description: "Get immediate responses to your health questions, available 24/7 whenever you need help",
                color: "from-purple-400 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="backdrop-blur-glass neon-border h-full hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center glow-effect`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProducts products={featuredProducts} loading={loading} />
      <LatestGuides posts={latestPosts} loading={loading} />
      <WhatsAppCTA />

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="backdrop-blur-glass neon-border rounded-3xl p-12"
          >
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-2xl flex items-center justify-center glow-effect">
              <Sparkles className="w-10 h-10 text-slate-900" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 glow-text">
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Join thousands who trust Nouri for personalized health guidance. Start your wellness journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Chat")}>
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold px-8 py-4 rounded-xl glow-effect">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Start Chatting with Nouri
                </Button>
              </Link>
              <Link to={createPageUrl("Store")}>
                <Button variant="outline" size="lg" className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 px-8 py-4 rounded-xl">
                  Explore Health Store
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
