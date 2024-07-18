export class ClientResponse extends Response {
    constructor(body: any, init?: any) {
        super(body, init);
        this.headers.set('Content-Type', 'application/json');
        this.headers.set("Access-Control-Allow-Origin", "*");
        this.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET");
        this.headers.set("Access-Control-Allow-Headers", "Content-Type");
    }
}