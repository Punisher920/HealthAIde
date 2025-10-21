import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Shield } from "lucide-react";
import ResearchAgent from "../components/admin/ResearchAgent";

export default function RootAgentPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white glow-text">Claude Root Agent Console</h1>
        </div>

        <Card className="backdrop-blur-glass neon-border mb-6">
          <CardContent className="p-4 text-slate-300 text-sm">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-purple-300 mt-0.5" />
              <p>
                Admin-only assistant with full CRUD tools for Products, BlogPosts, Safety, Profiles, Adherence, Appointments, Research, and more.
                The agent will ask for confirmation before destructive operations and always follow privacy and compliance guidelines.
              </p>
            </div>
          </CardContent>
        </Card>

        <ResearchAgent
          agentName="claudeRoot"
          title="Claude Root Agent"
          subtitle="Admin-level assistant with full entity access"
        />
      </div>
    </div>
  );
}