
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop()
    email: string;
    @Prop()
    password: string;
    
    @Prop()
    topic: string;
  
    @Prop()
    partition: number;
  
    @Prop()
    offset: string;
  
    @Prop()
    timeStamp: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
