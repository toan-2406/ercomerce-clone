export const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + '₫';
};

export const calculateMemberPrice = (price: number, rank: string): number => {
    let discount = 0;
    switch (rank) {
        case 'SVIP':
            discount = 0.05; // 5%
            break;
        case 'S-Member':
        default:
            discount = 0.01; // 1%
            break;
    }
    return Math.floor(price * (1 - discount));
};

export const getMemberDiscountText = (rank: string): string => {
    switch (rank) {
        case 'SVIP':
            return '5%';
        case 'S-Member':
        default:
            return '1%';
    }
};
