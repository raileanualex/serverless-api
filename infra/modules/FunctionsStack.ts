import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export type ServiceStackProps = cdk.StackProps & {
    label: {
        id: string;
    },
    domainName: string;
};

export class FunctionsStack extends cdk.Stack {
    helloWorldLambda: lambda.Function;
    
    constructor(scope: constructs.Construct, id: string, props: ServiceStackProps) {
        super(scope, `${id}-functions-stack`, props);

        // Create Hello World Lambda function
        this.helloWorldLambda = new nodeLambda.NodejsFunction(this, 'HelloWorldLambda', {
            entry: './service/hello-world/Handler.ts',
            runtime: lambda.Runtime.NODEJS_20_X,
        });
    }
}
