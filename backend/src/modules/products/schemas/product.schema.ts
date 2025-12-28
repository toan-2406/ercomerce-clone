import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
    @Prop({ required: true, index: true })
    name: string;

    @Prop({ required: true, unique: true, index: true })
    slug: string;

    @Prop({ index: true })
    category: string; // Should eventually be a reference to Category

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop()
    priceString: string;

    @Prop({ unique: true })
    url: string; // From scraper

    @Prop([String])
    images: string[];

    @Prop({ type: [{ label: String, value: String }], _id: false })
    specs: { label: string; value: string }[];

    @Prop({ default: 0 })
    totalStock: number;

    @Prop({ default: 0 })
    soldCount: number;

    @Prop({ default: 'active' })
    status: string;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ name: 'text' });
ProductSchema.index({ category: 1, status: 1, isDeleted: 1 });
