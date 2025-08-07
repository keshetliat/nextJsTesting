import { TokenType } from "@/app/enums/enums";
import { ROUTES } from "@/app/constants/routes";
import { zReviewSchema } from "@/app/types/review-schema";
import { config } from "@/app/config/config";

type ReviewData = zReviewSchema;

export async function addCustomerReview(reviewData: ReviewData, productID: string) {
  const baseUrl = config.apiBaseUrl
  
  // Validate productID
  if (!productID) {
    throw new Error('ProductID is required for adding a review');
  }
  
  // First attempt with current tokens
  const res = await fetch(`${baseUrl}/customer/customerReview/${productID}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
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
        const retryRes = await fetch(`${baseUrl}/customer/customerReview/${productID}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
        });
        
        return await retryRes.json();
      } else {
        // Refresh failed, redirect to login
        window.location.href = ROUTES.SIGNIN;
        return null;
      }
    } catch (error) {
      console.error('Refresh token error:', error);
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
  
  return data;
}


