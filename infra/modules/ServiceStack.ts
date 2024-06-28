import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import { FunctionsStack } from './FunctionsStack';
import { RestAPIStack } from './RestAPIStack';

export type ServiceStackProps = cdk.StackProps & {
    label: {
        id: string;
    },
    domainName: string;
};

export class ServiceStack extends cdk.Stack {
    constructor(scope: constructs.Construct, id: string, props: ServiceStackProps) {
        super(scope, id, props);

        const functionsStack = new FunctionsStack(this, id, props);
        
        new RestAPIStack(this, id, {
            ...props,
            helloWorldLambda: functionsStack.helloWorldLambda
        });
    }
}
