import { IApiBaseResponse } from "@/types/api";
import api from "./api";
import {
  BackendAchievement,
  BackendCertification,
  BackendEducation,
  BackendExperience,
  ProfileData,
  ProfilePayload,
  UserProfileResponse,
} from "@/types/profile";

export const profileService = {
  extractResume: async (file: File): Promise<IApiBaseResponse<ProfileData>> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/resume/parse/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      transformRequest: [(data) => data],
    });

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
      educations: (response.data.data.educations || []).map((edu: BackendEducation) => ({
        id: Date.now().toString() + Math.random(),
        institution: edu.institution || "",
        degree: edu.degree || "",
        fieldOfStudy: edu.fieldOfStudy || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        percentage: edu.percentage || "",
      })),
      skills: response.data.data.skills || [],
      experience: (response.data.data.experience || []).map((exp: BackendExperience) => ({
        id: Date.now().toString() + Math.random(),
        company: exp.company || "",
        position: exp.position || "",
        location: exp.location || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        description: exp.description || "",
        isCurrentlyWorking: exp.isCurrentlyWorking || false,
      })),
      certifications: (response.data.data.certifications || []).map((cert: BackendCertification) => ({
        id: Date.now().toString() + Math.random(),
        certificateName: cert.certificateName || "",
        issuingOrganization: cert.issuingOrganization || "",
        issueDate: cert.issueDate || "",
        expiryDate: cert.expiryDate || "",
        credentialId: cert.credentialId || "",
      })),
      achievements: (response.data.data.achievements || []).map((ach: BackendAchievement) => ({
        id: Date.now().toString() + Math.random(),
        title: ach.title || "",
        date: ach.date || "",
        description: ach.description || "",
      })),
    };

    return { data: transformedData };
  },

  // Fetch user profile from /auth/profile — token injected by axios interceptor
  fetchUserProfile: async (): Promise<IApiBaseResponse<UserProfileResponse>> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  saveProfile: async (payload: ProfilePayload): Promise<IApiBaseResponse> => {
    const response = await api.post("/chat/add", payload);
    return response.data;
  },

  getProfile: async (): Promise<IApiBaseResponse<ProfileData>> => {
    const response = await api.get("/api/profile");
    return response.data;
  },
};
