import { OrderCancelledEvent, OrderStatus } from "@thundertickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from '../order-cancelled-listener'


it('updates orderId to ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();

    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }



    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    // console.log(updatedTicket);
    expect(updatedTicket?.orderId).toBeUndefined();
    expect(msg.ack).toHaveBeenCalled();
})

it('publishes a ticket update event', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();

    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(ticketUpdatedData.id).toEqual(ticket.id);
});