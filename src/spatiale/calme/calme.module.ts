import { Module } from '@nestjs/common';
import { CalmeCalculatorService } from './calme-calculator.service';
import { TypeElemBruitModule } from '../type_elem_bruit/type_elem_bruit.module';

@Module({
  imports: [TypeElemBruitModule],
  providers: [CalmeCalculatorService],
  exports: [CalmeCalculatorService] 
})
export class CalmeModule {}


