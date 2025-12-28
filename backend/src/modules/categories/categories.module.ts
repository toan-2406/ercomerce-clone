import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { Category, CategorySchema } from './schemas/category.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    ],
    providers: [CategoriesService, CategoriesRepository],
    exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule { }
