import api from "./api";
import { ProfileData, BackendResumeResponse } from "@/types/profile";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";

export interface ExtractResumeResponse {
  success: boolean;
  data?: ProfileData;
  error?: string;
}

export interface SaveProfileResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const profileService = {
  /**
   * Extract data from uploaded resume file
   * @param file - Resume file (PDF, DOC, DOCX)
   * @returns Extracted profile data
   */
  extractResume: async (file: File): Promise<ExtractResumeResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<BackendResumeResponse>(
        `${BACKEND_API_URL}/resume/parse_resume/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data,"jdbjkdbjdb")

      // Transform backend response to frontend format (add IDs)
      const transformedData: ProfileData = {
        aboutMe: response.data.data.aboutMe || "",
        personalInfo: response.data.data.personalInfo || {
          fullName: "",
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
          portfolio: "",
        },
        educations: (response.data.data.educations || []).map((edu) => ({
          id: Date.now().toString() + Math.random(),
          institution: edu.institution || "",
          degree: edu.degree || "",
          fieldOfStudy: edu.fieldOfStudy || "",
          startDate: edu.startDate || "",
          endDate: edu.endDate || "",
          percentage: edu.percentage || "",
        })),
        skills: response.data.data.skills || [],
        experience: (response.data.data.experience || []).map((exp) => ({
          id: Date.now().toString() + Math.random(),
          company: exp.company || "",
          position: exp.position || "",
          location: exp.location || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          description: exp.description || "",
          isCurrentlyWorking: exp.isCurrentlyWorking || false,
        })),
        certifications: (response.data.data.certifications || []).map((cert) => ({
          id: Date.now().toString() + Math.random(),
          certificateName: cert.certificateName || "",
          issuingOrganization: cert.issuingOrganization || "",
          issueDate: cert.issueDate || "",
          expiryDate: cert.expiryDate || "",
          credentialId: cert.credentialId || "",
        })),
        achievements: (response.data.data.achievements || []).map((ach) => ({
          id: Date.now().toString() + Math.random(),
          title: ach.title || "",
          date: ach.date || "",
          description: ach.description || "",
        })),
      };

      return {
        success: true,
        data: transformedData,
      };
    } catch (error: any) {
      console.error("Error extracting resume:", error);
      
      // Handle axios error
      if (error.response) {
        // Backend returned an error response
        const errorMessage = error.response.data?.detail || error.response.data?.error || "Failed to process resume";
        return {
          success: false,
          error: errorMessage,
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          error: "Unable to connect to the server. Please check if the backend is running.",
        };
      } else {
        // Something else happened
        return {
          success: false,
          error: error.message || "An unexpected error occurred",
        };
      }
    }
  },

  /**
   * Save or update user profile
   * @param profileData - Complete profile data
   * @returns Success response
   */
  saveProfile: async (profileData: ProfileData): Promise<SaveProfileResponse> => {
    try {
      // TODO: Replace with your actual backend endpoint
      const response = await api.post("/api/profile", profileData);

      return {
        success: true,
        message: response.data.message || "Profile saved successfully",
      };
    } catch (error: any) {
      console.error("Error saving profile:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.detail || error.response.data?.error || "Failed to save profile";
        return {
          success: false,
          error: errorMessage,
        };
      } else if (error.request) {
        return {
          success: false,
          error: "Unable to connect to the server",
        };
      } else {
        return {
          success: false,
          error: error.message || "An unexpected error occurred",
        };
      }
    }
  },

  /**
   * Fetch user profile data
   * @returns User profile data
   */
  getProfile: async (): Promise<{ success: boolean; data?: ProfileData; error?: string }> => {
    try {
      // TODO: Replace with your actual backend endpoint
      const response = await api.get<ProfileData>("/api/profile");

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.detail || error.response.data?.error || "Failed to fetch profile";
        return {
          success: false,
          error: errorMessage,
        };
      } else if (error.request) {
        return {
          success: false,
          error: "Unable to connect to the server",
        };
      } else {
        return {
          success: false,
          error: error.message || "An unexpected error occurred",
        };
      }
    }
  },
};
