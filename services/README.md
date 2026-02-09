# Services Layer

This directory contains all API service modules for the application.

## Structure

```
services/
├── api.ts                 # Axios instance with interceptors
├── auth.service.ts        # Authentication services
├── profile.service.ts     # Profile management services
└── README.md             # This file
```

## Base API Configuration (`api.ts`)

The base axios instance with:
- Base URL configuration
- Request interceptor (adds auth token)
- Response interceptor (handles 401 errors)
- Default headers

```typescript
import api from "./api";

// Use in services
const response = await api.get("/endpoint");
const response = await api.post("/endpoint", data);
```

## Profile Service (`profile.service.ts`)

### Methods

#### `extractResume(file: File)`
Upload and parse resume file.

```typescript
import { profileService } from "@/services/profile.service";

const result = await profileService.extractResume(file);
if (result.success && result.data) {
  // Use extracted data
  setProfileData(result.data);
} else {
  // Handle error
  console.error(result.error);
}
```

**Returns:**
```typescript
{
  success: boolean;
  data?: ProfileData;
  error?: string;
}
```

#### `saveProfile(profileData: ProfileData)`
Save or update user profile.

```typescript
const result = await profileService.saveProfile(profileData);
if (result.success) {
  console.log(result.message);
} else {
  console.error(result.error);
}
```

**Returns:**
```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

#### `getProfile()`
Fetch user profile data.

```typescript
const result = await profileService.getProfile();
if (result.success && result.data) {
  setProfileData(result.data);
}
```

**Returns:**
```typescript
{
  success: boolean;
  data?: ProfileData;
  error?: string;
}
```

## Auth Service (`auth.service.ts`)

Authentication related services:
- `login(data)` - User login
- `register(data)` - User registration
- `verifyOtp(data)` - OTP verification
- `forgotPassword(data)` - Password reset request
- `resetPassword(data)` - Password reset

## Best Practices

### 1. Centralized API Logic
All API calls should go through service files, not directly in components.

❌ **Bad:**
```typescript
// In component
const response = await fetch("/api/profile");
```

✅ **Good:**
```typescript
// In component
const result = await profileService.getProfile();
```

### 2. Consistent Error Handling
Services return a consistent response format:
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}
```

### 3. Type Safety
All services use TypeScript types for parameters and return values.

### 4. Error Messages
Services provide user-friendly error messages:
- Response errors: Use backend error message
- Request errors: "Unable to connect to the server"
- Other errors: Generic error message

### 5. Axios Interceptors
The base API instance handles:
- Adding auth tokens automatically
- Handling 401 unauthorized errors
- Setting default headers

## Adding New Services

1. Create a new service file (e.g., `user.service.ts`)
2. Import the base api instance
3. Define service methods
4. Export the service object

```typescript
import api from "./api";

export const userService = {
  getUser: async (id: string) => {
    try {
      const response = await api.get(`/users/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch user",
      };
    }
  },
};
```

## Environment Variables

Services use these environment variables:
- `NEXT_PUBLIC_API_URL` - Base API URL (default: https://api.example.com)
- `NEXT_PUBLIC_BACKEND_API_URL` - Backend API URL (default: http://localhost:8000)

**Note:** Use `NEXT_PUBLIC_` prefix for client-side variables in Next.js.

## Testing Services

Services can be easily tested in isolation:

```typescript
import { profileService } from "@/services/profile.service";

// Mock axios
jest.mock("./api");

test("extractResume returns data on success", async () => {
  const mockFile = new File(["content"], "resume.pdf");
  const result = await profileService.extractResume(mockFile);
  
  expect(result.success).toBe(true);
  expect(result.data).toBeDefined();
});
```
