import { AuthUser } from 'src/auth/auth-user';
import { CreateTagDto } from '../service/dto/create-tag.dto';
import { CreateTagRequest } from './request/create-tag.request';
import { RequestUser } from 'src/auth/decorator/auth-user.decotator';
import { TagResponse } from './response/tag.response';
import { TagService } from '../service/tag.service';
import { UpdateTagDto } from '../service/dto/update-tag.dto';
import { UpdateTagRequest } from './request/update-tag.request';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

@ApiBearerAuth()
@Controller('tag')
class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiResponse({ status: HttpStatus.CREATED, type: TagResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@RequestUser() user: AuthUser, @Body() requestBody: CreateTagRequest) {
    const dto = new CreateTagDto(requestBody);

    const entity = await this.tagService.create(dto, user);

    return TagResponse.fromEntity(entity);
  }

  @ApiResponse({ status: HttpStatus.OK, type: TagResponse })
  @Get(':id')
  async findOne(@RequestUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    const entity = await this.tagService.findOneById(id, user);

    return TagResponse.fromEntity(entity);
  }

  @ApiResponse({ status: HttpStatus.OK, type: TagResponse })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @RequestUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateTagRequest,
  ) {
    const dto = new UpdateTagDto(requestBody);
    const entity = await this.tagService.update(id, dto, user);

    return TagResponse.fromEntity(entity);
  }

  @ApiResponse({ status: HttpStatus.OK, type: TagResponse })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@RequestUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    const entity = await this.tagService.remove(id, user);

    return TagResponse.fromEntity(entity);
  }
}

export { TagController };
