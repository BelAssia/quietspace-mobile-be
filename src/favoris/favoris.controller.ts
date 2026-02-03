import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavorisService } from './favoris.service';
import { CreateFavorisDto } from './dtos/Create-favoris.dto';

@Controller('favoris')
export class FavorisController {
  constructor(private readonly favorisService: FavorisService) {}

  @Post()
  async add(@Body() dto: CreateFavorisDto) {
    return this.favorisService.add(dto);
  }

  @Delete(':idUser/:idLieu')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('idUser', ParseIntPipe) idUser: number,
    @Param('idLieu', ParseIntPipe) idLieu: number,
  ) {
    return this.favorisService.remove(idUser, idLieu);
  }

  @Get('user/:idUser')
  async getByUser(@Param('idUser', ParseIntPipe) idUser: number) {
    return this.favorisService.getByUser(idUser);
  }
}