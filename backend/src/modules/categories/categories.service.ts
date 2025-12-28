import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesRepository: CategoriesRepository) { }

    async findAll() {
        return this.categoriesRepository.find({ parent: null });
    }

    async findSubCategories(parentId: string) {
        return this.categoriesRepository.findSubCategories(parentId);
    }

    async findBySlug(slug: string) {
        return this.categoriesRepository.findBySlug(slug);
    }
}
