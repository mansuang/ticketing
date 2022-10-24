import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'

jest.mock('../nats-wrapper');

declare global {
    var signin: () => { cookie: string[], userId: string };
}

process.env.STRIPE_KEY = 'sk_test_51LwEFKHacTtnL4oa74la2vabe2E7zgmU4MH9dbZKABpGpFnkwV5ovLL1f32CbQk6iTsXZnNGlEYnVbD7y529vNy900tj5S7aaj';
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
