'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
      window.location.href = '/signin';
      return null;
    }
    
    return response;
  },
};

// Auth management utilities
export const authManager = {
  // Check if user is authenticated by making a request to a protected endpoint
  isAuthenticated: async (): Promise<boolean> => {
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
      window.location.href = '/signin';
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
};

// Route protection hook for Next.js
export const useAuthGuard = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authManager.isAuthenticated();
      if (!isAuth) {
        router.push('/signin');
      }
    };

    checkAuth();
  }, [router]);
};

// HOC for protecting pages
export const withAuth = (WrappedComponent: React.ComponentType) => {
  return function ProtectedRoute(props: any) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const isAuth = await authManager.isAuthenticated();
        if (!isAuth) {
          router.push('/signin');
        } else {
          setIsAuthenticated(true);
        }
      };

      checkAuth();
    }, [router]);

    // Show loading or nothing while checking authentication
    if (isAuthenticated === null) {
      return <div>Loading...</div>; // Or your loading component
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

// Legacy service function for compatibility (you can remove this if not used elsewhere)
export async function loginUserService(userData: LoginUserProps) {
  return authManager.login(userData);
}

// Utilities for cookie-based JWT authentication (no localStorage, no token in JS)

// Server-side: Check if JWT cookie exists (for middleware, server actions, etc.)
export function hasJwtCookie(cookies: { get: (name: string) => { value?: string } | undefined }): boolean {
  return !!cookies.get('jwt')?.value;
}

// Client-side: Redirect helper (optional, for use in useEffect after login/logout)
export function redirectTo(path: string) {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
}

// Note: All authentication is handled via HttpOnly cookies set by the backend.
// No JWT is ever stored or read in JS. All fetches should use credentials: 'include'.