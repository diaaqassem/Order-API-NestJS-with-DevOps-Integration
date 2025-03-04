import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import { CategoryDto } from './dto/category.dto';
import { CustomHttpException } from 'src/common/exceptions/custom-http.exception';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
  ) {}

  async createCategory(data: CategoryDto): Promise<string> {
    await new this.CategoryModel(data).save();
    return 'Category created';
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.CategoryModel.find({}).lean();
    categories.forEach((category:any) => {
      category._id = category._id.toString();
    });
    return categories;
  }

  async findOne(id): Promise<Category> {
    return await this.CategoryModel.findById(id).select("name").lean();
  }

  async updateCategory(id, data: CategoryDto): Promise<Category> {
    const category = await this.CategoryModel.findByIdAndUpdate(
      id,
      { name: data.name },
      { new: true },
    ).exec();
    if (!category) {
      throw new CustomHttpException('No category found with this ID', 404);
    }
    return category;
  }

  async deleteCategory(id) {
    return await this.CategoryModel.findByIdAndDelete(id);
  }
}
