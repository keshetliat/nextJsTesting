import { authManager } from '@/app/utils/auth';

interface RegisterUserProps {
  UserName: string;
  Password: string;
}

interface LoginUserProps {
  UserName: string;
  Password: string;
}

export async function registerUserService(userData: RegisterUserProps) {
  const res =  await fetch('/api/user/RegisterUser', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function loginUserService(userData: LoginUserProps) {
  const res = await fetch('/api/user/LoginUser', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return res.json();
}

// Additional service functions using apiClient for authenticated requests
// export async function getUserProfile() {
//   try {
//     const response = await apiClient.fetch('/user/profile');
//     if (!response) return null;

//     return await response.json();
//   } catch (error) {
//     console.error("Get Profile Error:", error);
//     return null;
//   }
// }

// export async function getDashboardData() {
//   try {
//     const response = await apiClient.fetch('/user/dashboard');
//     if (!response) return null;

//     return await response.json();
//   } catch (error) {
//     console.error("Get Dashboard Data Error:", error);
//     return null;
//   }
// }

// Logout service
export async function logoutUserService() {
  return await authManager.logout();
}