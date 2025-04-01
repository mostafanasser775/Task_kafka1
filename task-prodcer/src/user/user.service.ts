import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {

  constructor(@Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafkaProxy) { }
  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('users.fetch'); // ✅ Subscribing to response
    await this.kafkaClient.connect(); // ✅ Ensure connection before sending messages
  }

  create(createUserDto: CreateUserDto) {
    console.log('User', createUserDto);
    this.kafkaClient.emit('user.created', createUserDto);
    return 'userName : '+createUserDto.name + ' created successfully!'; // Emit the event to Kafka topic 'user.created'
  }



 async findAll(query: any) {
    console.log('Requesting users with filter:', query);

    try {
   const response = await firstValueFrom(
        this.kafkaClient.send('users.fetch', query) // 'users.fetch' is the topic the consumer listens to
      );
      
      console.log('Received response from consumer:', response);
      return response;

    } catch (error) {
      console.error('Error fetching users:', error);
      return { error: 'Failed to fetch users xxx' };
    }
    // Wait for response from Kafka topic `users.fetched`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
