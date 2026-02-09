"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AboutMeSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function AboutMeSection({ value, onChange }: AboutMeSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="aboutMe">About Me</Label>
        <Textarea
          id="aboutMe"
          placeholder="Tell us about yourself, your career goals, and what makes you unique..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className="mt-2"
        />
      </div>
    </div>
  );
}
