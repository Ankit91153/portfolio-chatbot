# Profile Page - Backend Integration Guide

## Overview

The profile page is fully integrated with your FastAPI backend using Axios for all API calls. All API logic is centralized in the services folder following best practices.

## Features Implemented

### 1. File Upload & Auto-Fill
- ✅ Upload resume (PDF, DOC, DOCX)
- ✅ File validation (type and size)
- ✅ Real-time error messages
- ✅ Loading states with progress indication
- ✅ Toast notifications for success/error
- ✅ Auto-fill form fields from extracted data
- ✅ Axios-based API calls

### 2. Manual Form Sections
- ✅ About Me
- ✅ Personal Information
- ✅ Education (dynamic entries)
- ✅ Skills (tag-based)
- ✅ Experience (with "currently working" support)
- ✅ Certifications
- ✅ Achievements

## Architecture

### Service Layer
All API calls are centralized in `services/profile.service.ts`:
- `extractResume(file)` - Upload and parse resume
- `saveProfile(profileData)` - Save profile data
- `getProfile()` - Fetch profile data

### Benefits
- ✅ Centralized API logic
- ✅ Consistent error handling
- ✅ Easy to test and maintain
- ✅ Reusable across components
- ✅ Type-safe with TypeScript

## File Structure

```
services/
├── api.ts                        # Axios instance with interceptors
├── auth.service.ts               # Authentication services
└── profile.service.ts            # Profile services (NEW)
    ├── extractResume()           # Resume parsing
    ├── saveProfile()             # Save profile
    └── getProfile()              # Fetch profile

components/
└── profile/
    ├── FileUploader.tsx          # Uses profileService.extractResume()
    └── ...other components

app/
└── (dashboard)/
    └── profile/
        └── page.tsx              # Uses profileService.saveProfile()
```

## Backend Integration

### API Endpoint
```
POST http://localhost:8000/resume/parse_resume/
```

### Request Format
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Field Name**: `file`
- **Accepted Types**: PDF, DOC, DOCX
- **Max Size**: 10MB

### Response Format
The backend returns data in this structure:
```json
{
  "aboutMe": "string",
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "portfolio": "string"
  },
  "educations": [{
    "institution": "string",
    "degree": "string",
    "fieldOfStudy": "string",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM",
    "percentage": "string"
  }],
  "skills": ["string"],
  "experience": [{
    "company": "string",
    "position": "string",
    "location": "string",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM",
    "description": "string",
    "isCurrentlyWorking": boolean
  }],
  "certifications": [{
    "certificateName": "string",
    "issuingOrganization": "string",
    "issueDate": "YYYY-MM",
    "expiryDate": "YYYY-MM",
    "credentialId": "string"
  }],
  "achievements": [{
    "title": "string",
    "date": "YYYY-MM",
    "description": "string"
  }]
}
```

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
```

**Important**: Use `NEXT_PUBLIC_` prefix for client-side environment variables in Next.js.

### 2. Start Backend Server
Make sure your FastAPI backend is running on port 8000:
```bash
# In your backend directory
uvicorn main:app --reload --port 8000
```

### 3. Start Frontend
```bash
npm run dev
```

### 4. Test the Integration
1. Navigate to `/profile`
2. Click "Choose File" and upload a resume
3. Watch the loading state and toast notifications
4. See the form auto-fill with extracted data

## Using the Profile Service

### In Components

```typescript
import { profileService } from "@/services/profile.service";

// Extract resume
const result = await profileService.extractResume(file);
if (result.success && result.data) {
  // Use the extracted data
  console.log(result.data);
} else {
  // Handle error
  console.error(result.error);
}

// Save profile
const saveResult = await profileService.saveProfile(profileData);
if (saveResult.success) {
  console.log(saveResult.message);
} else {
  console.error(saveResult.error);
}

// Get profile
const getResult = await profileService.getProfile();
if (getResult.success && getResult.data) {
  console.log(getResult.data);
}
```

## Error Handling

### Client-Side Validation
- **File Type**: Only PDF, DOC, DOCX allowed
- **File Size**: Maximum 10MB
- **Error Display**: Toast notification + inline error message

### Service Layer Error Handling
The service handles three types of errors:
1. **Response Errors** (4xx, 5xx): Backend returned an error
2. **Request Errors**: No response received (backend down)
3. **Other Errors**: Unexpected errors

### User Feedback
- **Loading**: "Processing Resume - Extracting information from your resume..."
- **Success**: "Resume Processed Successfully! - Your information has been extracted and filled in the form."
- **Error**: "Processing Failed - [specific error message]"

## Axios Configuration

The service uses the centralized axios instance from `services/api.ts`:
- ✅ Automatic auth token injection
- ✅ Request/response interceptors
- ✅ Consistent error handling
- ✅ Base URL configuration

### Custom Headers for File Upload
```typescript
api.post(url, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
```

## Data Flow

1. **User uploads resume** → FileUploader component
2. **Client validation** → Check file type and size
3. **Service call** → `profileService.extractResume(file)`
4. **Axios request** → POST to backend with FormData
5. **Backend processing** → Parse resume with LLM
6. **Data transformation** → Add IDs to array items
7. **State update** → Auto-fill form fields
8. **User notification** → Toast message

## Testing Checklist

- [ ] Upload valid PDF resume
- [ ] Upload valid DOC/DOCX resume
- [ ] Try uploading invalid file type (should show error)
- [ ] Try uploading file > 10MB (should show error)
- [ ] Verify loading state appears
- [ ] Verify success toast appears
- [ ] Verify form fields are auto-filled
- [ ] Manually edit form fields
- [ ] Save profile
- [ ] Verify save success toast
- [ ] Test with backend offline (should show connection error)

## Troubleshooting

### Backend Not Responding
- Check if backend is running: `curl http://localhost:8000/docs`
- Verify `NEXT_PUBLIC_BACKEND_API_URL` in `.env.local`
- Check CORS settings in FastAPI
- Error message: "Unable to connect to the server. Please check if the backend is running."

### File Upload Fails
- Check file size (< 10MB)
- Check file type (PDF, DOC, DOCX)
- Check browser console for errors
- Verify backend logs
- Check network tab in DevTools

### Data Not Auto-Filling
- Check browser console for errors
- Verify backend response format matches types
- Check data transformation in `profile.service.ts`
- Verify state update in profile page

### Axios Errors
- Check network tab for request details
- Verify axios interceptors in `services/api.ts`
- Check auth token if required
- Verify Content-Type headers

## Next Steps

1. ✅ Implement resume extraction with axios
2. ✅ Centralize API calls in service layer
3. ✅ Add proper error handling
4. ⏳ Implement profile save to database
5. ⏳ Add profile data fetching on page load
6. ⏳ Add form validation before save
7. ⏳ Add authentication token to API calls
8. ⏳ Add profile image upload
9. ⏳ Add data export functionality

## API Service Methods

### `extractResume(file: File)`
Uploads resume and extracts data.

**Parameters:**
- `file`: Resume file (PDF, DOC, DOCX)

**Returns:**
```typescript
{
  success: boolean;
  data?: ProfileData;
  error?: string;
}
```

### `saveProfile(profileData: ProfileData)`
Saves or updates user profile.

**Parameters:**
- `profileData`: Complete profile data

**Returns:**
```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

### `getProfile()`
Fetches user profile data.

**Returns:**
```typescript
{
  success: boolean;
  data?: ProfileData;
  error?: string;
}
```
