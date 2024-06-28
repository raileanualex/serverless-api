export interface Repository {
    sayHelloWorld(): string;
}

export class HelloWorldRepository implements Repository {
    sayHelloWorld(): string {
        return "Hello World";
    }
}
