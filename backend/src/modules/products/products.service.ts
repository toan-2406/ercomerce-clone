import { Injectable, Logger } from '@nestjs/common';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
    private readonly logger = new Logger(ProductsService.name);

    constructor(private readonly productsRepository: ProductsRepository) { }

    async findAll() {
        return this.productsRepository.find();
    }

    async findOne(id: string) {
        return this.productsRepository.findById(id);
    }

    async findByCategory(category: string) {
        return this.productsRepository.find({ category });
    }

    async search(query: string) {
        // Using text search if defined in schema, or regex
        return this.productsRepository.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });
    }
}
