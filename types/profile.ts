export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  percentage?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrentlyWorking: boolean;
}

export interface Certification {
  id: string;
  certificateName: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface ProfileData {
  aboutMe: string;
  personalInfo: PersonalInfo;
  educations: Education[];
  skills: string[];
  experience: Experience[];
  certifications: Certification[];
  achievements: Achievement[];
}

// Backend response types
export interface BackendEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  percentage?: string;
}

export interface BackendExperience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrentlyWorking: boolean;
}

export interface BackendCertification {
  certificateName: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface BackendAchievement {
  title: string;
  date: string;
  description: string;
}

export interface BackendResumeResponse {
  data: {
    aboutMe: string;
    personalInfo: PersonalInfo;
    educations: BackendEducation[];
    skills: string[];
    experience: BackendExperience[];
    certifications: BackendCertification[];
    achievements: BackendAchievement[];
  };
}
