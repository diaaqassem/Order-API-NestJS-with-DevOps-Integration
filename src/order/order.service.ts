import { Injectable } from '@nestjs/common';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from 'src/product/schema/product.schema';
import { CustomHttpException } from 'src/common/exceptions/custom-http.exception';
import { SendEmail } from 'src/common/services/send-email.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    private sendEmail: SendEmail,
  ) {}

  async create(userId, createOrderDto: CreateOrderDto): Promise<string> {
    let totalPrice = 0;
    // get product info
    for (const item of createOrderDto.items) {
      const product = await this.ProductModel.findById(item.product);

      if (!product) {
        throw new CustomHttpException(
          `Product with ID ${item.product} not found`,
          400,
        );
      }

      item.price = product.price;
      totalPrice += item.quantity * product.price;
    }

    createOrderDto.totalPrice = totalPrice;

    await this.OrderModel.create({
      user: userId,
      shippingAddress: createOrderDto.shippingAddress,
      items: createOrderDto.items,
      shippingPrice: createOrderDto.shippingPrice,
      totalPrice: createOrderDto.totalPrice,
      orderStatus: 'pending',
      isPaid: false,
    });

    return 'Order Created';
  }

  getOrderById(orderId: string): Promise<Order> {
    return this.OrderModel.findById(orderId).select('-_id').lean();
  }

  async updateOrderStatus(
    orderId: string,
    updates: UpdateOrderDto,
  ): Promise<Order> {
    const order: any = await this.OrderModel.findById(orderId);
    if (!order) {
      throw new CustomHttpException(`Order with ID ${orderId} not found`, 400);
    }
    if (updates.orderStatus === 'delivered') {
      // update product

      for (const item of order.items) {
        const product: any = await this.ProductModel.findById(item.product);
        if (!product) continue;

        product.sold += item.quantity;
        product.quantity -= item.quantity;
        await product.save();
      }
      updates.deliveredAt = new Date();
      updates.isPaid = true;
    }
    this.sendEmail.orderStatus(order.user, updates.orderStatus);
    return this.OrderModel.findByIdAndUpdate(orderId, updates, { new: true })
      .select('-_id')
      .lean();
  }

  async deleteOrder(userId, orderId: string): Promise<string> {
    await this.OrderModel.findByIdAndDelete({
      userId,
      _id: orderId,
    }).exec();
    return 'Order Deleted';
  }

  async getAllOrders(): Promise<Order[]> {
    const orders = await this.OrderModel.find().lean();
    orders.forEach((order: any) => {
      order._id = order._id.toString();
    });
    return orders;
  }

  getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.OrderModel.find({ userId }).lean();
  }
}
