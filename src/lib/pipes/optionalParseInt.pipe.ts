import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class OptionalParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null || value === '') return undefined;

    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(`${metadata.data} must be a number`);
    }
    return val;
  }
}
