import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Publisher<T extends Event>{
    abstract subject: T['subject'];
    private client: Stan;

    constructor(client: Stan) {
        this.client = client;
    }

    publish(data: T['data']): Promise<void> {
        return new Promise((resolve, reject) => {
            const d = JSON.stringify(data);
            this.client.publish(this.subject, d, (err) => {
                if (err) {
                    return reject(err);
                }

                console.log('ticket:created Event published with data', d);
                resolve();
            });
        })

    }

}