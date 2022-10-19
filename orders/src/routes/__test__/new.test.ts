import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@thundertickets/common";
import { natsWrapper } from "../../nats-wrapper";

it('returns an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin().cookie)
        .send({ ticketId })
        .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'Test ticket',
        price: 20
    });
    await ticket.save();

    const order = Order.build({
        userId: 'user-id',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket,
    })
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin().cookie)
        .send({ ticketId: ticket.id })
        .expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        title: 'Test ticket',
        price: 20
    });
    await ticket.save();

    expect(await ticket.isReserved()).toBeFalsy();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin().cookie)
        .send({ ticketId: ticket.id })
        .expect(201);

    expect(await ticket.isReserved()).toBeTruthy();
});

it('emits on order created event', async () => {
    const ticket = Ticket.build({
        title: 'Test ticket',
        price: 20
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin().cookie)
        .send({ ticketId: ticket.id })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});