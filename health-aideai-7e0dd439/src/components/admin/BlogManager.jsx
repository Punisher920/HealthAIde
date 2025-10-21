import React, { useState, useEffect } from 'react';
import { BlogPost } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const postList = await BlogPost.list('-created_date');
      setPosts(postList);
    } catch (error) {
      console.error("Error loading blog posts:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusBadge = (status) => {
    const colors = {
      published: 'bg-green-500/20 text-green-300 border-green-500/30',
      draft: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
      review: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    };
    return <Badge className={colors[status] || colors.draft}>{status}</Badge>;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <Card className="backdrop-blur-glass neon-border">
        <CardHeader>
          <CardTitle>Blog Post Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Reviewed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium text-white">{post.title}</TableCell>
                    <TableCell>{post.topic}</TableCell>
                    <TableCell>{getStatusBadge(post.publish_state)}</TableCell>
                    <TableCell>{post.last_reviewed ? format(new Date(post.last_reviewed), 'PPP') : 'N/A'}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon" className="text-cyan-300 border-cyan-500/50 hover:bg-cyan-500/10"><Edit className="w-4 h-4" /></Button>
                      <Button variant="outline" size="icon" className="text-red-400 border-red-500/50 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}