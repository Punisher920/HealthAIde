
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Bot, ShieldAlert } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ProductAIExplain({ product, medications = [] }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    setLoading(true);
    setAnswer("");
    const userMessage = `
You are Nouri, a careful health assistant. Summarize this product neutrally with benefits, typical use, and key cautions.
DO NOT prescribe or give dosing; add a general safety disclaimer and advise consulting a clinician.

Product:
${JSON.stringify({
  name: product?.name,
  category: product?.category,
  subcategory: product?.subcategory,
  price: product?.price,
  ingredients: product?.ingredients,
  benefits: product?.benefits,
  claims: product?.claims,
  certifications: product?.certifications
}, null, 2)}

User medications (if any): ${JSON.stringify(medications, null, 2)}
Emphasize checking for interactions if any medication is present. Provide concise, user-friendly explanation.`;
    try {
      const { data } = await base44.functions.invoke("claude", { messages: [], userMessage });
      setAnswer(data?.content || "No response.");
    } catch (e) {
      console.error("Claude product Q&A failed:", e);
      setAnswer("Sorry, I couldn’t fetch the AI explanation right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openAndAsk = async () => {
    setOpen(true);
    await ask();
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={openAndAsk}
        className="w-full border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 mt-2"
      >
        <Bot className="w-4 h-4 mr-2" />
        Ask Nouri about this product
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl bg-slate-900/90 border border-emerald-500/30">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-300" /> Product Q&A
            </DialogTitle>
          </DialogHeader>
          <div className="min-h-[120px] text-slate-300">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Nouri is analyzing…
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            )}
            <div className="mt-3 text-xs text-amber-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Educational only. Always consult a healthcare professional.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
