import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { Category } from './schema/category.schema';
import { IsAdmin } from 'src/common/guards/isadmin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { isAdmin } from 'src/common/decorators/isadmin.decorator';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @isAdmin()
  @UseGuards(AuthGuard, IsAdmin)
  @Post()
  async createCategory(@Body() createDto: CategoryDto): Promise<string> {
    return this.categoryService.createCategory(createDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllCategories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getCategoryById(@Param('id') id): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Patch('/:id')
  async updateCategory(
    @Param('id') id,
    @Body() updateCategoryDto: CategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @isAdmin()
  @UseGuards(AuthGuard, IsAdmin)
  @Delete('/:id')
  async deleteCategory(@Param('id') id): Promise<void> {
    this.categoryService.deleteCategory(id);
  }
}
