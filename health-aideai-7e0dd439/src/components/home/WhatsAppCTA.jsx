import React from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Smartphone } from "lucide-react";

export default function WhatsAppCTA() {
  const whatsappURL = base44.agents.getWhatsAppConnectURL("healthResearcher");

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Card className="backdrop-blur-glass neon-border">
          <CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Chat on WhatsApp</h3>
              <p className="text-slate-300">
                Stay connected to your AI assistant without opening the app. Receive updates, summaries, and quick answers.
              </p>
            </div>
            <div className="flex gap-3">
              <a href={whatsappURL} target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Connect WhatsApp
                </Button>
              </a>
              <Button variant="outline" className="border-cyan-500/40 text-cyan-300">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile Ready
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}