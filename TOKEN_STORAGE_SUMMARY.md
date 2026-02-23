# 🔐 Token Storage - Quick Reference

## What's Stored

### Login Response
```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "token_type": "bearer"
}
```

### Storage Locations

#### 1. localStorage (3 keys)
```javascript
// Stored via Zustand setTokens()
localStorage.setItem("access_token", "eyJhbGci...")
localStorage.setItem("refresh_token", "eyJhbGci...")

// Stored separately in login
localStorage.setItem("token_type", "bearer")
```

#### 2. Zustand Store (Persisted)
```javascript
{
  accessToken: "eyJhbGci...",
  refreshToken: "eyJhbGci...",
  user: null
}
```

## How It Works

### On Login ✅
```
1. User logs in
2. Backend returns tokens
3. Call setTokens() → stores in Zustand + localStorage
4. Store token_type separately
5. Show success toast
6. Redirect to /profile
```

### Single Source of Truth
```typescript
// ✅ GOOD - One place to store tokens
setTokens(access_token, refresh_token);

// ❌ BAD - Don't do this (duplicate)
localStorage.setItem("access_token", access_token);
setTokens(access_token, refresh_token);
```

### On API Call ✅
```
1. Component makes API call
2. Axios interceptor runs
3. Gets access_token from localStorage
4. Adds: Authorization: Bearer {token}
5. Makes request
```

### On Logout ✅
```
1. User clicks logout
2. logout() function clears:
   - Zustand store
   - localStorage (all tokens)
   - Cookies
3. Redirect to /login
```

### On Page Refresh ✅
```
1. Page reloads
2. Zustand loads from localStorage
3. Tokens still available
4. User stays logged in
```

## Code Snippets

### Login (Storing Tokens) - CLEAN VERSION
```typescript
// app/(auth)/login/page.tsx
const response = await authService.login(values);

// ✅ Single call - stores in both Zustand + localStorage
setTokens(response.data.access_token, response.data.refresh_token);

// Store token_type separately (not in Zustand)
localStorage.setItem("token_type", response.data.token_type);
```

### setTokens Function (Does Both)
```typescript
// stores/authSlice.ts
setTokens: (accessToken, refreshToken) => {
  // 1. Store in Zustand state
  set({ accessToken, refreshToken });
  
  // 2. Also store in localStorage
  if (typeof window !== "undefined") {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
  }
}
```

### API Call (Using Token)
```typescript
// services/api.ts - Automatic!
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Logout (Clearing Tokens)
```typescript
// stores/authSlice.ts
logout: () => {
  // Clear Zustand state
  set({ user: null, accessToken: null, refreshToken: null });
  
  // Clear localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_type");
  }
}
```

## Why This Approach?

### ✅ Benefits
1. **Single Source of Truth** - `setTokens()` handles both storages
2. **No Duplication** - Code is DRY (Don't Repeat Yourself)
3. **Maintainable** - Change storage logic in one place
4. **Consistent** - Always in sync

### Flow Diagram
```
Login Success
    ↓
setTokens(access, refresh)
    ├─→ Zustand State (accessToken, refreshToken)
    └─→ localStorage (access_token, refresh_token)
    ↓
localStorage.setItem("token_type", type)
    ↓
Done! ✅
```

## Quick Check

### Browser DevTools
```
Application → Local Storage → http://localhost:3000
- access_token: eyJhbGci...        (from setTokens)
- refresh_token: eyJhbGci...       (from setTokens)
- token_type: bearer               (from login page)
- auth-storage: {"state":{...}}    (Zustand persistence)
```

### Network Tab
```
Request Headers:
Authorization: Bearer eyJhbGci...
```

## Files Changed

1. ✅ `app/(auth)/login/page.tsx` - Removed duplicate localStorage calls
2. ✅ `stores/authSlice.ts` - setTokens handles both storages
3. ✅ `services/api.ts` - Auto-inject token
4. ✅ `app/(dashboard)/layout.tsx` - Logout clears tokens
5. ✅ `types/authService.ts` - ILogin interface

## Key Points

### ✅ DO
- Use `setTokens()` to store access and refresh tokens
- Let Zustand handle localStorage for tokens
- Store `token_type` separately (not in Zustand)

### ❌ DON'T
- Don't manually call `localStorage.setItem("access_token", ...)` in login
- Don't duplicate storage logic
- Don't store tokens in multiple places manually

## Summary

Your app now:
- ✅ Single function (`setTokens`) stores in both places
- ✅ No duplicate code
- ✅ Clean and maintainable
- ✅ Auto-injects token in API calls
- ✅ Clears tokens on logout
- ✅ Survives page refresh

Done! 🎉 Clean code! 🧹
