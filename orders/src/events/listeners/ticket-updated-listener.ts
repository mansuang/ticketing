import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from "@thundertickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new NotFoundError();
        }

        const { id, title, price } = data;
        ticket.set({ id, title, price });

        await ticket.save();

        msg.ack();
    }

}