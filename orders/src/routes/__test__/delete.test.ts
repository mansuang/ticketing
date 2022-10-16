import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper'

const orderId = () => {
    return new mongoose.Types.ObjectId().toHexString();
}

it('returns a 404 if the the provided id does not exist', async () => {
    await request(app)
        .put(`/api/orders/${orderId()}`)
        .set('Cookie', global.signin())
        .send({
            title: 'new title',
            price: 20
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    await request(app)
        .put(`/api/orders/${orderId()}`)
        .send({
            title: 'new title',
            price: 20
        }).expect(401);
});


it('returns a 401 if the user does not own order', async () => {
    const user1 = global.signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({
            title: 'my title',
            price: 20
        });

    const user2 = global.signin();

    await request(app)
        .put(`/api/orders/${response.body.id}`)
        .set('Cookie', user2)
        .send({
            title: 'new title',
            price: 30
        })
        .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const user1 = global.signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({
            title: 'my title',
            price: 20
        });

    await request(app)
        .put(`/api/orders/${response.body.id}`)
        .set('Cookie', user1)
        .send({
            title: '',
            price: 30
        })
        .expect(400);

    await request(app)
        .put(`/api/orders/${response.body.id}`)
        .set('Cookie', user1)
        .send({
            title: 'new title',
            price: -20
        })
        .expect(400);
});

it('update order if user provides valid inputs', async () => {
    const user1 = global.signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({
            title: 'my title',
            price: 20
        });

    await request(app)
        .put(`/api/orders/${response.body.id}`)
        .set('Cookie', user1)
        .send({
            title: 'new title',
            price: 30
        })
        .expect(200);

    const order = await request(app)
        .get(`/api/orders/${response.body.id}`)
        .send();

    expect(order.body.title).toEqual('new title');
    expect(order.body.price).toEqual(30);
});

it('publishes an event', async () => {
    const user1 = global.signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({
            title: 'my title',
            price: 20
        });

    await request(app)
        .put(`/api/orders/${response.body.id}`)
        .set('Cookie', user1)
        .send({
            title: 'new title',
            price: 30
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});