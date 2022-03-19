import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { DnsValidatedCertificate } from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import { hostedZoneId, website_domain } from "./variables";

export class CertificateStack extends Stack {
  public readonly websiteCert: DnsValidatedCertificate;
  public readonly hostedZone: IHostedZone;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.hostedZone = HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZoneWithAttrs",
      {
        hostedZoneId,
        zoneName: website_domain,
      }
    );

    this.websiteCert = new DnsValidatedCertificate(this, "MinWizSSL", {
      domainName: website_domain,
      subjectAlternativeNames: [`www.${website_domain}`],
      hostedZone: this.hostedZone,
    });

    new CfnOutput(this, "WebsiteCertArn", {
      value: this.websiteCert.certificateArn,
    });
  }
}
