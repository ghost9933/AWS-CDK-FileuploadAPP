import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';

import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3'; // Update import statement
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment'; // Update import statement
import { AllowedMethods, Distribution, OriginAccessIdentity, ViewerProtocolPolicy } from '@aws-cdk/aws-cloudfront'; // Update import statement
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins"; // Update import statement

export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createFrontendResources();
  }

  private createFrontendResources() {
    const frontendBucket = this.createS3Bucket();
    this.deployS3Bucket(frontendBucket);
    const s3Origin = this.createOriginAccess(frontendBucket);
    this.createCloudFrontDistribution(s3Origin);
  }

  private createS3Bucket(): Bucket { // Update return type to Bucket
    return new Bucket(this, 'FrontendBucket', {
      bucketName: 'frontend',
      encryption: BucketEncryption.S3_MANAGED,
      publicReadAccess: false
    });
  }

  private deployS3Bucket(frontendBucket: Bucket) { // Update parameter type to Bucket
    new BucketDeployment(this, 'DeployFrontend', {
      sources: [Source.asset('./app')], // Adjust the path if needed
      destinationBucket: frontendBucket
    });
  }

  private createOriginAccess(frontendBucket: Bucket): S3Origin { // Update parameter type to Bucket
    const originAccess = new OriginAccessIdentity(this, 'OriginAccessControl', { comment: 'AWS To-do App OAI' });
    return new S3Origin(frontendBucket, { originAccessIdentity: originAccess });
  }

  private createCloudFrontDistribution(s3Origin: S3Origin): Distribution {
    return new Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: s3Origin,
        viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS
      },
      errorResponses: [
        {
          httpStatus: 403,
          responsePagePath: '/index.html',
          responseHttpStatus: 200
        }
      ],
    });
  }
}
