"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Education } from "@/types/profile";

interface EducationSectionProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export function EducationSection({ data, onChange }: EducationSectionProps) {
  const addEducation = () => {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        percentage: "",
      },
    ]);
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(
      data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  return (
    <div className="space-y-4">
      {data.map((edu, index) => (
        <Card key={edu.id} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Education {index + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeEducation(edu.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Institution *</Label>
              <Input
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                placeholder="University Name"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Degree *</Label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                placeholder="Bachelor's, Master's, etc."
                className="mt-2"
              />
            </div>
            <div>
              <Label>Field of Study *</Label>
              <Input
                value={edu.fieldOfStudy}
                onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                placeholder="Computer Science"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Start Date *</Label>
              <Input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>End Date *</Label>
              <Input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="md:col-span-2">
              <Label>GPA/Percentage (Optional)</Label>
              <Input
                value={edu.percentage || ""}
                onChange={(e) => updateEducation(edu.id, "percentage", e.target.value)}
                placeholder="3.8/4.0 or 85%"
                className="mt-2"
              />
            </div>
          </div>
        </Card>
      ))}
      <Button onClick={addEducation} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Education
      </Button>
    </div>
  );
}
