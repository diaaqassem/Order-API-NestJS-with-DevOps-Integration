import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Product } from './schema/product.schema';
import { IsAdmin } from 'src/common/guards/isadmin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { isAdmin } from 'src/common/decorators/isadmin.decorator';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @isAdmin()
  @UseGuards(AuthGuard, IsAdmin)
  @UseInterceptors(
    FileInterceptor('imageCover', {
      dest: 'files-upload/products/',
      fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  @Post()
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateProductDto,
  ): Promise<string> {
    const newFilename = `${file.originalname}${Date.now().toString()}.jpeg`;
    const newPath = path.join(file.destination, newFilename);
    fs.renameSync(file.path, newPath);
    createDto.imageCover = newPath;
    return this.productService.createProduct(createDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllCategories(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getProductById(@Param('id') id): Promise<Product> {
    return this.productService.findOne(id);
  }

  @isAdmin()
  @UseGuards(AuthGuard, IsAdmin)
  @Patch('/:id')
  async updateProduct(
    @Param('id') id,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @isAdmin()
  @UseGuards(AuthGuard, IsAdmin)
  @Delete('/:id')
  async deleteProduct(@Param('id') id): Promise<void> {
    this.productService.deleteProduct(id);
  }
}
