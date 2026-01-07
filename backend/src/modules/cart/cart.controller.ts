import { Controller, Get, Post, Put, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    async getCart(@Req() req) {
        return this.cartService.getCart(req.user.userId);
    }

    @Post('add')
    async addToCart(@Req() req, @Body() body: { productId: string; quantity: number }) {
        return this.cartService.addToCart(req.user.userId, body.productId, body.quantity);
    }

    @Put('update')
    async updateQuantity(@Req() req, @Body() body: { productId: string; quantity: number }) {
        return this.cartService.updateQuantity(req.user.userId, body.productId, body.quantity);
    }

    @Delete('remove')
    async removeItem(@Req() req, @Body() body: { productId: string }) {
        return this.cartService.removeItem(req.user.userId, body.productId);
    }

    @Delete('clear')
    async clearCart(@Req() req) {
        return this.cartService.clearCart(req.user.userId);
    }
}
