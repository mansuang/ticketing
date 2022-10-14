import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event>{
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    private client: Stan;
    protected ackWait = 5 * 1000;
    abstract onMessage(data: T['data'], msg: Message): void;


    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setManualAckMode(true)
            .setDeliverAllAvailable()
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const channel = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        channel.on('message', (msg: Message) => {
            const parseData = this.parseMessage(msg);

            console.log('Message received', {
                time: new Date(),
                subject: this.subject,
                queueGroupName: this.queueGroupName,
                sequence: msg.getSequence(),
                data: parseData
            });

            this.onMessage(parseData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf-8'));
    }
}