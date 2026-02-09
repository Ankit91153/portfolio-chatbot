"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Certification } from "@/types/profile";

interface CertificationSectionProps {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

export function CertificationSection({ data, onChange }: CertificationSectionProps) {
  const addCertification = () => {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        certificateName: "",
        issuingOrganization: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
      },
    ]);
  };

  const removeCertification = (id: string) => {
    onChange(data.filter((cert) => cert.id !== id));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    onChange(
      data.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
    );
  };

  return (
    <div className="space-y-4">
      {data.map((cert, index) => (
        <Card key={cert.id} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Certification {index + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCertification(cert.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Certification Name *</Label>
              <Input
                value={cert.certificateName}
                onChange={(e) => updateCertification(cert.id, "certificateName", e.target.value)}
                placeholder="AWS Certified Solutions Architect"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Issuing Organization *</Label>
              <Input
                value={cert.issuingOrganization}
                onChange={(e) => updateCertification(cert.id, "issuingOrganization", e.target.value)}
                placeholder="Amazon Web Services"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Issue Date *</Label>
              <Input
                type="month"
                value={cert.issueDate}
                onChange={(e) => updateCertification(cert.id, "issueDate", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Expiry Date (Optional)</Label>
              <Input
                type="month"
                value={cert.expiryDate || ""}
                onChange={(e) => updateCertification(cert.id, "expiryDate", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Credential ID (Optional)</Label>
              <Input
                value={cert.credentialId || ""}
                onChange={(e) => updateCertification(cert.id, "credentialId", e.target.value)}
                placeholder="ABC123XYZ"
                className="mt-2"
              />
            </div>
          </div>
        </Card>
      ))}
      <Button onClick={addCertification} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Certification
      </Button>
    </div>
  );
}
