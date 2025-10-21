
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { BlogPost } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added CardHeader, CardTitle
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Search, Clock, ArrowLeft, Tag, Sparkles, Loader2 } from "lucide-react"; // Added Sparkles, Loader2
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button"; // Added Button
import { base44 } from "@/api/base44Client"; // Added base44 client

export default function BlogPage() {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [singlePost, setSinglePost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [aiSummary, setAiSummary] = useState(""); // New state
  const [summarizing, setSummarizing] = useState(false); // New state
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const postId = params.get("post");

    if (postId) {
      loadSinglePost(postId);
    } else {
      loadAllPosts();
    }
  }, [location]);

  useEffect(() => {
    let filtered = posts;
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }
    setFilteredPosts(filtered);
  }, [posts, searchTerm, categoryFilter]);

  const loadAllPosts = async () => {
    setLoading(true);
    setSinglePost(null);
    setAiSummary(""); // Reset AI summary when loading all posts
    try {
      const data = await BlogPost.filter({ published: true }, "-created_date");
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error("Error loading blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSinglePost = async (id) => {
    setLoading(true);
    setPosts([]);
    setAiSummary(""); // Reset AI summary when loading a new single post
    try {
      const post = await BlogPost.get(id);
      setSinglePost(post);
    } catch (error) {
      console.error("Error loading single post:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(posts.map(p => p.category))];

  if (loading) {
    return <div className="p-8"><Skeleton className="w-full h-64" /></div>;
  }

  if (singlePost) {
    const handleSummarize = async () => {
      setSummarizing(true);
      setAiSummary("");
      const userMessage = `
Summarize the following health article in plain language (bullets + 5 key takeaways).
Be neutral, avoid medical advice, and add a final disclaimer.

Title: ${singlePost.title}
Category: ${singlePost.category}
Content:
${singlePost.content || singlePost.excerpt || ""}

Return concise markdown.`;
      try {
        const { data } = await base44.functions.invoke("claude", { messages: [], userMessage });
        setAiSummary(data?.content || "No summary generated. Please try again or refresh the page.");
      } catch (error) {
        console.error("Error generating AI summary:", error);
        setAiSummary("Failed to generate summary due to an error. Please try again.");
      } finally {
        setSummarizing(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to={createPageUrl("Blog")} className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-100 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to All Guides
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 glow-text">{singlePost.title}</h1>
          <div className="flex items-center gap-4 text-slate-400 mb-6">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">{singlePost.category}</Badge>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {singlePost.reading_time} min read</div>
          </div>
          <img src={singlePost.featured_image} alt={singlePost.title} className="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-8 neon-border"/>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300">
            <ReactMarkdown>{singlePost.content}</ReactMarkdown>
          </div>

          <Card className="backdrop-blur-glass neon-border mt-8">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-white">AI Summary</CardTitle>
              <Button onClick={handleSummarize} disabled={summarizing} className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
                {summarizing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Summarizing…</> : <><Sparkles className="w-4 h-4 mr-2" />Summarize with Claude</>}
              </Button>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none text-slate-300">
              {aiSummary ? <ReactMarkdown>{aiSummary}</ReactMarkdown> : <p className="text-slate-400 text-sm">Get a quick, easy-to-read summary of this guide.</p>}
              <p className="text-xs text-slate-500 mt-4">This AI-generated summary is for informational and educational purposes only and should not be considered medical advice. Always consult with a qualified healthcare professional for any health concerns or before making any decisions related to your health or treatment.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 glow-text">Health Guides</h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">Expert-backed articles to help you navigate your wellness journey.</p>
        </motion.div>

        <Card className="backdrop-blur-glass neon-border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-cyan-500/30 text-white w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white md:w-64">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Card className="backdrop-blur-glass neon-border h-full hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <img src={post.featured_image} alt={post.title} className="w-full h-48 object-cover rounded-xl mb-4"/>
                    <div className="flex justify-between items-center mb-2">
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">{post.category}</Badge>
                      <span className="text-sm text-slate-400 flex items-center gap-1"><Clock className="w-4 h-4"/>{post.reading_time} min</span>
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2 group-hover:text-emerald-300 transition-colors line-clamp-2 h-14">{post.title}</h3>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-3 h-[60px]">{post.excerpt}</p>
                    <Link to={`${createPageUrl("Blog")}?post=${post.id}`}>
                      <span className="font-semibold text-cyan-300 hover:text-cyan-100 transition-colors inline-flex items-center gap-2">Read Article <ArrowLeft className="w-4 h-4 -rotate-180"/></span>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
