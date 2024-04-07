import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import {RemovalPolicy} from 'aws-cdk-lib';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { CloudFrontWebDistribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { S3StorageBucketName, S3WebBucketName } from '../my-react-app/src/commonVariables';

export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket to host the website
    const websiteBucket = new Bucket(this, 'WebsiteBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      bucketName: S3WebBucketName,
    });

    // Deploy the React static website to the S3 bucket
    new BucketDeployment(this, 'WebsiteDeployment', {
      sources: [Source.asset('./my-react-app/build')],
      destinationBucket: websiteBucket,
    });

    // Create an S3 bucket for storage
    const storageBucket = new Bucket(this, 'StorageBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      bucketName: S3StorageBucketName,
    });

    // Create a CloudFront distribution for the website
    const distribution = new CloudFrontWebDistribution(this, 'WebsiteDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: websiteBucket,
            originAccessIdentity: new OriginAccessIdentity(this, 'OriginAccessIdentity'),
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });

    // Store S3 bucket names in AWS SSM parameters
    new ssm.StringParameter(this, 'S3WebBucketNameParam', {
      stringValue: S3WebBucketName,
      parameterName: '/my-app/web-bucket-name',
    });

    new ssm.StringParameter(this, 'S3StorageBucketNameParam', {
      stringValue: S3StorageBucketName,
      parameterName: '/my-app/storage-bucket-name',
    });

    // Output the website URL
    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
