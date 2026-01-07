import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) { }

    @Get()
    async getNews(@Query('limit') limit: string) {
        return this.newsService.findAll(limit ? parseInt(limit, 10) : 10);
    }

    @Get(':slug')
    async getPost(@Param('slug') slug: string) {
        return this.newsService.findBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async createPost(@Body() data: any) {
        return this.newsService.create(data);
    }
}
