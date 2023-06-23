import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HideIdInterceptor } from './interceptors/hide-id.interceptor';
import { CreateApplicationDto } from './dtos/create-application.dto';
import { UpdateApplicationDto } from './dtos/update-application.dto';
import { CreateMessageDto } from './dtos/create-message.dto';

@Controller()
@UseInterceptors(HideIdInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('applications')
  createApplication(@Body() createApplicationDto: CreateApplicationDto) {
    return this.appService.createApplication(createApplicationDto);
  }

  @Put('applications/:token')
  updateApplicationByToken(
    @Param('token') token: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.appService.updateApplicationByToken(
      token,
      updateApplicationDto,
    );
  }

  @Get('applications/:token')
  getApplicationByToken(@Param('token') token: string) {
    return this.appService.getApplicationByToken(token);
  }

  @Get('applications/:token/chats')
  getApplicationChats(@Param('token') applicationToken: string) {
    return this.appService.getApplicationChats(applicationToken);
  }

  @Post('applications/:token/chats')
  createChat(@Param('token') applicationToken: string) {
    return this.appService.createChat(applicationToken);
  }

  @Post('applications/:token/chats/:number/messages')
  createMessage(
    @Param('token') applicationToken: string,
    @Param('number', ParseIntPipe) chatNumber: number,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.appService.createMessage(
      applicationToken,
      chatNumber,
      createMessageDto,
    );
  }

  @Get('applications/:token/chats/:number/messages')
  searchChatMessages(
    @Param('token') applicationToken: string,
    @Param('number', ParseIntPipe) chatNumber: number,
    @Query('query') query: string,
  ) {
    return this.appService.searchChatMessages(
      applicationToken,
      chatNumber,
      query,
    );
  }
}
