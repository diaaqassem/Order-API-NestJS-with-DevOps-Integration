import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { IsAdmin } from 'src/common/guards/isadmin.guard';
import { isAdmin } from 'src/common/decorators/isadmin.decorator';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createOrder(
    @Body() createOrderDto,
    @Req()
    request: Request,
  ) {
    const userId = request['user']._id;
    return await this.orderService.create(userId, createOrderDto);
  }

  @isAdmin()
  @UseGuards(AuthGuard, IsAdmin)
  @Get()
  async getAllOrders() {
    return await this.orderService.getAllOrders();
  }

  @isAdmin()
  @UseGuards(AuthGuard, IsAdmin)
  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return await this.orderService.getOrderById(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteOrder(
    @Param('id') id: string,
    @Req()
    request: Request,
  ) {
    return await this.orderService.deleteOrder(request['user']._id, id);
  }

  @isAdmin()
  @UseGuards(AuthGuard, IsAdmin)
  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async getOrdersByUserId(@Param('userId') userId: string) {
    return await this.orderService.getOrdersByUserId(userId);
  }

  @isAdmin()
  @UseGuards(AuthGuard, IsAdmin)
  @Get('status/:orderId/:status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Param('status') status: string,
  ) {
    const updates: UpdateOrderDto = { orderStatus: status };
    return await this.orderService.updateOrderStatus(orderId, updates);
  }
}
