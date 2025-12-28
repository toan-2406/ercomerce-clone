import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from '../../database/base/base.repository';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesRepository extends BaseRepository<CategoryDocument> {
    constructor(
        @InjectModel(Category.name)
        private readonly categoryModel: Model<CategoryDocument>,
    ) {
        super(categoryModel);
    }

    async findBySlug(slug: string): Promise<CategoryDocument | null> {
        return this.categoryModel.findOne({ slug, isDeleted: false }).exec();
    }

    async findSubCategories(parentId: string): Promise<CategoryDocument[]> {
        return this.categoryModel.find({
            parent: parentId === 'null' ? null : new Types.ObjectId(parentId),
            isDeleted: false
        } as any).sort({ order: 1 }).exec();
    }
}
