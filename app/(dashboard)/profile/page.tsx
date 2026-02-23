"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
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
import { ProfileData } from "@/types/profile";

export default function ProfilePage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  // Protect route - redirect if not logged in
  useEffect(() => {
    if (
      !accessToken &&
      !(typeof window !== "undefined" && localStorage.getItem("access_token"))
    ) {
      toast.error("Please login first");
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
  });

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Profile</h2>
          <p className="text-muted-foreground">
            Manage your professional information
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>

      <FileUploader onDataExtracted={handleDataExtracted} />

      <Card className="p-6">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
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
        </Tabs>
      </Card>
    </div>
  );
}
