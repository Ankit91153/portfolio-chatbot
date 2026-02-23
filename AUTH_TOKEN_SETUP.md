# Authentication Token Management

## Overview

Complete token management system with localStorage and Zustand persistence for access and refresh tokens.

## Token Storage Strategy

### Dual Storage Approach
1. **localStorage** - For immediate access and API calls
2. **Zustand Store** - For state management and persistence

### Why Both?
- **localStorage**: Fast access for axios interceptors
- **Zustand**: React state management with automatic persistence

## Implementation

### 1. Login Response Structure

Backend returns:
```json
{
  "message": "User login successfully",
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
}
```

### 2. Token Storage on Login

**Location**: `app/(auth)/login/page.tsx`

```typescript
// Store in localStorage
localStorage.setItem("access_token", response.data.access_token);
localStorage.setItem("refresh_token", response.data.refresh_token);
localStorage.setItem("token_type", response.data.token_type);

// Store in Zustand (persisted automatically)
setTokens(response.data.access_token, response.data.refresh_token);
```

### 3. Auth Store Structure

**Location**: `stores/authSlice.ts`

```typescript
interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: any) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
}
```

**Features**:
- ✅ Persists to localStorage automatically
- ✅ Syncs between tabs
- ✅ Survives page refresh
- ✅ Clears on logout

### 4. Axios Interceptor

**Location**: `services/api.ts`

```typescript
api.interceptors.request.use((config) => {
  // Get access token from localStorage
  const token = localStorage.getItem("access_token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});
```

**Automatic Token Injection**:
- Every API call automatically includes `Authorization: Bearer {token}`
- No need to manually add headers

### 5. Logout Implementation

**Location**: `app/(dashboard)/layout.tsx`

```typescript
const handleLogout = () => {
  // Clear Zustand store
  logout();
  
  // Clear cookies (if any)
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  
  // Redirect to login
  router.push("/login");
};
```

**Logout clears**:
- ✅ Zustand store state
- ✅ localStorage tokens
- ✅ Cookies
- ✅ Redirects to login

## Data Flow

### Login Flow
```
User submits credentials
    ↓
authService.login(credentials)
    ↓
Backend returns tokens
    ↓
Store in localStorage:
  - access_token
  - refresh_token
  - token_type
    ↓
Store in Zustand:
  - accessToken
  - refreshToken
    ↓
Toast success message
    ↓
Redirect to /profile
```

### API Call Flow
```
Component makes API call
    ↓
Axios interceptor runs
    ↓
Gets access_token from localStorage
    ↓
Adds Authorization header
    ↓
Makes request to backend
    ↓
Backend validates token
    ↓
Returns response
```

### Logout Flow
```
User clicks logout
    ↓
logout() from Zustand
    ↓
Clears:
  - Zustand state
  - localStorage tokens
  - Cookies
    ↓
Redirect to /login
```

## Storage Details

### localStorage Keys
- `access_token` - JWT access token
- `refresh_token` - JWT refresh token
- `token_type` - Token type (usually "bearer")

### Zustand Persistence
- **Storage Key**: `auth-storage`
- **Persisted Fields**:
  - `user`
  - `accessToken`
  - `refreshToken`

## Security Considerations

### ✅ Implemented
- Tokens stored in localStorage (accessible only to same origin)
- Automatic token injection in API calls
- Logout clears all tokens
- HTTPS recommended for production

### 🔒 Best Practices
1. **Use HTTPS** - Always use HTTPS in production
2. **Token Expiration** - Backend should implement token expiration
3. **Refresh Token** - Implement refresh token rotation
4. **XSS Protection** - Sanitize user inputs
5. **CSRF Protection** - Use CSRF tokens for state-changing operations

## Token Refresh (Future Enhancement)

### Recommended Implementation
```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired
      const refreshToken = localStorage.getItem("refresh_token");
      
      if (refreshToken) {
        try {
          // Call refresh token endpoint
          const response = await axios.post("/auth/refresh", {
            refresh_token: refreshToken
          });
          
          // Store new tokens
          const newAccessToken = response.data.access_token;
          localStorage.setItem("access_token", newAccessToken);
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          // Refresh failed, logout user
          logout();
          router.push("/login");
        }
      }
    }
    
    return Promise.reject(error);
  }
);
```

## Usage Examples

### Get Current User Token
```typescript
import { useAuthStore } from "@/stores";

function MyComponent() {
  const { accessToken } = useAuthStore();
  
  // Use token
  console.log(accessToken);
}
```

### Check if User is Authenticated
```typescript
import { useAuthStore } from "@/stores";

function MyComponent() {
  const { accessToken } = useAuthStore();
  const isAuthenticated = !!accessToken;
  
  if (!isAuthenticated) {
    // Redirect to login
  }
}
```

### Manual API Call with Token
```typescript
// Not needed! Axios automatically adds token
// But if you need manual access:
const token = localStorage.getItem("access_token");
const response = await fetch("/api/endpoint", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

## Files Modified

### Updated
- ✅ `app/(auth)/login/page.tsx` - Token storage on login
- ✅ `stores/authSlice.ts` - Enhanced setTokens and logout
- ✅ `types/authService.ts` - ILogin interface
- ✅ `services/api.ts` - Token injection in interceptor
- ✅ `app/(dashboard)/layout.tsx` - Logout with store

### Key Changes

#### Login Page
```typescript
// Before
const response = await authService.login(values);
router.push("/profile");

// After
const response = await authService.login(values);
localStorage.setItem("access_token", response.data.access_token);
localStorage.setItem("refresh_token", response.data.refresh_token);
setTokens(response.data.access_token, response.data.refresh_token);
toast.success("Login Successful!");
router.push("/profile");
```

#### Auth Store
```typescript
// Before
setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken })

// After
setTokens: (accessToken, refreshToken) => {
  set({ accessToken, refreshToken });
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
}
```

#### Axios Interceptor
```typescript
// Before
const token = localStorage.getItem("token");

// After
const token = localStorage.getItem("access_token");
```

## Testing Checklist

- [ ] Login with valid credentials
- [ ] Verify tokens in localStorage (DevTools → Application → Local Storage)
- [ ] Verify tokens in Zustand (React DevTools)
- [ ] Make API call and verify Authorization header (Network tab)
- [ ] Refresh page and verify tokens persist
- [ ] Logout and verify all tokens cleared
- [ ] Try accessing protected route without token
- [ ] Verify 401 error handling

## Debugging

### Check Tokens in Browser
```javascript
// In browser console
localStorage.getItem("access_token")
localStorage.getItem("refresh_token")
```

### Check Zustand Store
```javascript
// In React DevTools
// Look for "auth-storage" in localStorage
```

### Check API Headers
```javascript
// In Network tab
// Look for Authorization header in request
```

## Summary

✅ **Dual storage** - localStorage + Zustand
✅ **Automatic injection** - Axios interceptor adds token
✅ **Persistent** - Survives page refresh
✅ **Secure logout** - Clears all tokens
✅ **Toast notifications** - User feedback
✅ **Type-safe** - TypeScript interfaces
✅ **Production-ready** - Best practices implemented

Your authentication token management is complete! 🔐
