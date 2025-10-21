import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function LatestGuides({ posts, loading }) {
  if (loading) {
    return (
      <section className="py-20 px-4 md:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="backdrop-blur-glass">
                <CardContent className="p-6">
                  <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 md:px-8 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 glow-text">
            Latest Health Guides
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Expert-backed articles and guides to help you on your wellness journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="backdrop-blur-glass neon-border h-full hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <img
                      src={post.featured_image || "https://images.unsplash.com/photo-1506629905607-0ad19e169440?w=400&h=250&fit=crop"}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {post.category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-3 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.reading_time || 5} min read</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {post.tags?.slice(0, 2).map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-emerald-500/30 text-emerald-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-3 group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link to={`${createPageUrl("Blog")}?post=${post.id}`}>
                    <Button variant="outline" className="w-full border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to={createPageUrl("Blog")}>
            <Button variant="outline" size="lg" className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10 px-8 py-4 rounded-xl">
              View All Guides
              <BookOpen className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}