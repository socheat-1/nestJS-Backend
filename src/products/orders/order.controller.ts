// product/orders/order.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Query } from '@nestjs/common';
import express from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import JsReport from 'jsreport-core';
@Controller('create-orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }


  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: number | string) {
    return this.orderService.findById(Number(orderId));
  }

  @Get()
  async getAllOrder(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.orderService.getOrders(page, limit);
  }
}