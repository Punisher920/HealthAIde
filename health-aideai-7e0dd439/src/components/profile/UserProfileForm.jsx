import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

export default function UserProfileForm({ defaultValues, onSubmit, submitting }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      age: defaultValues?.age ?? "",
      sex: defaultValues?.sex ?? "",
      healthGoals: defaultValues?.healthGoals ?? "",
      heartRate: defaultValues?.heartRate ?? "",
      steps: defaultValues?.steps ?? "",
      sleepHours: defaultValues?.sleepHours ?? ""
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <Label className="text-slate-300">Age</Label>
          <Input
            type="number"
            min="0"
            step="1"
            className="bg-slate-800/50 border-cyan-500/30 text-white"
            {...register("age")}
          />
        </div>
        <div>
          <Label className="text-slate-300">Sex</Label>
          <Input
            placeholder="e.g., male, female, non-binary"
            className="bg-slate-800/50 border-cyan-500/30 text-white"
            {...register("sex")}
          />
        </div>
      </div>

      <div>
        <Label className="text-slate-300">Health Goals</Label>
        <Textarea
          placeholder="Briefly describe your health goals"
          className="bg-slate-800/50 border-cyan-500/30 text-white h-28"
          {...register("healthGoals")}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div>
          <Label className="text-slate-300">Heart Rate (bpm)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            className="bg-slate-800/50 border-cyan-500/30 text-white"
            {...register("heartRate")}
          />
        </div>
        <div>
          <Label className="text-slate-300">Steps (daily)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            className="bg-slate-800/50 border-cyan-500/30 text-white"
            {...register("steps")}
          />
        </div>
        <div>
          <Label className="text-slate-300">Sleep Hours (avg)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            className="bg-slate-800/50 border-cyan-500/30 text-white"
            {...register("sleepHours")}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}