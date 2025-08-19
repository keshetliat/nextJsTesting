export const config = {
  imageBaseUrl: "https://qa-images-evrit.yit.co.il/",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9090',
} as const; 