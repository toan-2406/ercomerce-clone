export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    AUTH_USER: 'auth_user',
    CART: 'cart',
};

export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPING: 'shipping',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
} as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    ACCOUNT: '/account',
    ADMIN: '/admin',
    CART: '/cart',
    CHECKOUT: '/checkout',
    NEWS: '/news',
    MY_ORDERS: '/account/orders',
};
