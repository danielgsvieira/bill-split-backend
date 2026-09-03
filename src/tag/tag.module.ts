import { Module } from '@nestjs/common';
import { Tag } from './entity/tag.entity';
import { TagController } from './controller/tag.controller';
import { TagPolicy } from './service/policy/tag.policy';
import { TagService } from './service/tag.service';
import { TagValidator } from './service/validation/tag.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [TagService, TagPolicy, TagValidator],
  exports: [TagService],
})
class TagModule {}

export { TagModule };
