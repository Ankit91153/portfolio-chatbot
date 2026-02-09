"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Experience } from "@/types/profile";

interface ExperienceSectionProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export function ExperienceSection({ data, onChange }: ExperienceSectionProps) {
  const addExperience = () => {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrentlyWorking: false,
      },
    ]);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    onChange(
      data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  return (
    <div className="space-y-4">
      {data.map((exp, index) => (
        <Card key={exp.id} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Experience {index + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(exp.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Company *</Label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                placeholder="Company Name"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Position *</Label>
              <Input
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                placeholder="Software Engineer"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Location *</Label>
              <Input
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                placeholder="San Francisco, CA"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Start Date *</Label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                disabled={exp.isCurrentlyWorking}
                className="mt-2"
              />
            </div>
            <div className="flex items-center gap-2 mt-8">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.isCurrentlyWorking}
                onChange={(e) => updateExperience(exp.id, "isCurrentlyWorking", e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor={`current-${exp.id}`} className="cursor-pointer">
                Currently working here
              </Label>
            </div>
            <div className="md:col-span-2">
              <Label>Description *</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
        </Card>
      ))}
      <Button onClick={addExperience} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Experience
      </Button>
    </div>
  );
}
