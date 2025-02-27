import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksController } from './books.controller'; // Import your new controller


@Module({
  imports: [],
  controllers: [AppController, BooksController], // Add it here
  providers: [AppService],
})
export class AppModule {}
