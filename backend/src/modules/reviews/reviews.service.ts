import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
    constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) { }

    async create(createReviewDto: any) {
        const newReview = new this.reviewModel(createReviewDto);
        return newReview.save();
    }

    async findByProductId(productId: string) {
        return this.reviewModel.find({ productId }).sort({ createdAt: -1 }).exec();
    }

    async getAverageRating(productId: string) {
        const result = await this.reviewModel.aggregate([
            { $match: { productId } },
            { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
        ]);
        return result.length > 0 ? result[0] : { average: 0, count: 0 };
    }
}
