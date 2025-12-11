import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ReserveBookingDto } from './dto/reserve-booking.dto';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('reserve')
  async reserve(@Body() dto: ReserveBookingDto) {
    return await this.bookingsService.reserve(dto);
  }

  @Get(':period')
  async filter(@Param('period') period:'day' | 'week' | 'month') {
    return await this.bookingsService.getUserByBookingCount(period);
  }
}

