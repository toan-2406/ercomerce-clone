import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    ) { }

    async getCart(userId: string): Promise<CartDocument> {
        let cart = await this.cartModel.findOne({ userId }).populate('items.productId').exec();
        if (!cart) {
            cart = await this.cartModel.create({ userId, items: [] });
        }
        return cart;
    }

    async addToCart(userId: string, productId: string, quantity: number): Promise<CartDocument> {
        let cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            cart = await this.cartModel.create({ userId, items: [{ productId, quantity, selected: true }] });
        } else {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity, selected: true } as any);
            }
            await cart.save();
        }
        return this.getCart(userId);
    }

    async updateQuantity(userId: string, productId: string, quantity: number): Promise<CartDocument> {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart) throw new NotFoundException('Cart not found');

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }
            await cart.save();
        }
        return this.getCart(userId);
    }

    async removeItem(userId: string, productId: string): Promise<CartDocument> {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart) throw new NotFoundException('Cart not found');

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        return this.getCart(userId);
    }

    async clearCart(userId: string): Promise<void> {
        await this.cartModel.deleteOne({ userId });
    }
}
