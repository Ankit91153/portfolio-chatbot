import { NextRequest, NextResponse } from "next/server";
import { BackendResumeResponse } from "@/types/profile";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

// POST - Extract data from uploaded resume
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid file format. Only PDF, DOC, and DOCX files are supported." 
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          error: "File size exceeds 10MB limit" 
        },
        { status: 400 }
      );
    }

    // Create FormData for backend API
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    // Call backend API
    const response = await fetch(`${BACKEND_API_URL}/resume/parse_resume/`, {
      method: "POST",
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.detail || "Failed to process resume" 
        },
        { status: response.status }
      );
    }

    const data: BackendResumeResponse = await response.json();

    // Transform backend response to frontend format (add IDs)
    const transformedData = {
      aboutMe: data.aboutMe || "",
      personalInfo: data.personalInfo || {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",
      },
      educations: (data.educations || []).map((edu) => ({
        id: Date.now().toString() + Math.random(),
        institution: edu.institution || "",
        degree: edu.degree || "",
        fieldOfStudy: edu.fieldOfStudy || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        percentage: edu.percentage || "",
      })),
      skills: data.skills || [],
      experience: (data.experience || []).map((exp) => ({
        id: Date.now().toString() + Math.random(),
        company: exp.company || "",
        position: exp.position || "",
        location: exp.location || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        description: exp.description || "",
        isCurrentlyWorking: exp.isCurrentlyWorking || false,
      })),
      certifications: (data.certifications || []).map((cert) => ({
        id: Date.now().toString() + Math.random(),
        certificateName: cert.certificateName || "",
        issuingOrganization: cert.issuingOrganization || "",
        issueDate: cert.issueDate || "",
        expiryDate: cert.expiryDate || "",
        credentialId: cert.credentialId || "",
      })),
      achievements: (data.achievements || []).map((ach) => ({
        id: Date.now().toString() + Math.random(),
        title: ach.title || "",
        date: ach.date || "",
        description: ach.description || "",
      })),
    };

    return NextResponse.json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error("Error extracting resume data:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to extract data from resume" 
      },
      { status: 500 }
    );
  }
}
