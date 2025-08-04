'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import { TokenType } from '@/app/enums/enums';
import { ROUTES } from '@/app/constants/routes';

// Types
interface LoginUserProps {
  UserName: string;
  Password: string;
}

// API client that automatically includes cookies
export const apiClient = {
  fetch: async (url: string, options: RequestInit = {}) => {
    const defaultOptions = {
      credentials: 'include' as RequestCredentials, // Always include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    // Handle authentication errors
    if (response.status === 401) {
      // Token expired or invalid, redirect to login
      window.location.href = ROUTES.SIGNIN;
      return null;
    }
    
    return response;
  },
};

// Enhanced API client with automatic token refresh
export const apiClientWithRefresh = {
  fetch: async (url: string, options: RequestInit = {}) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9090';
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    
    const defaultOptions = {
      credentials: 'include' as RequestCredentials,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // First attempt
    let response = await fetch(fullUrl, { ...defaultOptions, ...options });
    let data = await response.json();
    
    // Check if access token is expired
    if (data.tokenType === TokenType.AccessTokenNotValid) {
      try {
        // Try to refresh token
        const refreshResponse = await fetch(`${baseUrl}/user/RefreshLogin`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success || refreshData.message === "SuccessLogin") {
          // Retry original request with new token
          response = await fetch(fullUrl, { ...defaultOptions, ...options });
          data = await response.json();
        } else {
          // Refresh failed, redirect to login
          window.location.href = ROUTES.SIGNIN;
          return null;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        window.location.href = ROUTES.SIGNIN;
        return null;
      }
    }
    
    // Handle other token errors
    if (data.tokenType === TokenType.RefreshTokenNotValid || 
        data.tokenType === TokenType.GeneralTokenError) {
      console.log('Token error:', data.error);
      window.location.href = ROUTES.SIGNIN;
      return null;
    }
    
    return { response, data };
  },
};

// Check if JWT token is expired (client-side)
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}

// Enhanced auth manager with token validation
export const authManager = {
  // Check if user is authenticated by making a request to a protected endpoint
  isAuthenticated: async () => {
    try {
      const response = await apiClient.fetch('/user/verify-token');
      return response?.ok || false;
    } catch (error) {
      return false;
    }
  },

  // Login user
  login: async (userData: LoginUserProps) => {
    const response = await fetch('/user/LoginUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include', // Store cookies from response
    });

    return await response.json();
  },

  // Logout user by clearing cookies on server
  logout: async () => {
    try {
      await apiClient.fetch('/user/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always redirect to login after logout attempt
      window.location.href = ROUTES.SIGNIN;
    }
  },

  // Refresh token (if you implement refresh logic)
  refreshToken: async () => {
    try {
      const response = await apiClient.fetch('/user/refresh-token', {
        method: 'POST',
      });
      return response?.ok || false;
    } catch (error) {
      return false;
    }
  },

  // Check token expiration and redirect if needed
  checkTokenExpiration: () => {
    if (typeof window === 'undefined') return; // Server-side, skip
    
    // Get token from cookie (if accessible)
    const cookies = document.cookie.split(';');
    const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));
    
    if (jwtCookie) {
      const token = jwtCookie.split('=')[1];
      if (isTokenExpired(token)) {
        // Token is expired, redirect to login
        window.location.href = ROUTES.SIGNIN;
      }
    }
  },
};

// Route protection hook for Next.js
export const useAuthGuard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await authManager.isAuthenticated();
      setIsAuthenticated(authStatus);
      setLoading(false);
    };

    checkAuth();
  }, []);

  return { isAuthenticated, loading };
};

// Server-side: Check if JWT cookie exists (for middleware, server actions, etc.)
export function hasJwtCookie(cookies: { get: (name: string) => { value?: string } | undefined }): boolean {
  return !!cookies.get('jwt')?.value;
}

// Client-side: Redirect helper (optional, for use in useEffect after login/logout)
export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = ROUTES.SIGNIN;
  }
};

// Logout service
export async function logoutUserService() {
  return await authManager.logout();
}