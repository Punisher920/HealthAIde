import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { SendEmail } from "@/api/integrations";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("loading");
    try {
      await SendEmail({
        to: "contact@healthaide.ai",
        from_name: "HealthAIde.ai Contact Form",
        subject: `New Message from ${formData.name}`,
        body: `
          <p>You have received a new message from the HealthAIde.ai contact form:</p>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${formData.message}</p>
        `,
      });
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      console.error("Failed to send email:", err);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="backdrop-blur-glass neon-border">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 glow-text">Get In Touch</h1>
                <p className="text-slate-300 text-lg">Have questions or feedback? We'd love to hear from you.</p>
              </div>

              {status === "success" ? (
                <div className="text-center p-8 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                  <p className="text-slate-300">Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Input id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="bg-slate-800/50 border-cyan-500/30 text-white" />
                    {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Input id="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="bg-slate-800/50 border-cyan-500/30 text-white" />
                    {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Textarea id="message" placeholder="Your Message" rows={6} value={formData.message} onChange={handleChange} className="bg-slate-800/50 border-cyan-500/30 text-white" />
                    {errors.message && <p className="text-red-400 text-sm">{errors.message}</p>}
                  </div>
                  <Button type="submit" disabled={status === "loading"} className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold py-3 glow-effect">
                    {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5 mr-2" /> Send Message</>}
                  </Button>
                  {status === "error" && (
                    <div className="flex items-center gap-2 text-red-400"><AlertTriangle className="w-4 h-4"/><span>Something went wrong. Please try again.</span></div>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}