#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { CertificateStack } from "../lib/certificate-stack";
import { CloudfrontStack } from "../lib/cloudfront";
import { PipelineStack } from "../lib/pipeline-stack";

if (!process.env.GITHUB_TOKEN) {
  console.log("No Github Token present");
}

const app = new cdk.App();

const certStack = new CertificateStack(app, "CertificateStack", {
  env: {
    region: "us-east-1",
  },
});

const cloudfrontStack = new CloudfrontStack(app, "CloudfrontStack", {
  websiteCert: certStack.websiteCert,
  hostedZone: certStack.hostedZone,
  env: {
    region: "us-east-1",
  },
});

new PipelineStack(app, "PipelineStack", {
  githubToken: process.env.GITHUB_TOKEN || "",
  websiteBucket: cloudfrontStack.websiteBucket,
  env: {
    region: "us-east-1",
  },
});

app.synth();
