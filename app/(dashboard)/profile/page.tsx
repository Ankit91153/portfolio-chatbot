"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, AlertCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { profileService } from "@/services/profile.service";
import { useAuthStore, useProfileStore } from "@/stores";
import { FileUploader } from "@/components/profile/FileUploader";
import { AboutMeSection } from "@/components/profile/AboutMeSection";
import { PersonalInfoSection } from "@/components/profile/PersonalInfoSection";
import { EducationSection } from "@/components/profile/EducationSection";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { CertificationSection } from "@/components/profile/CertificationSection";
import { AchievementSection } from "@/components/profile/AchievementSection";
import { ProfileData, ProfilePayload } from "@/types/profile";

// ─── helpers ──────────────────────────────────────────────────────────────────
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const EMPTY_CONTENT: ProfileData = {
  aboutMe: "",
  personalInfo: { fullName: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" },
  educations: [],
  skills: [],
  experience: [],
  certifications: [],
  achievements: [],
};

function getValidationErrors(chatName: string, content: ProfileData): string[] {
  const errors: string[] = [];
  if (!chatName.trim()) errors.push("Chat name is required");
  if (!content.personalInfo.fullName.trim()) errors.push("Full name is required");
  if (!content.personalInfo.email.trim()) errors.push("Email is required");
  if (!content.personalInfo.phone.trim()) errors.push("Phone is required");
  if (!content.personalInfo.location.trim()) errors.push("Location is required");
  return errors;
}

// ─── component ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const {
    chatId: storedChatId,
    chatName: storedChatName,
    chatContent: storedContent,
    setUserProfile,
    updateChatContent,
    updateChatMeta,
    loading: storeLoading,
    setLoading,
    setError,
  } = useProfileStore();

  // Local state — seeded from store on first render
  const [chatId, setChatId] = useState<string>(storedChatId ?? generateUUID());
  const [chatName, setChatName] = useState<string>(storedChatName ?? "");
  const [content, setContent] = useState<ProfileData>(storedContent ?? EMPTY_CONTENT);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyChatId = () => {
    navigator.clipboard.writeText(chatId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!accessToken && !localStorage.getItem("access_token")) {
      toast.error("Please login first");
      router.push("/login");
    }
  }, [accessToken, router]);

  // ── fetch profile on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const token = accessToken || localStorage.getItem("access_token");
    if (!token) return;

    // If we already have persisted data in the store, skip the network call
    if (storedContent) return;

    const fetchProfile = async () => {
      setFetching(true);
      setLoading(true);
      try {
        const res = await profileService.fetchUserProfile();
        if (res.success && res.data) {
          const { full_name, email, profileData } = res.data;

          if (profileData) {
            const { chat_id, chat_name, chat_content } = profileData;

            // Ensure every array item has an id (backend may omit it)
            const normalised: ProfileData = {
              ...chat_content,
              educations: (chat_content.educations ?? []).map((e) => ({
                ...e,
                id: e.id || Date.now().toString() + Math.random(),
              })),
              experience: (chat_content.experience ?? []).map((e) => ({
                ...e,
                id: e.id || Date.now().toString() + Math.random(),
              })),
              certifications: (chat_content.certifications ?? []).map((e) => ({
                ...e,
                id: e.id || Date.now().toString() + Math.random(),
              })),
              achievements: (chat_content.achievements ?? []).map((e) => ({
                ...e,
                id: e.id || Date.now().toString() + Math.random(),
              })),
            };

            // Persist to store
            setUserProfile({ fullName: full_name, email, chatId: chat_id, chatName: chat_name, chatContent: normalised });

            // Hydrate local state
            setChatId(chat_id);
            setChatName(chat_name);
            setContent(normalised);
          }
        }
      } catch {
        setError("Failed to load profile");
      } finally {
        setFetching(false);
        setLoading(false);
      }
    };

    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── resume auto-fill ────────────────────────────────────────────────────────
  const handleDataExtracted = useCallback((extracted: Partial<ProfileData>) => {
    setContent((prev) => {
      const next: ProfileData = {
        ...prev,
        ...extracted,
        educations: extracted.educations ?? prev.educations,
        skills: extracted.skills ?? prev.skills,
        experience: extracted.experience ?? prev.experience,
        certifications: extracted.certifications ?? prev.certifications,
        achievements: extracted.achievements ?? prev.achievements,
      };
      updateChatContent(next);
      return next;
    });
  }, [updateChatContent]);

  // ── keep store in sync when user edits ─────────────────────────────────────
  const handleContentChange = useCallback((patch: Partial<ProfileData>) => {
    setContent((prev) => {
      const next = { ...prev, ...patch };
      updateChatContent(next);
      return next;
    });
  }, [updateChatContent]);

  const handleChatNameChange = (value: string) => {
    setChatName(value);
    updateChatMeta(chatId, value);
  };

  // ── save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const errors = getValidationErrors(chatName, content);
    if (errors.length > 0) {
      toast.error("Please fill required fields", { description: errors.join(" • ") });
      return;
    }

    const payload: ProfilePayload = {
      chat_id: chatId,
      chat_name: chatName.trim(),
      content,
    };

    setSaving(true);
    const loadingToast = toast.loading("Saving Profile…");
    try {
      const result = await profileService.saveProfile(payload);
      toast.success("Profile Saved!", {
        description: result.message ?? "Your profile has been saved successfully.",
        id: loadingToast,
      });
    } catch (error) {
      toast.error("Save Failed", {
        description: error instanceof Error ? error.message : "Failed to save profile",
        id: loadingToast,
      });
    } finally {
      setSaving(false);
    }
  };

  const validationErrors = getValidationErrors(chatName, content);
  const canSave = validationErrors.length === 0 && !saving;

  // ── loading skeleton ────────────────────────────────────────────────────────
  if (fetching || storeLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Profile</h2>
          <p className="text-muted-foreground">Manage your professional information</p>
        </div>
        <Button onClick={handleSave} disabled={!canSave}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving…" : "Save Profile"}
        </Button>
      </div>

      {/* ── Chat Identity ── */}
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold">Chat Identity</h3>
          <p className="text-sm text-muted-foreground">
            Give this profile a name — it will be used as your chat session name.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="chatName">
              Chat Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="chatName"
              placeholder="e.g. My Software Engineer Profile"
              value={chatName}
              onChange={(e) => handleChatNameChange(e.target.value)}
            />
            {!chatName.trim() && (
              <p className="text-xs text-destructive">Chat name is required</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="chatId">Chat ID (auto-generated)</Label>
            <div className="flex gap-2">
              <Input
                id="chatId"
                value={chatId}
                readOnly
                className="font-mono text-xs text-muted-foreground bg-muted flex-1"
              />
              <button
                type="button"
                onClick={handleCopyChatId}
                className="flex items-center gap-1.5 px-3 rounded-md border bg-background text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                title="Copy Chat ID"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500 text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Unique identifier for this chat session</p>
          </div>
        </div>
      </Card>

      {/* ── Validation Banner ── */}
      {validationErrors.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-md border border-destructive/30 bg-destructive/5">
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-destructive">
              Complete the required fields to enable saving
            </p>
            <ul className="mt-1 space-y-0.5">
              {validationErrors.map((e) => (
                <li key={e} className="text-xs text-destructive/80">• {e}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── Resume Uploader ── */}
      <FileUploader onDataExtracted={handleDataExtracted} />

      {/* ── Profile Sections ── */}
      <Card className="p-6">
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <PersonalInfoSection
              data={content.personalInfo}
              onChange={(data) => handleContentChange({ personalInfo: data })}
            />
          </TabsContent>

          <TabsContent value="about">
            <AboutMeSection
              value={content.aboutMe}
              onChange={(value) => handleContentChange({ aboutMe: value })}
            />
          </TabsContent>

          <TabsContent value="education">
            <EducationSection
              data={content.educations}
              onChange={(data) => handleContentChange({ educations: data })}
            />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsSection
              data={content.skills}
              onChange={(data) => handleContentChange({ skills: data })}
            />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceSection
              data={content.experience}
              onChange={(data) => handleContentChange({ experience: data })}
            />
          </TabsContent>

          <TabsContent value="certifications">
            <CertificationSection
              data={content.certifications}
              onChange={(data) => handleContentChange({ certifications: data })}
            />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementSection
              data={content.achievements}
              onChange={(data) => handleContentChange({ achievements: data })}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
