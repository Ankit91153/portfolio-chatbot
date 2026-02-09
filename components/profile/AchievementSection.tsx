"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Achievement } from "@/types/profile";

interface AchievementSectionProps {
  data: Achievement[];
  onChange: (data: Achievement[]) => void;
}

export function AchievementSection({ data, onChange }: AchievementSectionProps) {
  const addAchievement = () => {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        title: "",
        description: "",
        date: "",
      },
    ]);
  };

  const removeAchievement = (id: string) => {
    onChange(data.filter((ach) => ach.id !== id));
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    onChange(
      data.map((ach) => (ach.id === id ? { ...ach, [field]: value } : ach))
    );
  };

  return (
    <div className="space-y-4">
      {data.map((ach, index) => (
        <Card key={ach.id} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Achievement {index + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeAchievement(ach.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={ach.title}
                onChange={(e) => updateAchievement(ach.id, "title", e.target.value)}
                placeholder="Award or Achievement Title"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Date *</Label>
              <Input
                type="month"
                value={ach.date}
                onChange={(e) => updateAchievement(ach.id, "date", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={ach.description}
                onChange={(e) => updateAchievement(ach.id, "description", e.target.value)}
                placeholder="Describe your achievement..."
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
        </Card>
      ))}
      <Button onClick={addAchievement} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Achievement
      </Button>
    </div>
  );
}
