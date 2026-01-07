import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    summary: string;

    @Prop()
    thumbnail: string;

    @Prop({ default: 'S-Forum' })
    author: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
    relatedProducts: string[];

    @Prop({ default: 0 })
    views: number;

    @Prop({ default: true })
    isPublished: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
