import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { DnsValidatedCertificate } from "aws-cdk-lib/aws-certificatemanager";
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  HttpVersion,
  PriceClass,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { HttpsRedirect } from "aws-cdk-lib/aws-route53-patterns";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { website_domain } from "./variables";

export interface CloudfrontStackProps extends StackProps {
  readonly websiteCert: DnsValidatedCertificate;
  readonly hostedZone: IHostedZone;
}

export class CloudfrontStack extends Stack {
  public readonly websiteBucket: Bucket;

  constructor(scope: Construct, id: string, props: CloudfrontStackProps) {
    super(scope, id, props);

    this.websiteBucket = new Bucket(this, "websiteBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      bucketName: website_domain,
      autoDeleteObjects: true,
    });

    new CfnOutput(this, "websiteBucketArn", {
      value: this.websiteBucket.bucketArn,
    });

    const cachePolicy = new CachePolicy(this, "MinWizPolicy", {
      defaultTtl: Duration.hours(24),
      minTtl: Duration.hours(24),
      maxTtl: Duration.hours(24),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    });

    const distribution = new Distribution(this, "MinWizDistribution", {
      defaultBehavior: {
        origin: new S3Origin(this.websiteBucket),
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy,
        compress: true,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [website_domain /*, `www.${website_domain}`*/],
      certificate: props.websiteCert,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2019,
      defaultRootObject: "index.html",
      enableIpv6: true,
      enabled: true,
      httpVersion: HttpVersion.HTTP2,
      priceClass: PriceClass.PRICE_CLASS_ALL,
    });

    new ARecord(this, "aliasForCloudfront", {
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone: props.hostedZone,
      recordName: website_domain,
    });

    new HttpsRedirect(this, "wwwToNonWww", {
      recordNames: [`www.${website_domain}`],
      targetDomain: website_domain,
      zone: props.hostedZone,
    });
  }
}
