import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function AffiliateLinkForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    affiliate_url: "",
    image_url: "",
    category: "",
    platform: "",
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        product_name: "", product_description: "", affiliate_url: "",
        image_url: "", category: "", platform: "", is_active: true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <DialogContent className="backdrop-blur-glass border-cyan-500/30 text-white">
      <DialogHeader>
        <DialogTitle className="glow-text">{initialData ? "Edit" : "Add"} Affiliate Link</DialogTitle>
        <DialogDescription className="text-slate-400">
          Enter the details for the affiliate product you want to promote.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <Input name="product_name" placeholder="Product Name" value={formData.product_name} onChange={handleChange} required className="bg-slate-800/50 border-cyan-500/30" />
        <Textarea name="product_description" placeholder="Product Description" value={formData.product_description} onChange={handleChange} className="bg-slate-800/50 border-cyan-500/30" />
        <Input name="affiliate_url" placeholder="Affiliate URL" value={formData.affiliate_url} onChange={handleChange} required className="bg-slate-800/50 border-cyan-500/30" />
        <Input name="image_url" placeholder="Image URL" value={formData.image_url} onChange={handleChange} className="bg-slate-800/50 border-cyan-500/30" />
        <div className="grid grid-cols-2 gap-4">
          <Select name="category" value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
            <SelectTrigger className="bg-slate-800/50 border-cyan-500/30"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Supplements">Supplements</SelectItem>
              <SelectItem value="Fitness">Fitness</SelectItem>
              <SelectItem value="Books">Books</SelectItem>
              <SelectItem value="Courses">Courses</SelectItem>
              <SelectItem value="Biohacking">Biohacking</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Personal Care">Personal Care</SelectItem>
            </SelectContent>
          </Select>
          <Select name="platform" value={formData.platform} onValueChange={(value) => handleSelectChange("platform", value)}>
            <SelectTrigger className="bg-slate-800/50 border-cyan-500/30"><SelectValue placeholder="Platform" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Amazon">Amazon</SelectItem>
              <SelectItem value="ClickBank">ClickBank</SelectItem>
              <SelectItem value="ShareASale">ShareASale</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} className="border-slate-600 text-slate-300">Cancel</Button>
          <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-cyan-500 to-emerald-500">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Link"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}