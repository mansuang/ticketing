import { randomBytes } from 'crypto';
import nats, { Message } from 'node-nats-streaming'

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    });

    const options = stan.subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('orders-service');

    const ticketCreatedChannel = stan.subscribe(
        'ticket:created',
        'order-service-queue-group',
        options
    );

    ticketCreatedChannel.on('message', (msg: Message) => {
        console.log('Message received', {
            time: new Date(),
            sequence: msg.getSequence(),
            data: msg.getData()
        });

        msg.ack();
    });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
