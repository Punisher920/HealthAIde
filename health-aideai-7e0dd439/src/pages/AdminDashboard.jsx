import React, { useState, useEffect } from 'react';
import { Product } from '@/api/entities';
import { BlogPost } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, BookOpen, Brain, BarChart3, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import ResearchAgent from '../components/admin/ResearchAgent';
import ProductManager from '../components/admin/ProductManager';
import BlogManager from '../components/admin/BlogManager';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="backdrop-blur-glass neon-border">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{value}</div>
    </CardContent>
  </Card>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, posts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [products, posts] = await Promise.all([
          Product.list(),
          BlogPost.list(),
        ]);
        setStats({ products: products.length, posts: posts.length });
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold glow-text flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8" />
          Admin Dashboard
        </h1>
        <p className="text-slate-300">Manage your application content and resources.</p>
      </motion.div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-cyan-500/20 mb-6">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="products">
            <ShoppingBag className="w-4 h-4 mr-2" /> Products
          </TabsTrigger>
          <TabsTrigger value="blog">
            <BookOpen className="w-4 h-4 mr-2" /> Blog Posts
          </TabsTrigger>
          <TabsTrigger value="agent">
            <Brain className="w-4 h-4 mr-2" /> Research Agent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatCard title="Total Products" value={stats.products} icon={ShoppingBag} color="text-cyan-400" />
              <StatCard title="Total Blog Posts" value={stats.posts} icon={BookOpen} color="text-emerald-400" />
            </div>
            <Card className="backdrop-blur-glass neon-border">
              <CardHeader>
                <CardTitle>Welcome, Admin!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  This is your central hub for managing HealthAIde.ai. Use the tabs above to navigate between different sections. You can manage products, write and publish blog posts, and utilize the AI Research Agent to discover and create new content.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="products">
          <ProductManager />
        </TabsContent>
        <TabsContent value="blog">
          <BlogManager />
        </TabsContent>
        <TabsContent value="agent">
          <ResearchAgent />
        </TabsContent>
      </Tabs>
    </div>
  );
}