export interface Product {
    _id: string;
    name: string;
    price: number;
    priceString: string;
    url: string;
    images: string[];
    specs: { label: string; value: string }[];
}

export interface Review {
    _id: string;
    userId: string;
    userFullName: string;
    productId: string;
    rating: number;
    comment: string;
    images?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface ShippingAddress {
    fullName: string;
    phoneNumber: string;
    address: string;
    city: string;
}

export interface Order {
    _id: string;
    userId: string;
    items: OrderItem[];
    totalPrice: number;
    shippingAddress: ShippingAddress;
    status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
    paymentMethod: 'cod' | 'banking';
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id?: string;
    _id?: string;
    phoneNumber: string;
    fullName: string;
    rank: string;
    points: number;
    role?: string;
}
