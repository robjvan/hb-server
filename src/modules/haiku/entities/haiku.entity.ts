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

  @ApiProperty({ description: 'First line of the haiku.' })
  @Column('text')
  lineOne: string;

  @ApiProperty({ description: 'Second line of the haiku.' })
  @Column('text')
  lineTwo: string;

  @ApiProperty({ description: 'Third line of the haiku.' })
  @Column('text')
  lineThree: string;

  @ApiProperty({ description: 'Input term used to generate the haiku.' })
  @Column('text')
  input: string;

  @ApiProperty({ description: 'Creation date of the haiku.' })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Country of the user that generated the haiku.' })
  @ManyToOne(() => Country, (country) => country.haikus)
  @JoinColumn({ name: 'countryId' })
  country: Country;
}
