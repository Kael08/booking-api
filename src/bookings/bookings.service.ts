import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Event } from '../entities/event.entity';
import { ReserveBookingDto } from './dto/reserve-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async reserve(dto: ReserveBookingDto): Promise<Booking> {
    const event = await this.eventRepository.findOne({
      where: { id: dto.event_id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const existingBooking = await this.bookingRepository.findOne({
      where: {
        eventId: dto.event_id,
        userId: dto.user_id,
      },
    });

    if (existingBooking) {
      throw new ConflictException('User has already booked this event');
    }

    const bookedCount = await this.bookingRepository.count({
      where: { eventId: dto.event_id },
    });

    if (bookedCount >= event.totalSeats) {
      throw new BadRequestException('No available seats');
    }

    const booking = this.bookingRepository.create({
      eventId: dto.event_id,
      userId: dto.user_id,
    });

    return await this.bookingRepository.save(booking);
  }
}

