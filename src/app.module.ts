import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { BullModule } from '@nestjs/bull';
import { ChatConsumer } from './consumers/chat.consumer';
import { MessageConsumer } from './consumers/message.consumer';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({ name: 'chat' }, { name: 'message' }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, ChatConsumer, MessageConsumer],
})
export class AppModule {}
