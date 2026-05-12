"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { profileService } from "@/services/profile.service";
import { useAuthStore } from "@/stores";
import { FileUploader } from "@/components/profile/FileUploader";
import { AboutMeSection } from "@/components/profile/AboutMeSection";
import { PersonalInfoSection } from "@/components/profile/PersonalInfoSection";
import { EducationSection } from "@/components/profile/EducationSection";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { CertificationSection } from "@/components/profile/CertificationSection";
import { AchievementSection } from "@/components/profile/AchievementSection";
import { DefaultQuestionsSection } from "@/components/profile/DefaultQuestionsSection";
import { ProfileData } from "@/types/profile";

export default function ProfilePage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  // Protect route - redirect if not logged in
  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, [accessToken, router]);
  const [profileData, setProfileData] = useState<ProfileData>({
    aboutMe: "",
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    educations: [],
    skills: [],
    experience: [],
    certifications: [],
    achievements: [],
    defaultQuestions: [],
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await profileService.getProfile();
        if (result.success && result.data?.professionalData) {
          const loadedData = result.data.professionalData;
          setProfileData({
            aboutMe: loadedData.aboutMe || "",
            personalInfo: loadedData.personalInfo || {
              fullName: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "",
            },
            educations: loadedData.educations || [],
            skills: loadedData.skills || [],
            experience: loadedData.experience || [],
            certifications: loadedData.certifications || [],
            achievements: loadedData.achievements || [],
            defaultQuestions: result.data.defaultQuestions || loadedData.defaultQuestions || [],
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }

    if (accessToken) {
      loadProfile();
    }
  }, [accessToken]);

  const [saving, setSaving] = useState(false);

  const handleDataExtracted = (extractedData: Partial<ProfileData>) => {
    console.log(extractedData);
    setProfileData((prev) => ({
      ...prev,
      ...extractedData,
      // Merge arrays instead of replacing
      educations: extractedData.educations || prev.educations,
      skills: extractedData.skills || prev.skills,
      experience: extractedData.experience || prev.experience,
      certifications: extractedData.certifications || prev.certifications,
      achievements: extractedData.achievements || prev.achievements,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const loadingToast = toast.loading("Saving Profile", {
      description: "Please wait while we save your profile...",
    });

    try {
      const result = await profileService.saveProfile(profileData);

      if (!result.success) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : Array.isArray(result.error)
              ? result.error.join(", ")
              : "Failed to save profile",
        );
      }

      toast.success("Profile Saved!", {
        description:
          result.message || "Your profile has been saved successfully.",
        id: loadingToast,
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save profile";

      toast.error("Save Failed", {
        description: errorMessage,
        id: loadingToast,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">My Profile</h2>
            <p className="text-muted-foreground mt-1">
              Manage your professional information to power your AI chatbot
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg" className="shadow-md hover:shadow-lg transition-all w-full md:w-auto">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>

      <FileUploader onDataExtracted={handleDataExtracted} />

      <Card className="p-6 md:p-8 border-t-4 border-t-primary shadow-lg rounded-xl overflow-hidden">
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="flex flex-wrap w-full justify-start h-auto p-1.5 bg-muted/60 rounded-xl gap-1.5 mb-6">
            <TabsTrigger value="about" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md py-2.5 px-4 font-medium transition-all">About</TabsTrigger>
            <TabsTrigger value="personal" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md py-2.5 px-4 font-medium transition-all">Personal</TabsTrigger>
            <TabsTrigger value="education" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md py-2.5 px-4 font-medium transition-all">Education</TabsTrigger>
            <TabsTrigger value="skills" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md py-2.5 px-4 font-medium transition-all">Skills</TabsTrigger>
            <TabsTrigger value="experience" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md py-2.5 px-4 font-medium transition-all">Experience</TabsTrigger>
            <TabsTrigger value="certifications" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md py-2.5 px-4 font-medium transition-all">Certifications</TabsTrigger>
            <TabsTrigger value="achievements" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md py-2.5 px-4 font-medium transition-all">Achievements</TabsTrigger>
            <TabsTrigger value="questions" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md py-2.5 px-4 font-medium transition-all">Q&A</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <AboutMeSection
              value={profileData.aboutMe}
              onChange={(value) =>
                setProfileData((prev) => ({ ...prev, aboutMe: value }))
              }
            />
          </TabsContent>

          <TabsContent value="personal" className="space-y-4">
            <PersonalInfoSection
              data={profileData.personalInfo}
              onChange={(data) =>
                setProfileData((prev) => ({ ...prev, personalInfo: data }))
              }
            />
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <EducationSection
              data={profileData.educations}
              onChange={(data) =>
                setProfileData((prev) => ({ ...prev, educations: data }))
              }
            />
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <SkillsSection
              data={profileData.skills}
              onChange={(data) =>
                setProfileData((prev) => ({ ...prev, skills: data }))
              }
            />
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <ExperienceSection
              data={profileData.experience}
              onChange={(data) =>
                setProfileData((prev) => ({ ...prev, experience: data }))
              }
            />
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <CertificationSection
              data={profileData.certifications}
              onChange={(data) =>
                setProfileData((prev) => ({ ...prev, certifications: data }))
              }
            />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <AchievementSection
              data={profileData.achievements}
              onChange={(data) =>
                setProfileData((prev) => ({ ...prev, achievements: data }))
              }
            />
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <DefaultQuestionsSection
              data={profileData.defaultQuestions || []}
              onChange={(data) =>
                setProfileData((prev) => ({ ...prev, defaultQuestions: data }))
              }
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
