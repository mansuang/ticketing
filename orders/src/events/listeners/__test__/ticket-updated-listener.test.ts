import { TicketCreatedEvent, TicketUpdatedEvent } from "@thundertickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async (data: TicketUpdatedEvent['data']) => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg };
};

it('updates a ticket', async () => {
    const initialTicket = await global.createTicket('initial title', 1);

    const { listener, data, msg } = await setup({
        id: initialTicket.id,
        title: 'updated title',
        price: 11,
        version: 1,
        userId: initialTicket.id,
    });

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id);


    expect(initialTicket?.title).toEqual('initial title');
    expect(initialTicket?.price).toEqual(1);
    expect(ticket?.title).toEqual('updated title');
    expect(ticket?.price).toEqual(11);
    expect(msg.ack).toHaveBeenCalled();
});

it('do nothing if incorrect version provided', async () => {
    const initialTicket = await global.createTicket('initial title', 1);

    const { listener, data, msg } = await setup({
        id: initialTicket.id,
        title: 'updated title',
        price: 11,
        version: 2,
        userId: initialTicket.id,
    });

    // call the onMessage function with the data object + message object
    try {
        await listener.onMessage(data, msg);
    } catch (err) { }

    expect(msg.ack).not.toHaveBeenCalled();
});
