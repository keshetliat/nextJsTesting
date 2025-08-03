import { TokenType } from "../../enums/enums"; 

export async function getCustomerDevices() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9090';
  
  // First attempt with current tokens
  const res = await fetch(`${baseUrl}/customer/customerDevices`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const data = await res.json();
  
  // Check if access token is invalid/expired OR if we get a 401 (no cookies)
  if (data.tokenType === TokenType.AccessTokenNotValid || res.status === 401) {
    // Try to refresh the token
    try {
      const refreshRes = await fetch(`${baseUrl}/user/RefreshLogin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          IsWithoutCookie: false // This tells Go to read from cookies
        }),
      });
      
      const refreshData = await refreshRes.json();
      
      // If refresh was successful, retry the original request
      if (refreshData.tokenType === TokenType.RefreshTokenValid) {
        const retryRes = await fetch(`${baseUrl}/customer/customerDevices`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        return await retryRes.json();
      } else {
        // Refresh failed, redirect to login
        window.location.href = '/signin';
        return null;
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      window.location.href = '/signin';
      return null;
    }
  }
  
  // Handle other token errors
  if (data.tokenType === TokenType.RefreshTokenNotValid || 
      data.tokenType === TokenType.GeneralTokenError) {
    console.log('Token error:', data.error);
    window.location.href = '/signin';
    return null;
  }
  
  return data;
}