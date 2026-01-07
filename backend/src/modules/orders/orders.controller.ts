import { Controller, Post, Body, Get, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async create(@Req() req, @Body() createOrderDto: any) {
    if (!req.user || !req.user.userId) {
      throw new Error('User not authenticated');
    }
    // Ensure the order is created for the logged-in user
    return this.ordersService.create({
      ...createOrderDto,
      userId: req.user.userId,
    });
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  async findMyOrders(@Req() req) {
    if (!req.user || !req.user.userId) {
      throw new Error('User not authenticated');
    }
    return this.ordersService.findByUserId(req.user.userId);
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN)
  async findByUserId(@Param('userId') userId: string) {
    return this.ordersService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    if (!order) {
      throw new Error('Order not found');
    }

    // Only admin or the owner can view the order
    const userIdStr = order.userId.toString();
    const currentUserIdStr = req.user.userId.toString();

    if (req.user.role !== UserRole.ADMIN && userIdStr !== currentUserIdStr) {
      throw new Error('Unauthorized access to order');
    }
    return order;
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}
