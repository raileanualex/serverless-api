
# serverless-api
This repository contains a serverless API demo designed to be easily adaptable for your own AWS environment. To customize this project for your use, follow the steps below:

## Configuration Steps

1. **AWS Account ID and Region in `main.ts`**:
     - Open the `main.ts` file located in the root of the project.
     - Replace the placeholders with your AWS Account ID and the AWS Region you intend to deploy your serverless API to. For example:
         ```typescript
         const awsAccountId = "YOUR_AWS_ACCOUNT_ID";
         const awsRegion = "YOUR_AWS_REGION";
         ```

2. **Configure OpenID Connect (OIDC) for AWS**:
     - In the AWS Management Console, navigate to the IAM service.
     - Go to Identity Providers and choose to create a new OIDC identity provider.
     - For the provider URL and audience, use the values specific to the GitHub Actions setup. You can find detailed instructions on the [AWS documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html) or the GitHub Actions documentation regarding [configuring OpenID Connect in AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services).
     - Once the OIDC provider is set up, create a new role for your GitHub Actions workflows to assume. Attach policies that grant the necessary permissions for deploying and managing your serverless API.

3. **Update GitHub Actions Workflow**:
     - Navigate to the `.github/workflows/main.yml` file.
     - Locate the step that configures AWS credentials using `aws-actions/configure-aws-credentials@v4`.
     - Update the `role-to-assume` parameter with the ARN of the role you created in the previous step. Also, ensure the `aws-region` is set to your target AWS Region.
         ```yaml
         - name: Configure AWS credentials from OIDC
             uses: aws-actions/configure-aws-credentials@v4
             with:
                 role-to-assume: arn:aws:iam::YOUR_AWS_ACCOUNT_ID:role/YOUR_ROLE_NAME
                 aws-region: YOUR_AWS_REGION
         ```

By following these steps, you can adapt the serverless API demo to deploy within your own AWS environment, leveraging the security and flexibility of OIDC for GitHub Actions.