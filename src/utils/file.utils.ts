import { createReadStream } from 'fs';
import { createInterface, Interface } from 'readline';

export function getLinesInterfaceFromFilePath(filePath: string): Interface {
  const readStream = createReadStream(filePath);
  const lineInterface = createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });
  return lineInterface;
}
