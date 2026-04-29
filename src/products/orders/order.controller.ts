// product/orders/order.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Res, Render, ParseIntPipe } from '@nestjs/common';
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

  // @Get()
  // async getAllOrders() {
  //   return this.orderService.getOrders();
  // }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.findById(Number(id));
  }

  // @Get(':id/invoice')
  // @Render('invoice') // uses views/invoice.ejs
  // async getInvoice(@Param('id') id: number) {
  //   const order = await this.orderService.findById(id);
  //   return { order: order.data }; // this will be passed to EJS
  // }


  // Route to render iframe page
  // @Get(':id/view')
  // async viewInvoice(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
  //   res.send(`
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <title>Invoice Viewer</title>
  //       </head>
  //       <body>
  //         <h1>Invoice Viewer</h1>
  //         <iframe src="/orders/${id}/invoice" width="100%" height="600"></iframe>
  //       </body>
  //     </html>
  //   `);
  // }

  // Route to render the actual invoice
  // @Get(':id/invoice')
  // @Render('invoice')
  // async getInvoice(@Param('id', ParseIntPipe) id: number) {
  //   const order = await this.orderService.findById(id);

  //   return {
  //     order: {
  //       orderId: order.data.orderId,
  //       user: {
  //         f_name: order.data.user.f_name,
  //         phone: order.data.user.phone,
  //       },
  //       totalPrice: order.data.totalPrice,
  //       products: order.data.products,
  //     }
  //   };
  // }

  @Get(':id/invoice')
  async getInvoicePdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: express.Response,
  ) {
    // 1. Fetch the order data
    const order = await this.orderService.findById(id);
    if (!order) {
      return res.status(404).send('Order not found');
    }

    // 2. Initialize JsReport
    const jsreport = JsReport();
    await jsreport.init();

    // 3. Create your HTML template (replace with your actual HTML)
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #000000; text-align: left; }
            td.right { text-align: right; font-weight: bold; }
            td.id { text-align: center; width: 25px;}
            td.qty { text-align: center;}
            td.price { text-align: end;}
            th{text-align: center; background-color: #a52a2a;}
          </style>
        </head>
        <body>
          <h1>Invoice #${order.data.orderId}</h1>
          <p>Date: ${new Date(order.data.createdAt).toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.data.products.map((p: any ,index: number) => `
                <tr key={product.id}>
                  <td class="id">${index + 1}</td>
                  <td>${p.name}</td>
                  <td class="qty">${order.data.quantity}</td>
                  <td class="price">${p.price}</td>
                </tr>
              `,
        )
        .join('')}
            </tbody>
            <tr>
                <td class="right" colSpan='3'>Total</td>
                <td class="right">${Number(order.data.totalPrice).toLocaleString('en-US')} $</td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // 4. Render the PDF
    const pdf = await jsreport.render({
      template: {
        content: html,
        engine: 'none',      // 'none' means plain HTML, no templating engine
        recipe: 'chrome-pdf', // PDF generation
      },
    });

    // 5. Send the PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${order.data.orderId}.pdf`,
    );

    // pipe the PDF stream to the response
    pdf.stream.pipe(res);
  }
}