// Frontend Validation Utils

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 6) {
        errors.push("Password must be at least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number");
    }

    return errors;
};

export const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
};

export const validatePrice = (price: any): boolean => {
    const num = parseFloat(price);
    return !isNaN(num) && num > 0;
};

export const validateRating = (rating: any): boolean => {
    const num = parseInt(rating);
    return num >= 1 && num <= 5;
};

export const validateQuantity = (quantity: any): boolean => {
    const num = parseInt(quantity);
    return !isNaN(num) && num > 0;
};

export const validateAddress = (address: string): boolean => {
    return address.trim().length >= 5;
};
