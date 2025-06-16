import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { createReadStream } from 'fs';
import { access, constants, stat } from 'fs/promises';
import * as path from 'path';
import { createInterface, Interface } from 'readline';
import { TypedEnvConfig } from 'src/config/typed.env.config';

export function getLinesInterfaceFromFilePath(filePath: string): Interface {
  const readStream = createReadStream(filePath);
  const lineInterface = createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });
  return lineInterface;
}

@Injectable()
export class FilePathValidationPipe
  implements PipeTransform<string, Promise<string>>
{
  private readonly allowedBaseDir: string;
  private readonly allowedExtensions = ['.dat'];
  private readonly maxFileSize: number;

  constructor(private readonly envConfig: TypedEnvConfig) {
    this.allowedBaseDir = envConfig.fileProcessingConfig.filesBasePath;
    this.maxFileSize =
      this.envConfig.fileProcessingConfig.maxFileSize * 1024 * 1024 * 1024;
  }
  async transform(filePath: string): Promise<string> {
    if (!filePath?.trim()) {
      throw new BadRequestException('File path is required');
    }
    const resolvedPath = path.resolve(filePath.trim());
    /*
    const normalizedBasePath = path.resolve(this.allowedBaseDir);
    if (!resolvedPath.startsWith(normalizedBasePath)) {
      throw new BadRequestException('Path outside allowed directory');
    }
      */
    const ext = path.extname(resolvedPath).toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `Invalid extension. Allowed: ${this.allowedExtensions.join(', ')}`,
      );
    }
    try {
      const stats = await stat(resolvedPath);
      if (!stats.isFile()) throw new Error('Not a file');
      if (stats.size > this.maxFileSize) throw new Error('File too large');
      await access(resolvedPath, constants.R_OK);
    } catch (error) {
      throw new BadRequestException(`File error: ${error}`);
    }

    return resolvedPath;
  }
}
