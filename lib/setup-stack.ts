import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { CloudFrontWebDistribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { RemovalPolicy } from 'aws-cdk-lib';

export class MyCdkProjectStack extends cdk.Stack {

      constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
    
        // Create an S3 bucket to host the website
        const websiteBucket = new Bucket(this, 'WebsiteBucket', {
          removalPolicy: RemovalPolicy.DESTROY, // Change to RETAIN if you don't want the bucket to be deleted when the stack is deleted
          websiteIndexDocument: 'index.html',
        //   publicReadAccess: true,
        //   accessControl: BucketAccessControl.PUBLIC_READ
        });
    
        // Deploy the React static website to the S3 bucket
        new BucketDeployment(this, 'WebsiteDeployment', {
          sources: [Source.asset('./my-react-app/build')], // Replace with the path to your React app build directory
          destinationBucket: websiteBucket,
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
    
        // Output the website URL
        new cdk.CfnOutput(this, 'WebsiteURL', {
          value: `https://${distribution.distributionDomainName}`,
        });
      }
    }