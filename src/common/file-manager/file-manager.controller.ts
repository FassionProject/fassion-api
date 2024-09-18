import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileManagerService } from './file-manager.service';
import { createReadStream } from 'fs';

@ApiTags('FileManager')
@Controller('file')
export class FileManagerController {
  constructor(private readonly fileManager: FileManagerService) {}

  @Get(':fullPath(*)')
  async findOne(@Param('fullPath') fullPath: string): Promise<any> {
    const file = await this.fileManager.get(fullPath);
    return new StreamableFile(file.content, {
      type: file.mimetype,
      disposition: `inline; filename="${file.file.split('/').pop()}"`,
    });
  }
}
