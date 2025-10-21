import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, XCircle } from "lucide-react";

export default function SafetyAlertModal({ alert, isOpen, onClose }) {
  if (!alert) return null;

  const severityMap = {
    critical: { label: "Critical", cls: "bg-red-500/20 text-red-300 border-red-500/30" },
    major: { label: "Major", cls: "bg-red-500/20 text-red-300 border-red-500/30" },
    moderate: { label: "Moderate", cls: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
    minor: { label: "Minor", cls: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" }
  };
  const sev = severityMap[(alert.severity_level || "").toLowerCase()] || severityMap.moderate;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="max-w-lg bg-slate-900/90 border border-amber-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Safety Alert
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Please review this important safety information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {alert.substance_name && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Substance:</span>
              <Badge variant="outline" className="border-amber-500/40 text-amber-300">
                {alert.substance_name}
              </Badge>
            </div>
          )}

          {alert.alert_type && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Type:</span>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                {alert.alert_type}
              </Badge>
            </div>
          )}

          {alert.severity_level && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Severity:</span>
              <Badge className={sev.cls}>{sev.label}</Badge>
            </div>
          )}

          {alert.alert_message && (
            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-100 text-sm flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{alert.alert_message}</p>
            </div>
          )}

          {alert.detailed_information && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Details</h4>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">
                {alert.detailed_information}
              </p>
            </div>
          )}

          {alert.recommended_action && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Recommended Action</h4>
              <p className="text-sm text-slate-300">{alert.recommended_action}</p>
            </div>
          )}

          {alert.requires_consultation && (
            <div className="text-sm text-red-300">
              This alert recommends consulting a qualified healthcare professional.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" onClick={onClose}>
            <XCircle className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}