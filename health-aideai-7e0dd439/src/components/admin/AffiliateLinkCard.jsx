import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ExternalLink } from "lucide-react";

export default function AffiliateLinkCard({ link, onEdit, onDelete }) {
  return (
    <Card className="backdrop-blur-glass neon-border">
      <CardContent className="p-4 flex gap-4">
        <img
          src={link.image_url || `https://via.placeholder.com/150/0B1426/00D4FF?text=${link.product_name.charAt(0)}`}
          alt={link.product_name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-white text-lg">{link.product_name}</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">{link.platform}</Badge>
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-300">{link.category}</Badge>
            </div>
          </div>
          <p className="text-sm text-slate-300 mt-1 line-clamp-2">{link.product_description}</p>
          <a href={link.affiliate_url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline break-all flex items-center gap-1 mt-2">
            {link.affiliate_url} <ExternalLink className="w-3 h-3"/>
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(link)} className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(link.id)} className="border-red-500/50 text-red-300 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}