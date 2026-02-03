import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeLieuDto } from './create-type-lieu.dto';

export class UpdateTypeLieuDto extends PartialType(CreateTypeLieuDto) {}