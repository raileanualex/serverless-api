import { Context, APIGatewayProxyEvent } from "aws-lambda";
import { HelloWorldRepository } from "./HelloWorldRepository";

export class HelloWorld {
    constructor(
        private helloWorldRepository: HelloWorldRepository,
    ) {}

    public async run(payload: APIGatewayProxyEvent, context: Context): Promise<unknown> {
        return this.helloWorldRepository.sayHelloWorld();
    }
}
