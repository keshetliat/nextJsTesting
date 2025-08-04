import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch, faUser, faSearch, faHeart, faShoppingCart, faBars } from '@fortawesome/free-solid-svg-icons';
import { ROUTES } from '../constants/routes';

export const HEADER_LINKS = [
  {
    label: 'עמוד אישי',
    path: ROUTES.PERSONAL_PAGE,
    id: 1,
    icon: () => <FontAwesomeIcon icon={faCouch} className="w-6 h-6" />
  },
  {
    label: 'החשבון שלי',
    path: ROUTES.CUSTOMER_DETAILS,
    id: 2,
    icon: () => <FontAwesomeIcon icon={faUser} className="w-6 h-6" />
  },
  {
    label: 'חיפוש',
    path: ROUTES.CUSTOMER_DETAILS,
    id: 3,
    icon: () => <FontAwesomeIcon icon={faSearch} className="w-6 h-6" />
  },
  {
    label: 'המועדפים שלי',
    path: ROUTES.WISHLIST,
    id: 4,
    icon: () => <FontAwesomeIcon icon={faHeart} className="w-6 h-6" />
  },
  {
    label: 'סל קניות',
    path: ROUTES.SHOPPING_CART,
    id: 5,
    icon: () => <FontAwesomeIcon icon={faShoppingCart} className="w-6 h-6" />
  },
  {
    label: 'תפריט',
    path: ROUTES.CUSTOMER_DETAILS,
    id: 6,
    icon: () => <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
  },
];

export const SIDEBAR_LINKS = [
  {
    label: 'מכשירים',
    path: ROUTES.CUSTOMER_DEVICES,
    icon: 'devices'
  },
  {
    label: 'רשימת משאלות',
    path: ROUTES.WISHLIST,
    icon: 'heart'
  },
  {
    label: 'הגדרות',
    path: '/settings',
    icon: 'settings'
  },
];

export const FOOTER_LINKS = [
  {
    label: 'אודות',
    path: ROUTES.ABOUT,
  },
  {
    label: 'צור קשר',
    path: ROUTES.CONTACT,
  },
  {
    label: 'תנאי שימוש',
    path: '/terms',
  },
]; 