import { OrderStatus } from '@thundertickets/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app'
import { Order } from '../../models/order';

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app).post('/api/payments')
        .set('Cookie', global.signin().cookie)
        .send({
            token: 'token-1234',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
    const createOrderUser = global.signin();
    const signInUser = global.signin();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: createOrderUser.userId,
        price: 10,
        status: OrderStatus.Created,
    });

    await order.save();

    await request(app).post('/api/payments')
        .set('Cookie', signInUser.cookie)
        .send({
            token: 'token-1234',
            orderId: order.id,
        })
        .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const createOrderUser = global.signin();
    // const signInUser = global.signin();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: createOrderUser.userId,
        price: 10,
        status: OrderStatus.Cancelled,
    });

    await order.save();

    await request(app).post('/api/payments')
        .set('Cookie', createOrderUser.cookie)
        .send({
            token: 'token-1234',
            orderId: order.id,
        })
        .expect(400);
})