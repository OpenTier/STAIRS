import { Module } from '@nestjs/common';
import { Command } from './command.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandsController } from './commands.controller';
import { CommandsService } from './commands.service';

@Module({
  imports: [TypeOrmModule.forFeature([Command])],
  providers: [CommandsService],
  controllers: [CommandsController],
  exports: [],
})
export class CommandsModule {}
