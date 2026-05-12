import { IApiBaseResponse } from "@/types/api";
import api from "./api";
import { ProfileData, BackendResumeResponse } from "@/types/profile";



export const profileService = {
  extractResume: async (file: File): Promise<IApiBaseResponse<ProfileData>> => {
  
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<BackendResumeResponse>(
        `/api/professional-data/parse-resume`,
        formData
      );

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
  },

  saveProfile: async (profileData: ProfileData): Promise<IApiBaseResponse> => {
    const response = await api.post("/api/professional-data", profileData);
    return response.data;
  },

  getProfile: async (): Promise<IApiBaseResponse<{ professionalData: ProfileData, defaultQuestions?: any[] }>> => {
      // The backend /api/users/profile returns { data: { user, professionalData, compressedData, defaultQuestions } }
      const response = await api.get("/api/users/profile");
      return response.data;
  },
};
