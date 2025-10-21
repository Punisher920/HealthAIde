import React, { useState, useEffect } from "react";
import { AffiliateLink } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Link as LinkIcon, Loader2 } from "lucide-react";
import AffiliateLinkForm from "../components/admin/AffiliateLinkForm";
import AffiliateLinkCard from "../components/admin/AffiliateLinkCard";
import { motion, AnimatePresence } from "framer-motion";

export default function AffiliateDashboardPage() {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setIsLoading(true);
    try {
      const data = await AffiliateLink.list("-created_date");
      setLinks(data);
    } catch (error) {
      console.error("Error loading affiliate links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingLink) {
      // Update existing link
      await AffiliateLink.update(editingLink.id, formData);
    } else {
      // Create new link
      await AffiliateLink.create(formData);
    }
    await loadLinks();
    closeDialog();
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      await AffiliateLink.delete(id);
      await loadLinks();
    }
  };

  const openDialog = () => {
    setEditingLink(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingLink(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 glow-text">Affiliate Dashboard</h1>
            <p className="text-slate-300 text-lg">Manage your promotional product links.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openDialog} className="bg-gradient-to-r from-cyan-500 to-emerald-500 glow-effect">
                <Plus className="w-5 h-5 mr-2" />
                Add New Link
              </Button>
            </DialogTrigger>
            <AffiliateLinkForm
              initialData={editingLink}
              onSubmit={handleFormSubmit}
              onCancel={closeDialog}
            />
          </Dialog>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : links.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 backdrop-blur-glass neon-border rounded-xl">
            <LinkIcon className="w-16 h-16 mx-auto text-slate-500 mb-4" />
            <h3 className="text-xl font-semibold text-white">No affiliate links yet.</h3>
            <p className="text-slate-400 mb-6">Click "Add New Link" to get started.</p>
            <Button onClick={openDialog} className="bg-gradient-to-r from-cyan-500 to-emerald-500">
              Add Your First Link
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {links.map((link) => (
                <motion.div
                  key={link.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AffiliateLinkCard link={link} onEdit={handleEdit} onDelete={handleDelete} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}