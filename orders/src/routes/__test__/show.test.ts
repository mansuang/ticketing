import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns a 404 if the order is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/orders/${id}`)
        .send()
        .expect(404);
});

it('returns a 404 if the order is not found', async () => {
    const title = 'Example title';
    const price = 20;

    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        }).expect(201);

    const orderResponse = await request(app)
        .get(`/api/orders/${response.body.id}`)
        .send()
        .expect(200);

    expect(orderResponse.body.title).toEqual(title);
    expect(orderResponse.body.price).toEqual(price);
});

