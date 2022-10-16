import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper'

it('has a route handler listining to /api/orders for post request', async () => {
    const response = await request(app)
        .post('/api/orders')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/orders')
        .send({});

    expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10
        }).expect(400);

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            price: 10
        }).expect(400);
});

it('returns an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            title: 'example title',
            price: -10
        }).expect(400);

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            title: 'example-title'
        }).expect(400);
});

it('creates a order with valid inputs', async () => {
    let orders = await Order.find({});
    expect(orders.length).toEqual(0);

    const title = 'Example title';
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            title,
            price: 20
        }).expect(201);

    orders = await Order.find({});
    expect(orders.length).toEqual(1);
    expect(orders[0].title).toEqual(title);
    expect(orders[0].price).toEqual(20);
},);

it('publishes an event', async () => {
    const title = 'Example title';
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            title,
            price: 20
        }).expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});