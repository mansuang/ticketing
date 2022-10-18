import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";


it('marks an order as cancelled', async () => {
    // create a ticket with Ticket Model
    const ticket1 = await createTicket('Ticket-1', 10)
    const ticket2 = await createTicket('Ticket-2', 20)

    // make a request to create an order
    const signInUser1 = global.signin();
    const order1 = await global.createOrder(signInUser1, ticket1);
    const order2 = await global.createOrder(signInUser1, ticket2);

    expect(await ticket2.isReserved()).toBeTruthy();
    // make a request to cancel the order
    const response = await request(app)
        .delete(`/api/orders/${order2.id}`)
        .set('Cookie', signInUser1.cookie)
        .expect(204);

    // expectation to make sure the thing is cancelled
    expect(await ticket2.isReserved()).toBeFalsy();
    expect(await ticket1.isReserved()).toBeTruthy();

});


it.todo('emits a order cancelled event');