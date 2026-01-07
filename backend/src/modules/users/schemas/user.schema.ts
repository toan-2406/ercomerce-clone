import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true, index: true })
  phoneNumber: string;

  @Prop({ unique: true, sparse: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  fullName: string;

  @Prop({ default: 'S-Member' })
  rank: string;

  @Prop({ default: 0 })
  points: number;

  @Prop({ default: 'customer' }) // 'customer', 'admin', 'seller'
  role: string;

  @Prop({ default: 'active' }) // 'active', 'inactive', 'blocked'
  status: string;

  @Prop()
  avatar: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

  @Prop()
  lastLoginAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ phoneNumber: 1 });
UserSchema.index({ email: 1 });
