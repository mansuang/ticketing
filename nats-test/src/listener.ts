import nats from 'node-nats-streaming'

console.clear();

const stan = nats.connect('ticketing', '123', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    const ticketCreatedChannel = stan.subscribe('ticket:created');

    ticketCreatedChannel.on('message', (msg) => {
        console.log('Message received')
    });
});
