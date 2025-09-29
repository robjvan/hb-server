import { Column, PrimaryGeneratedColumn } from 'typeorm';

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
