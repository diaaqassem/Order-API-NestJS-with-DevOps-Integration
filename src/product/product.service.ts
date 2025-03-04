import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CustomHttpException } from 'src/common/exceptions/custom-http.exception';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
  ) {}

  async createProduct(data: CreateProductDto): Promise<string> {
    await new this.ProductModel(data).save();
    return 'Product created';
  }
  async getAllProducts(): Promise<Product[]> {
    const products = await this.ProductModel.find({}).lean();
    products.forEach((product: any) => {
      product._id = product._id.toString();
    });
    return products;
  }

  async findOne(id): Promise<Product> {
    return await this.ProductModel.findById(id).select('-_id').lean();
  }

  async updateProduct(id, data: UpdateProductDto): Promise<Product> {
    const Product = await this.ProductModel.findByIdAndUpdate(
      id,
      { name: data.name },
      { new: true },
    ).exec();
    if (!Product) {
      throw new CustomHttpException('No Product found with this ID', 404);
    }
    return Product;
  }

  async deleteProduct(id) {
    const product = await this.ProductModel.findById(id);
    if (product.imageCover) {
      // del image from path /files-upload/products by using fs
      const filePath = path.join(__dirname, '../../', product.imageCover);
      fs.unlinkSync(filePath);
    }
    return await this.ProductModel.findByIdAndDelete(id);
  }
}
