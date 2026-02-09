# Service Layer Architecture

## Overview

The service layer provides a clean separation between UI components and API calls, following best practices for maintainability and testability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        COMPONENTS                            │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ FileUploader.tsx │  │ ProfilePage.tsx  │                │
│  └────────┬─────────┘  └────────┬─────────┘                │
│           │                      │                           │
└───────────┼──────────────────────┼───────────────────────────┘
            │                      │
            │ import               │ import
            │                      │
┌───────────▼──────────────────────▼───────────────────────────┐
│                      SERVICES LAYER                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           profile.service.ts                           │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  extractResume(file)                             │  │  │
│  │  │  saveProfile(profileData)                        │  │  │
│  │  │  getProfile()                                     │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │ uses                                  │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │                   api.ts                               │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Axios Instance                                   │  │  │
│  │  │  - Base URL                                       │  │  │
│  │  │  - Request Interceptor (add auth token)          │  │  │
│  │  │  - Response Interceptor (handle 401)             │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────┬───────────────────────────────────┘  │
└───────────────────────┼───────────────────────────────────────┘
                        │
                        │ HTTP Request
                        │
┌───────────────────────▼───────────────────────────────────────┐
│                    BACKEND API                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  FastAPI Backend (http://localhost:8000)                 │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │  POST /resume/parse_resume/                        │  │ │
│  │  │  - Receives file                                   │  │ │
│  │  │  - Extracts text (PDF/DOCX)                        │  │ │
│  │  │  - Parses with LLM                                 │  │ │
│  │  │  - Returns structured data                         │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Resume Upload Flow

```
User Action
    ↓
┌───────────────────────────────────────┐
│ FileUploader Component                │
│ - Validates file (type, size)        │
│ - Shows loading state                 │
└───────────┬───────────────────────────┘
            │
            │ profileService.extractResume(file)
            ↓
┌───────────────────────────────────────┐
│ Profile Service                       │
│ - Creates FormData                    │
│ - Calls axios.post()                  │
│ - Handles errors                      │
│ - Transforms response                 │
└───────────┬───────────────────────────┘
            │
            │ axios.post(url, formData, headers)
            ↓
┌───────────────────────────────────────┐
│ Axios Instance (api.ts)               │
│ - Adds auth token                     │
│ - Sets headers                        │
│ - Makes HTTP request                  │
└───────────┬───────────────────────────┘
            │
            │ HTTP POST
            ↓
┌───────────────────────────────────────┐
│ Backend API                           │
│ - Receives file                       │
│ - Validates file                      │
│ - Extracts text                       │
│ - Parses with LLM                     │
│ - Returns JSON                        │
└───────────┬───────────────────────────┘
            │
            │ Response
            ↓
┌───────────────────────────────────────┐
│ Profile Service                       │
│ - Receives response                   │
│ - Adds IDs to arrays                  │
│ - Returns { success, data }           │
└───────────┬───────────────────────────┘
            │
            │ result.data
            ↓
┌───────────────────────────────────────┐
│ FileUploader Component                │
│ - Updates state                       │
│ - Shows success toast                 │
│ - Calls onDataExtracted()             │
└───────────┬───────────────────────────┘
            │
            │ extracted data
            ↓
┌───────────────────────────────────────┐
│ ProfilePage Component                 │
│ - Updates profileData state           │
│ - Auto-fills form fields              │
└───────────────────────────────────────┘
```

### 2. Profile Save Flow

```
User clicks "Save Profile"
    ↓
┌───────────────────────────────────────┐
│ ProfilePage Component                 │
│ - Shows loading toast                 │
│ - Calls profileService.saveProfile()  │
└───────────┬───────────────────────────┘
            │
            │ profileService.saveProfile(data)
            ↓
┌───────────────────────────────────────┐
│ Profile Service                       │
│ - Calls axios.post()                  │
│ - Handles errors                      │
└───────────┬───────────────────────────┘
            │
            │ axios.post(url, data)
            ↓
┌───────────────────────────────────────┐
│ Axios Instance                        │
│ - Adds auth token                     │
│ - Makes HTTP request                  │
└───────────┬───────────────────────────┘
            │
            │ HTTP POST
            ↓
┌───────────────────────────────────────┐
│ Backend API                           │
│ - Validates data                      │
│ - Saves to database                   │
│ - Returns success                     │
└───────────┬───────────────────────────┘
            │
            │ Response
            ↓
┌───────────────────────────────────────┐
│ Profile Service                       │
│ - Returns { success, message }        │
└───────────┬───────────────────────────┘
            │
            │ result
            ↓
┌───────────────────────────────────────┐
│ ProfilePage Component                 │
│ - Shows success toast                 │
│ - Hides loading state                 │
└───────────────────────────────────────┘
```

## Error Handling Flow

```
Error occurs at any level
    ↓
┌───────────────────────────────────────┐
│ Service Layer                         │
│ - Catches error                       │
│ - Determines error type:              │
│   • Response error (4xx, 5xx)         │
│   • Request error (no response)       │
│   • Other error                       │
│ - Extracts error message              │
│ - Returns { success: false, error }   │
└───────────┬───────────────────────────┘
            │
            │ error result
            ↓
┌───────────────────────────────────────┐
│ Component                             │
│ - Receives error                      │
│ - Shows error toast                   │
│ - Shows inline error (if applicable)  │
│ - Resets loading state                │
└───────────────────────────────────────┘
```

## Benefits of This Architecture

### 1. Separation of Concerns
- **Components**: Handle UI and user interactions
- **Services**: Handle API calls and data transformation
- **API Instance**: Handle authentication and interceptors

### 2. Reusability
```typescript
// Use the same service in multiple components
import { profileService } from "@/services/profile.service";

// In FileUploader
const result = await profileService.extractResume(file);

// In ProfilePage
const result = await profileService.saveProfile(data);

// In ProfileSettings
const result = await profileService.getProfile();
```

### 3. Testability
```typescript
// Easy to mock services in tests
jest.mock("@/services/profile.service");

// Test component without making real API calls
test("shows error on upload failure", async () => {
  profileService.extractResume.mockResolvedValue({
    success: false,
    error: "Upload failed"
  });
  // ... test component
});
```

### 4. Maintainability
- Change API endpoint? Update service only
- Change error handling? Update service only
- Add new API call? Add to service
- Components don't need to change

### 5. Type Safety
```typescript
// Service methods have typed parameters and returns
extractResume(file: File): Promise<ExtractResumeResponse>
saveProfile(data: ProfileData): Promise<SaveProfileResponse>
getProfile(): Promise<GetProfileResponse>
```

### 6. Consistent Error Handling
All services return the same format:
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}
```

## Best Practices

### ✅ DO
- Use services for all API calls
- Handle errors in services
- Return consistent response format
- Use TypeScript types
- Add JSDoc comments

### ❌ DON'T
- Make API calls directly in components
- Use different error handling patterns
- Expose axios directly to components
- Ignore error cases
- Skip type definitions

## Example: Adding a New Service Method

```typescript
// services/profile.service.ts

export const profileService = {
  // ... existing methods

  /**
   * Delete user profile
   * @returns Success response
   */
  deleteProfile: async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.delete("/api/profile");
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting profile:", error);
      
      if (error.response) {
        return {
          success: false,
          error: error.response.data?.message || "Failed to delete profile",
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
```

## Summary

This architecture provides:
- ✅ Clean separation of concerns
- ✅ Reusable service methods
- ✅ Consistent error handling
- ✅ Type safety
- ✅ Easy testing
- ✅ Maintainable codebase
- ✅ Scalable structure
