#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { CdkStack } from "../lib/cdk-stack";
import { PipelineStack } from "../lib/pipeline-stack";

if (!process.env.GITHUB_TOKEN) {
  console.log("No Github Token present");
}

const app = new cdk.App();
new CdkStack(app, "CdkStack", {});

new PipelineStack(app, "PipelineStack", {
  githubToken: process.env.GITHUB_TOKEN || "",
  env: {
    region: "us-east-1",
  },
});
