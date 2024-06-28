import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { HelloWorld } from "./Usecase";
import { HelloWorldAdapter } from "./Adapter";
import { HelloWorldRepository } from "./HelloWorldRepository";

async function initialize(): Promise<HelloWorldAdapter> {
    const helloWorldRepository = new HelloWorldRepository();
    const usecase = new HelloWorld(
        helloWorldRepository
    );

    return new HelloWorldAdapter(usecase);
}

let adapter: HelloWorldAdapter;

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    if (!adapter) {
        adapter = await initialize();
    }
    return adapter.handleEvent(event, context);
}

