import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true, collection: 'categories' })
export class Category {
    @Prop({ required: true, index: true })
    name: string;

    @Prop({ required: true, unique: true, index: true })
    slug: string;

    @Prop({ required: true })
    url: string; // From scraper

    @Prop()
    icon: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', index: true })
    parent: Category;

    @Prop({ default: 0 })
    order: number;

    @Prop({ default: 'active' })
    status: string;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
