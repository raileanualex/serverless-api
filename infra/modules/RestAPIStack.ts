import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';

export type ServiceStackProps = cdk.StackProps & {
    label: {
        id: string;
    },
    domainName: string;
    helloWorldLambda: lambda.Function;
};

export class RestAPIStack extends cdk.Stack {
    constructor(scope: constructs.Construct, id: string, props: ServiceStackProps) {
        super(scope, `${id}-rest-api-stack`, props);

        // Create API Gateway
        const api = new apigateway.LambdaRestApi(this, 'APIGateway', {
            handler: props.helloWorldLambda,
            proxy: false,
            restApiName: 'HelloWorldService',
            description: 'This service serves a hello world API.',
            apiKeySourceType: apigateway.ApiKeySourceType.HEADER,
        });

        // Define API Gateway resources and methods
        const textToSpeechResource = api.root.addResource('hello-world');
        textToSpeechResource.addMethod('POST', new apigateway.LambdaIntegration(props.helloWorldLambda), {
            apiKeyRequired: true
        });
        
        const corsOptions: apigateway.CorsOptions = {
            allowOrigins: apigateway.Cors.ALL_ORIGINS,
            allowMethods: apigateway.Cors.ALL_METHODS,
        };

        api.root.addCorsPreflight(corsOptions);

        // Look up or create Route 53 hosted zone
        const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
            domainName: props.domainName,
        });

        const apiKey = new apigateway.ApiKey(this, 'ApiKey');
        const usagePlan = new apigateway.UsagePlan(this, 'UsagePlan', {
            name: 'Usage Plan',
            apiStages: [
            {
                api,
                stage: api.deploymentStage,
            },
            ],
        });

        usagePlan.addApiKey(apiKey);

        const certificate = certificatemanager.Certificate.fromCertificateArn(this, "certificate-arn", "arn:aws:acm:us-east-1:339712871873:certificate/99c73a0e-43a0-4416-9d96-db36e66e29db");

        const originRequestPolicy = new cloudfront.OriginRequestPolicy(this, 'OriginRequestPolicy', {
            headerBehavior: cloudfront.OriginRequestHeaderBehavior.allowList("x-api-key"),
            queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
        });

        // Create CloudFront distribution with SSL/TLS certificate
        const distribution = new cloudfront.Distribution(this, 'CloudFrontDistribution', {
            defaultBehavior: {
                origin: new origins.HttpOrigin(`${api.restApiId}.execute-api.${this.region}.amazonaws.com`, {
                    originPath: `/${api.deploymentStage.stageName}`,
                }),
                cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
                originRequestPolicy: originRequestPolicy, // Use the created origin request policy
            },
            domainNames: [`api.${props.domainName}`],
            certificate: certificate,
        });
        
        // Create DNS record for the CloudFront distribution
        new route53.ARecord(this, 'CloudFrontAliasRecord', {
            zone: hostedZone,
            region: props.env?.region,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            recordName: `api.${props.domainName}`,
        });

        // Output the CloudFront URL
        new cdk.CfnOutput(this, 'CloudFrontURL', {
            value: `https://${distribution.domainName}`,
            description: 'The URL of the CloudFront distribution',
        });

        // Output the DNS URL
        new cdk.CfnOutput(this, 'DNSURL', {
            value: `https://api.${props.domainName}`,
            description: 'The DNS URL for the CloudFront distribution',
        });
    }
}
