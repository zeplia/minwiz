import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { DnsValidatedCertificate } from "aws-cdk-lib/aws-certificatemanager";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { website_domain } from "./variables";

export interface CloudfrontStackProps extends StackProps {
  readonly websiteCert: DnsValidatedCertificate;
}

export class CloudfrontStack extends Stack {
  constructor(scope: Construct, id: string, props: CloudfrontStackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, "websiteBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      bucketName: website_domain,
      autoDeleteObjects: true,
    });

    new CfnOutput(this, "websiteBucketArn", {
      value: bucket.bucketArn,
    });
  }
}
