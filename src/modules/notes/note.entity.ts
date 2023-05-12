import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity()
export class Note {
  @ApiProperty()
  @ObjectIdColumn({
    type: ObjectID,
  })
  id: string;

  @ApiProperty()
  @Column({ nullable: false })
  title: string;

  @ApiProperty()
  @Column()
  description: string;
}
