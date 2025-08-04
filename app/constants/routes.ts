export const ROUTES = {
  // Customer pages
  CUSTOMER_DEVICES: '/customerdevices',
  WISHLIST: '/wishlist',
  CUSTOMER_DETAILS: '/customerDetails',
  PERSONAL_PAGE: '/content/232',
  SHOPPING_CART: '/shoppingCart',
  
  // Auth pages
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  
  // Other pages
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

// Type for route values
export type RouteType = typeof ROUTES[keyof typeof ROUTES]; 