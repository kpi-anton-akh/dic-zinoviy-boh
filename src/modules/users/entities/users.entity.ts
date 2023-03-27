import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Bogdan' })
  @Column()
  name: string;

  @ApiProperty({ example: 'bogdan-baraban@ukr.net' })
  @Column()
  email: string;

  @ApiProperty({ example: '12345678' })
  @Column()
  password: string;
}
