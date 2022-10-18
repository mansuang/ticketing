import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import request from "supertest";
import { Ticket, TicketDoc } from '../models/ticket';
import { Order, OrderDoc } from '../models/order';
import { OrderStatus } from '@thundertickets/common';

jest.mock('../nats-wrapper');

interface Signin {
    cookie: string[],
    userId: string
}

declare global {
    var signin: () => Signin;
    var createTicket: (title: string, price: number) => Promise<TicketDoc>;
    var createOrder: (signInUser: Signin, ticket: TicketDoc) => Promise<OrderDoc>;
}


let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf';
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});


global.signin = () => {


    const payload = {
        id: (new mongoose.Types.ObjectId().toHexString()),
        email: 'test@test.com'
    };

    // Generate JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    const session = { jwt: token };

    const sessionJSON = JSON.stringify(session);

    const base64 = Buffer.from(sessionJSON).toString('base64');

    return {
        cookie: [`session=${base64}`],
        userId: payload.id
    };
}

global.createTicket = async (title: string, price: number) => {
    const ticket = Ticket.build({
        title,
        price
    });
    await ticket.save();

    return ticket;
}

global.createOrder = async (signInUser: Signin, ticket: TicketDoc) => {
    const order = Order.build({
        userId: signInUser.userId,
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    });
    await order.save();

    return order;
}