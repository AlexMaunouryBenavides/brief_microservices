import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { ProxyService } from './common/proxy.service';
import { UserController } from './user/user.controller';
import { CatalogController } from './catalog/catalog.controller';
import { CartController } from './cart/cart.controller';
import { OrderController } from './order/order.controller';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    JwtModule.register({
      secret: process.env['JWT_SECRET'] ?? 'changeme',
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }]),
  ],
  controllers: [
    AppController,
    UserController,
    CatalogController,
    CartController,
    OrderController,
  ],
  providers: [
    ProxyService,
    JwtAuthGuard,
    RolesGuard,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
