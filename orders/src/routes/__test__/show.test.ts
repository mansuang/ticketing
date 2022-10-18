import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";


it('fetches the order', async () => {
    const ticket1 = await createTicket('Ticket-1', 10)
    const ticket2 = await createTicket('Ticket-2', 20)

    const signInUser1 = global.signin();
    const signInUser2 = global.signin();
    const order1 = await global.createOrder(signInUser1, ticket1);
    const order2 = await global.createOrder(signInUser1, ticket2);


    // Make request to get order for user #2
    const response = await request(app)
        .get(`/api/orders/${order2.id}`)
        .set('Cookie', signInUser1.cookie)
        .expect(200);

    expect(response.body.id).toEqual(order2.id);
});

it('return an error if one user tries to fetch another user', async () => {
    const ticket1 = await createTicket('Ticket-1', 10)
    const ticket2 = await createTicket('Ticket-2', 20)

    const signInUser1 = global.signin();
    const signInUser2 = global.signin();
    const order1 = await global.createOrder(signInUser1, ticket1);
    const order2 = await global.createOrder(signInUser1, ticket2);


    // Make request to get order for user #2
    const response = await request(app)
        .get(`/api/orders/${order2.id}`)
        .set('Cookie', signInUser2.cookie)
        .expect(401);
});

it('return not found', async () => {
    const fakeOrderId = new mongoose.Types.ObjectId().toHexString();
    const signInUser1 = global.signin();

    // Make request to get order for user #2
    const response = await request(app)
        .get(`/api/orders/${fakeOrderId}`)
        .set('Cookie', signInUser1.cookie)
        .expect(404);
});