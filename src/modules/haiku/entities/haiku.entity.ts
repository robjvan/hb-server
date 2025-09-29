import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from '../../location/entities/country.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Haiku {
  @ApiProperty({ description: 'Generated ID of the record.', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'First line of the haiku.',
    example: 'I am a server',
  })
  @Column('text')
  lineOne: string;

  @ApiProperty({
    description: 'Second line of the haiku.',
    example: 'My job is to serve data',
  })
  @Column('text')
  lineTwo: string;

  @ApiProperty({
    description: 'Third line of the haiku.',
    example: 'I will do it well',
  })
  @Column('text')
  lineThree: string;

  @ApiProperty({
    description: 'Input term used to generate the haiku.',
    example: 'server',
  })
  @Column('text')
  input: string;

  @ApiProperty({
    description: 'Creation date of the haiku.',
    example: '2025-09-28T14:32:45.123Z',
  })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'Country of the user that generated the haiku.',
    type: Country,
  })
  @ManyToOne(() => Country, (country) => country.haikus)
  @JoinColumn({ name: 'countryId' })
  country: Country;
}
