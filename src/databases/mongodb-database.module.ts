import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Note } from '../modules/notes/note.entity';
import { MONGO_CONNECTION_NAME } from '../shared/constants/index';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: MONGO_CONNECTION_NAME,
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        host: configService.get('MONGODB_HOST'),
        port: configService.get<number>('MONGODB_PORT'),
        username: configService.get('MONGODB_USERNAME'),
        password: configService.get('MONGODB_PASSWORD'),
        database: configService.get('MONGODB_DATABASE'),
        useUnifiedTopology: true,
        useNewUrlParser: true,
        ssl: true,
        entities: [Note],
        synchronize: true,
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),

    TypeOrmModule.forFeature([Note], MONGO_CONNECTION_NAME),
  ],
  exports: [TypeOrmModule],
})
export class MongodbDatabaseModule {}
