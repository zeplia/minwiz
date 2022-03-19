import {
  App,
  RemovalPolicy,
  SecretValue,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import {
  BuildSpec,
  ComputeType,
  LinuxBuildImage,
  PipelineProject,
} from "aws-cdk-lib/aws-codebuild";
import { Artifact, Pipeline } from "aws-cdk-lib/aws-codepipeline";
import {
  CodeBuildAction,
  GitHubSourceAction,
  GitHubTrigger,
  S3DeployAction,
} from "aws-cdk-lib/aws-codepipeline-actions";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
} from "aws-cdk-lib/aws-s3";

export interface PipelineStackProps extends StackProps {
  readonly githubToken: string;
  readonly websiteBucket: Bucket;
}

export class PipelineStack extends Stack {
  constructor(app: App, id: string, props: PipelineStackProps) {
    super(app, id, props);

    const siteBuild = new PipelineProject(this, "MinWizBuild", {
      description: "minwiz.com site build",
      buildSpec: BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            commands: ["npm ci"],
          },
          build: {
            commands: "npm run build",
          },
        },
        artifacts: {
          "base-directory": "dist",
          files: ["**/*"],
        },
      }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_5_0,
        computeType: ComputeType.SMALL,
      },
    });

    const siteBuildOutput = new Artifact("SiteBuildOutput");

    const sourceOutput = new Artifact("SrcOutput");

    const artifactBucket = new Bucket(this, "MinWizPipelineArtifacts", {
      removalPolicy: RemovalPolicy.DESTROY,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
    });

    new Pipeline(this, "MinWiz", {
      restartExecutionOnUpdate: true,
      artifactBucket,
      stages: [
        {
          stageName: "Source",
          actions: [
            new GitHubSourceAction({
              actionName: "Checkout",
              output: sourceOutput,
              owner: "zeplia",
              repo: "minwiz",
              oauthToken: SecretValue.plainText(props.githubToken),
              trigger: GitHubTrigger.WEBHOOK,
            }),
          ],
        },
        {
          stageName: "Build",
          actions: [
            new CodeBuildAction({
              actionName: "Site_Build",
              project: siteBuild,
              input: sourceOutput,
              outputs: [siteBuildOutput],
            }),
          ],
        },
        {
          stageName: "Deploy",
          actions: [
            new S3DeployAction({
              actionName: "DeployStaticSite",
              input: siteBuildOutput,
              bucket: props.websiteBucket,
            }),
          ],
        },
      ],
    });
  }
}
