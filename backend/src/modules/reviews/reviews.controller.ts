import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    create(@Body() createReviewDto: any) {
        return this.reviewsService.create(createReviewDto);
    }

    @Get('product/:productId')
    findByProductId(@Param('productId') productId: string) {
        return this.reviewsService.findByProductId(productId);
    }

    @Get('product/:productId/stats')
    getStats(@Param('productId') productId: string) {
        return this.reviewsService.getAverageRating(productId);
    }
}
