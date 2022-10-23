import { OrderCreatedEvent, OrderStatus } from "@thundertickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../../models/ticket";
import { natsWrapper } from "../../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"


it('updates orderId to ticket', async () => {
    const newTicket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await newTicket.save();

    const listener = new OrderCreatedListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const data: OrderCreatedEvent['data'] = {
        id: orderId,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: (new Date).toISOString(),
        version: 0,
        ticket: {
            id: newTicket.id,
            price: newTicket.price
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }



    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(newTicket.id);

    // console.log(updatedTicket);
    expect(newTicket?.orderId).toBeUndefined();
    expect(updatedTicket?.orderId).toEqual(orderId);
    expect(msg.ack).toHaveBeenCalled();
})