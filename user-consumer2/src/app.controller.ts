import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>
  ) { }


  @EventPattern('user.created')
  handleUserCreation(@Payload() user, @Ctx() context: KafkaContext) {
    try {
      const originalMessage = context.getMessage();

      console.log("value is : ", originalMessage.value);
      console.log("timestamp is : ", originalMessage.timestamp);
      console.log("offset is : ", originalMessage.offset);
      console.log("topic is : ", context.getTopic());
      console.log("partition is : ", context.getPartition());
      console.log('Received user creation event:', user);
      const newUser={...user,
        timeStamp:originalMessage.timestamp,
        topic:context.getTopic(),
        partition:context.getPartition(),
        offset:originalMessage.offset,
       }
      const createdCat = new this.UserModel(newUser);
      return createdCat.save()
      // Process the user data (e.g., save to database)
    } catch (error) {
      console.error('Error processing user creation event:', error);
    }
  }



  @MessagePattern('users.fetch') // Listens for 'users.fetch' request
  async handleUserFetch(@Payload() query) {
    try {
      console.log("hero pattern")
      const { page = 1, limit = 10, name, email } = query;

      console.log('Received fetch request:', { page, limit, name, email });

      const filter: any = {};
      if (name) filter.name = { $regex: name, $options: 'i' };
      if (email) filter.email = { $regex: email, $options: 'i' };

      // Paginated query
      const users = await this.UserModel.find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .exec();

      const total = await this.UserModel.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);
console.log(users);
      // Return the response
      return {
        page,
        limit,
        total,
        totalPages,
        users,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { error: 'Failed to fetch users' };
    }
  }



}

