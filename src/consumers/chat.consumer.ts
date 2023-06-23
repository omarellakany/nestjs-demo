import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Chat } from '@prisma/client';
import { Job } from 'bull';
import { PrismaService } from 'prisma/prisma.service';

@Processor('chat')
export class ChatConsumer {
  private readonly logger = new Logger(ChatConsumer.name);

  constructor(private readonly prisma: PrismaService) {}

  @Process('create')
  async transcode(job: Job<string>) {
    try {
      const applicationToken = job.data;
      this.logger.log(
        `Started Chat creation job for application ${applicationToken}`,
      );
      const { number } = (await this.prisma.chat.findFirst({
        where: {
          applicationToken,
        },
        orderBy: {
          number: 'desc',
        },
        select: {
          number: true,
        },
      })) ?? { number: 0 };
      return await this.prisma.chat.create({
        data: {
          applicationToken,
          number: number + 1,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  @OnQueueCompleted()
  async onCompleted(_: Job, chat: Chat) {
    this.logger.log(`Created Chat with id ${chat.id}`);
  }
}
