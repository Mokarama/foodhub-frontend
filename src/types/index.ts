// User Types
export interface User {
    id: string;
    name: string;
    email: string;
    role: "CUSTOMER" | "PROVIDER" | "ADMIN";
    status: string;
}

export interface AuthResponse {
    token: string;
}

// Meal Types
export interface Meal {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    providerId: string;
    categoryId: string;
    provider: {
        id: string;
        name: string;
    };
    category: Category;
    reviews?: Review[];
}

export interface MealCreateInput {
    name: string;
    price: number;
    description: string;
    image: string;
    categoryId: string;
}

// Category Types
export interface Category {
    id: string;
    name: string;
}

// Order Types
export enum OrderStatus {
    PLACED = "PLACED",
    PREPARING = "PREPARING",
    READY = "READY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}

export interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    mealId: string;
    meal: Meal;
}

export interface Order {
    id: string;
    status: OrderStatus;
    address: string;
    totalPrice: number;
    createdAt: string;
    userId: string;
    user?: User;
    items: OrderItem[];
}

export interface OrderCreateInput {
    items: Array<{
        mealId: string;
        quantity: number;
    }>;
    address: string;
}

// Review Types
export interface Review {
    createdAt: number;
    id: string;
    rating: number;
    comment: string;
    userId: string;
    mealId: string;
    user: {
        id: string;
        name: string;
    };
}

export interface ReviewCreateInput {
    mealId: string;
    rating: number;
    comment?: string;
}

// API Response Wrapper
export interface ApiResponse<T> {
    data: T;
    message?: string;
}
