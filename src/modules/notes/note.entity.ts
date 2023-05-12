import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Note {
  @ApiProperty()
  @ObjectIdColumn()
  id: string;

  @ApiProperty()
  @Column({ nullable: false })
  title: string;

  @ApiProperty()
  @Column()
  description: string;
}
