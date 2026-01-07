import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../database/base/base.repository';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsRepository extends BaseRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  async findBySlug(slug: string): Promise<ProductDocument | null> {
    return this.productModel.findOne({ slug, isDeleted: false }).exec();
  }
}
