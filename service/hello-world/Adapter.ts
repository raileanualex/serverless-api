import { APIGatewayResponse, ok } from "@enter-at/lambda-handlers";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { HelloWorld } from "./Usecase";

export class HelloWorldAdapter {
    constructor(private usecase: HelloWorld) {
        this.usecase = usecase;
    }

    async handleEvent(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayResponse> {
        return ok(await this.usecase.run(event, context));
    }
}
