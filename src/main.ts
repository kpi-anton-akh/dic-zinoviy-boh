import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { UserStatsSubscriber } from './modules/user-stats/service-bus/UserStatsSubscriber';
import { UserStatsModule } from './modules/user-stats/user-stats.module';

const configureEdgeService = async (app: INestApplication) => {
  const userStatsSubscriber = app
    .select(UserStatsModule)
    .get(UserStatsSubscriber);

  await userStatsSubscriber.subscribe();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  const PREFIX = configService.get('NEST_PREFIX');
  app.setGlobalPrefix(PREFIX);

  const HOST = configService.get('NEST_HOST');
  const PORT = configService.get('NEST_PORT');

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setVersion(configService.get('npm_package_version'))
    .setTitle('Users service CRUD')
    .setDescription('REST-api documentation')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await configureEdgeService(app);
  await app.listen(PORT, HOST, () => {
    console.log(`Server listens on http://${HOST}:${PORT}`);
  });
}

bootstrap();
