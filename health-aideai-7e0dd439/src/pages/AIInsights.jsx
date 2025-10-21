
import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { UserProfile } from "@/api/entities";
import { AdherenceLog } from "@/api/entities";
import { HealthSummary } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Brain, CalendarClock, Sparkles } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

export default function AIInsights() {
  const [period, setPeriod] = useState("weekly");
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState("");
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    const init = async () => {
      const prof = (await UserProfile.list())?.[0] || null;
      setProfile(prof || null);
      const [adherence, hs] = await Promise.all([
        AdherenceLog.list("-created_date"),
        HealthSummary.list("-created_date")
      ]);
      setLogs(adherence || []);
      setSummaries(hs || []);
    };
    init();
  }, []);

  const periodDates = useMemo(() => {
    const end = new Date();
    const start = new Date();
    if (period === "weekly") start.setDate(end.getDate() - 7);
    else start.setMonth(end.getMonth() - 1);
    return { start, end };
  }, [period]);

  const generateInsights = async () => {
    setLoading(true);
    setInsights("");
    const startStr = format(periodDates.start, "yyyy-MM-dd");
    const endStr = format(periodDates.end, "yyyy-MM-dd");

    const profileStr = profile ? JSON.stringify({
      age: profile.age, sex: profile.sex, healthGoals: profile.healthGoals,
      heartRate: profile.heartRate, steps: profile.steps, sleepHours: profile.sleepHours
    }, null, 2) : "No profile";

    const logsForPeriod = logs.filter(l => {
      if (!l.scheduled_time) return false;
      const d = new Date(l.scheduled_time);
      return d >= periodDates.start && d <= periodDates.end;
    });

    const latestSummary = summaries?.[0] || null;

    const adherenceStr = logsForPeriod.slice(0, 100).map(l => ({
      medication: l.medication, dose: l.dose, scheduled_time: l.scheduled_time,
      taken_time: l.taken_time, status: l.status
    }));

    const summaryStr = latestSummary ? JSON.stringify(latestSummary, null, 2) : "No prior summaries";

    const userMessage = `
You are Nouri, a careful, evidence-based AI health assistant.
Task: Generate ${period} health insights and a gentle coaching plan with clear, actionable steps.

Date range: ${startStr} to ${endStr}

UserProfile (current):
${profileStr}

Latest HealthSummary (if any):
${summaryStr}

Adherence logs in period (truncated to recent 100):
${JSON.stringify(adherenceStr, null, 2)}

Please provide:
1) Key observations across heart rate, steps, sleep (cautious language, avoid diagnosis)
2) Adherence review (no blame, supportive tone)
3) 3–5 specific, achievable suggestions tailored to the data/goals
4) Safety notes/disclaimers where relevant
5) A compact checklist for this ${period}
End with: “This is educational only, not medical advice.”
`;

    try {
      // Call Claude backend function securely
      const { data } = await base44.functions.invoke("claude", { messages: [], userMessage });
      setInsights(data?.content || "No insights generated.");
    } catch (e) {
      console.error("Claude failed:", e);
      setInsights("Sorry, I couldn’t generate insights right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white glow-text">AI Health Insights</h1>
        </div>

        <Card className="backdrop-blur-glass neon-border mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-white">
              <CalendarClock className="w-5 h-5 text-cyan-300" />
              Generate Personalized Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white w-full sm:w-48">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-slate-300 text-sm">
                Range: {format(periodDates.start, "MMM d, yyyy")} — {format(periodDates.end, "MMM d, yyyy")}
              </div>
              <div className="ml-auto">
                <Button onClick={generateInsights} disabled={loading} className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate</>}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile?.healthGoals && <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Goal: {profile.healthGoals}</Badge>}
              {typeof profile?.heartRate === "number" && <Badge variant="outline" className="border-cyan-500/40 text-cyan-300">HR: {profile.heartRate} bpm</Badge>}
              {typeof profile?.steps === "number" && <Badge variant="outline" className="border-cyan-500/40 text-cyan-300">Steps: {profile.steps}</Badge>}
              {typeof profile?.sleepHours === "number" && <Badge variant="outline" className="border-cyan-500/40 text-cyan-300">Sleep: {profile.sleepHours} hrs</Badge>}
            </div>
          </CardContent>
        </Card>

        {insights && (
          <Card className="backdrop-blur-glass neon-border">
            <CardHeader>
              <CardTitle className="text-white">Your {period === "weekly" ? "Weekly" : "Monthly"} Insights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none text-slate-300">
              <ReactMarkdown>{insights}</ReactMarkdown>
              <p className="text-xs text-slate-500 mt-4">
                Educational purposes only; not medical advice. Always consult a qualified clinician.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
