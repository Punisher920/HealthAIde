import React, { useEffect, useState } from "react";
import { User } from "@/api/entities";
import { UserProfile } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Gauge, Moon, Target, User as UserIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import UserProfileForm from "../components/profile/UserProfileForm";

export default function ProfilePage() {
  const [me, setMe] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const current = await User.me().catch(() => null);
        setMe(current || null);

        // With RLS, listing returns only the current user's records
        const records = await UserProfile.list();
        setProfile(records?.[0] || null);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      if (profile?.id) {
        await UserProfile.update(profile.id, values);
      } else {
        await UserProfile.create(values);
      }
      const refreshed = await UserProfile.list();
      setProfile(refreshed?.[0] || null);
      setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-slate-300">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading your profile...
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Heart Rate",
      value: profile?.heartRate ?? "—",
      suffix: profile?.heartRate ? "bpm" : "",
      icon: Activity,
      color: "from-rose-400 to-pink-500"
    },
    {
      title: "Daily Steps",
      value: profile?.steps ?? "—",
      suffix: profile?.steps ? "" : "",
      icon: Gauge,
      color: "from-cyan-400 to-emerald-500"
    },
    {
      title: "Sleep (avg)",
      value: profile?.sleepHours ?? "—",
      suffix: profile?.sleepHours ? "hrs" : "",
      icon: Moon,
      color: "from-indigo-400 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-slate-900" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white glow-text">
              My Profile
            </h1>
          </div>
          <p className="text-slate-300">
            {me ? `Welcome${me.full_name ? `, ${me.full_name}` : ""}.` : "Welcome."} Manage your health details privately.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Card className="backdrop-blur-glass neon-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{s.title}</p>
                      <div className="text-2xl font-bold text-white mt-1">
                        {s.value} {s.suffix}
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${s.color} flex items-center justify-center`}>
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="backdrop-blur-glass neon-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-300" />
              Edit Profile
              {savedAt && (
                <Badge className="ml-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  Saved {savedAt.toLocaleTimeString()}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserProfileForm
              defaultValues={profile || {}}
              submitting={saving}
              onSubmit={handleSubmit}
            />
            <p className="text-xs text-slate-500 mt-4">
              Your profile is private. Only you can view or update it.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}