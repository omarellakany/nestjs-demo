import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateApplicationDto } from './dtos/create-application.dto';
import { Application, Chat, Message } from '@prisma/client';
import { UpdateApplicationDto } from './dtos/update-application.dto';
import { CreateMessageDto } from './dtos/create-message.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('chat') private chatQueue: Queue,
    @InjectQueue('message') private messageQueue: Queue,
  ) {}

  createApplication(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    try {
      return this.prisma.application.create({
        data: createApplicationDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  updateApplicationByToken(
    token: string,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    try {
      return this.prisma.application.update({
        where: {
          token,
        },
        data: updateApplicationDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  getApplicationByToken(token: string): Promise<Application> {
    try {
      return this.prisma.application.findUnique({
        where: {
          token,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createChat(applicationToken: string): Promise<void> {
    try {
      this.logger.log(
        `Queuing Chat creation for application ${applicationToken}`,
      );
      await this.chatQueue.add('create', applicationToken);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  getApplicationChats(applicationToken: string): Promise<Chat[]> {
    try {
      return this.prisma.chat.findMany({
        where: {
          applicationToken,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createMessage(
    chatApplicationToken: string,
    chatNumber: number,
    createMessageDto: CreateMessageDto,
  ): Promise<void> {
    try {
      this.logger.log(
        `Queuing Message creation for chat ${chatApplicationToken} ${chatNumber}`,
      );
      await this.messageQueue.add('create', {
        chatApplicationToken,
        chatNumber,
        ...createMessageDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  searchChatMessages(
    chatApplicationToken: string,
    chatNumber: number,
    body: string,
  ): Promise<Message[]> {
    try {
      return this.prisma.message.findMany({
        where: {
          chatApplicationToken,
          chatNumber,
          body: {
            contains: body,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
