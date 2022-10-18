import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

it('fetches orders for an particular user', async () => {
    // Create 3 tickets
    const ticket1 = await global.createTicket('Ticket-1', 10)
    const ticket2 = await global.createTicket('Ticket-2', 20)
    const ticket3 = await global.createTicket('Ticket-3', 30)

    // Create one order as user #1
    const signInUser1 = global.signin();
    const order1 = await global.createOrder(signInUser1, ticket1);

    // Create 2 orders as User #2
    const signInUser2 = global.signin();
    const order2 = await global.createOrder(signInUser2, ticket2);
    const order3 = await global.createOrder(signInUser2, ticket3);

    // Make request to get order for user #2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', signInUser2.cookie)
        .expect(200);

    // Make suer we only got the order for user #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(order2.id);
    expect(response.body[1].id).toEqual(order3.id);
});