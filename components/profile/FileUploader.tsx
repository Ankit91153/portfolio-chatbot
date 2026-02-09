"use client";

import { useState } from "react";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { profileService } from "@/services/profile.service";

interface FileUploaderProps {
  onDataExtracted: (data: any) => void;
}

export function FileUploader({ onDataExtracted }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return "Invalid file format. Only PDF, DOC, and DOCX files are supported.";
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return "File size exceeds 10MB limit. Please upload a smaller file.";
    }

    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous errors
    setFileError(null);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      toast.error("Invalid File", {
        description: validationError,
      });
      e.target.value = ""; // Reset input
      return;
    }

    setFileName(file.name);
    setUploading(true);

    // Show loading toast
    const loadingToast = toast.loading("Processing Resume", {
      description: "Extracting information from your resume...",
    });

    try {
      const result = await profileService.extractResume(file);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to extract data from resume");
      }

      // Success
      toast.success("Resume Processed Successfully!", {
        description: "Your information has been extracted and filled in the form.",
        id: loadingToast,
      });

      console.log(result)
      onDataExtracted(result.data);
      setFileError(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to process resume";
      
      setFileError(errorMessage);
      toast.error("Processing Failed", {
        description: errorMessage,
        id: loadingToast,
      });
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input for re-upload
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Upload Resume</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload your resume (PDF, DOC, or DOCX) and we'll automatically extract your information
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="relative"
              disabled={uploading}
              asChild
            >
              <label className="cursor-pointer">
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Choose File
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </Button>
            {fileName && !fileError && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{fileName}</span>
              </div>
            )}
          </div>

          {fileError && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">File Format Error</p>
                <p className="text-sm text-destructive/80 mt-1">{fileError}</p>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Supported formats: PDF, DOC, DOCX</p>
            <p>• Maximum file size: 10MB</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
