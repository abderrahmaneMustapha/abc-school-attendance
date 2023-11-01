import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

let envFilePath;

if (process.env.NODE_ENV === 'production') {
  envFilePath = '.env.prod';
} else if (process.env.NODE_ENV === 'test') {
  envFilePath = '.env.test';
} else {
  envFilePath = '.env.dev';
}
console.log(envFilePath);

dotenv.config({ path: envFilePath });

@Module({
  imports: [
    EmployeesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: process.env.TYPEORM_AUTO_LOAD_ENTITIES === 'true',
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      logging: process.env.TYPEORM_LOGGING === 'true',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
