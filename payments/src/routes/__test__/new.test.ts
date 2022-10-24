import { OrderStatus } from '@thundertickets/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app'
import { Order } from '../../models/order';
import { Payment } from '../../models/payments';
import { stripe } from '../../stripe';

// jest.mock('../../stripe');

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
});

// it('returns a 204 with valid inputs', async () => {
//     const createOrderUser = global.signin();

//     const order = Order.build({
//         id: new mongoose.Types.ObjectId().toHexString(),
//         version: 0,
//         userId: createOrderUser.userId,
//         price: 10,
//         status: OrderStatus.Created,
//     });

//     await order.save();

//     await request(app).post('/api/payments')
//         .set('Cookie', createOrderUser.cookie)
//         .send({
//             token: 'tok_visa',
//             orderId: order.id,
//         })
//         .expect(201);

//     const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
//     expect(chargeOptions.source).toEqual('tok_visa');
//     expect(chargeOptions.amount).toEqual(order.price * 100);
//     expect(chargeOptions.currency).toEqual('usd');
// });

it('returns a 204 with real test charge', async () => {
    // comment use mock
    // rename mock stripe.ts{,.old}

    const createOrderUser = global.signin();
    const price = Math.floor(Math.random() * 1000);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: createOrderUser.userId,
        price: price,
        status: OrderStatus.Created,
    });

    await order.save();

    await request(app).post('/api/payments')
        .set('Cookie', createOrderUser.cookie)
        .send({
            token: 'tok_visa',
            orderId: order.id,
        })
        .expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price * 100;
    })

    expect(stripeCharge).toBeDefined();

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge?.id
    });
    expect(payment).not.toBeNull();
});