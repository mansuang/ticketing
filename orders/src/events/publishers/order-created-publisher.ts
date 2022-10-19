import { Publisher, Subjects, OrderCreatedEvent } from "@thundertickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}