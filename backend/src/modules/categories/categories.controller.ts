import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @Public()
    async findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':slug')
    @Public()
    async findBySlug(@Param('slug') slug: string) {
        return this.categoriesService.findBySlug(slug);
    }

    @Get(':id/sub')
    @Public()
    async findSubCategories(@Param('id') id: string) {
        return this.categoriesService.findSubCategories(id);
    }
}
