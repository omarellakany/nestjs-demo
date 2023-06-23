import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Message } from '@prisma/client';
import { Job } from 'bull';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMessageDto } from 'src/dtos/create-message.dto';

@Processor('message')
export class MessageConsumer {
  private readonly logger = new Logger(MessageConsumer.name);

  constructor(private readonly prisma: PrismaService) {}

  @Process('create')
  async transcode(
    job: Job<
      CreateMessageDto & {
        chatApplicationToken: string;
        chatNumber: number;
      }
    >,
  ) {
    try {
      const { chatApplicationToken, chatNumber, ...createMessageDto } =
        job.data;
      this.logger.log(
        `Started Message creation job for chat ${chatApplicationToken} ${chatNumber}`,
      );
      const { number } = (await this.prisma.message.findFirst({
        where: {
          chatApplicationToken: chatApplicationToken,
          chatNumber: chatNumber,
        },
        orderBy: {
          number: 'desc',
        },
        select: {
          number: true,
        },
      })) ?? { number: 0 };
      return await this.prisma.message.create({
        data: {
          ...createMessageDto,
          number: number + 1,
          chat: {
            connect: {
              number_applicationToken: {
                number: chatNumber,
                applicationToken: chatApplicationToken,
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  @OnQueueCompleted()
  async onCompleted(_: Job, message: Message) {
    this.logger.log(`Created Message with id ${message.id}`);
  }
}
