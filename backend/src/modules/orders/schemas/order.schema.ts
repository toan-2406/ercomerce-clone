import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({
        type: [{
            productId: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: String }
        }],
        required: true
    })
    items: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }[];

    @Prop({ required: true })
    totalPrice: number;

    @Prop({
        type: {
            fullName: String,
            phoneNumber: String,
            address: String,
            city: String,
        },
        required: true
    })
    shippingAddress: {
        fullName: string;
        phoneNumber: string;
        address: string;
        city: string;
    };

    @Prop({ default: 'pending' }) // pending, confirmed, shipping, delivered, cancelled
    status: string;

    @Prop({ default: 'cod' }) // cod, banking
    paymentMethod: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
