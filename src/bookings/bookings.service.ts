import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
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

  
  
  async getUserByBookingCount(
    period: 'day' | 'week' | 'month'
  ) {
    const startDate = this.getStartDateByPeriod(period)

    const data = await this.bookingRepository.find({
      where : {
        createdAt: MoreThanOrEqual(startDate)
      }
    })

    const bookingMap = new Map<string, Set<number>>()

    data.forEach(item => {
      if(!bookingMap.has(item.userId)){
        bookingMap.set(item.userId, new Set<number>)
      }

      bookingMap.get(item.userId)!.add(item.eventId)
    })

    const users = Array.from(bookingMap.entries()).map(([userId,eventSet])=>({
      user_id:userId,
      booking_count: eventSet.size,
      //eventIds: Array.from(eventSet)
    }))
    .sort((a,b)=> b.booking_count - a.booking_count)
    //.slice(0,10)

    const places = []
    let place = 1
    for(let i=0; i<users.length&&place<10;i++){
      if(i===0){
        places.push({
          place,
          ...users[i]
        })
      } else if(users[i].booking_count===users[i-1].booking_count){
        places.push({
          place,
          ...users[i]
        })
      } else {
        place++

        places.push({
          place,
          ...users[i]
        })
      }
    }


    return places

    // const resultWithRank = users.map((user, index)=> ({
    //   place: index + 1,
    //   ...user
    // }))

    // return resultWithRank
  }

  private getStartDateByPeriod(period: 'day' | 'week' | 'month'): Date {
    const date = new Date()

    switch (period){
      case 'day':
        date.setHours(0,0,0,0)
        break;

      case 'week':
        const day = date.getDay()
        const diff = date.getDate() - day + (day===0? -6 : 1)
        date.setDate(diff)
        date.setHours(0,0,0,0)
        break;

      case 'month':
        date.setDate(1)
        date.setHours(0,0,0,0)
        break;
    }

    return date
  }

}

