import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

export default function InteractionChecker({ onMedicationsChange }) {
  const [medications, setMedications] = useState([]);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    onMedicationsChange?.(medications);
  }, [medications]); // eslint-disable-line react-hooks/exhaustive-deps

  const addMedication = () => {
    const value = current.trim();
    if (!value) return;
    if (medications.includes(value)) {
      setCurrent("");
      return;
    }
    setMedications((prev) => [...prev, value]);
    setCurrent("");
  };

  const removeMedication = (idx) => {
    setMedications((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMedication();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Add a medication (e.g., warfarin)"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onKeyDown={handleKey}
          className="bg-slate-800/50 border-cyan-500/30 text-white"
        />
        <Button onClick={addMedication} className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
      </div>

      {medications.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {medications.map((m, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="border-blue-500/40 text-blue-300 bg-blue-500/10 px-2 py-1 flex items-center gap-2"
            >
              {m}
              <button
                onClick={() => removeMedication(idx)}
                className="ml-1 text-blue-200/80 hover:text-blue-100"
                aria-label={`Remove ${m}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}