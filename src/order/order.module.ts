import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './schema/order.schema';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from 'src/product/product.module';
import { SendEmail } from 'src/common/services/send-email.service';

@Module({
  imports: [
    UserModule,
    ProductModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  providers: [OrderService, SendEmail],
  controllers: [OrderController],
})
export class OrderModule {}
