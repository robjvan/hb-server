import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LogRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  service: string;

  @Column('text')
  error: string;

  @Column('text')
  errorMsg: string;
}
