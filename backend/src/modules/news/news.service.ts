import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class NewsService {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

    async findAll(limit: number = 10) {
        return this.postModel.find({ isPublished: true }).sort({ createdAt: -1 }).limit(limit).exec();
    }

    async findBySlug(slug: string) {
        return this.postModel.findOneAndUpdate(
            { slug, isPublished: true },
            { $inc: { views: 1 } },
            { new: true }
        ).populate('relatedProducts').exec();
    }

    async create(data: any) {
        return this.postModel.create(data);
    }
}
