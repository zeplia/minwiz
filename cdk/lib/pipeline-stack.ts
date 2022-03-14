import { App, SecretValue, Stack, StackProps } from "aws-cdk-lib";
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
} from "aws-cdk-lib/aws-codepipeline-actions";

export interface PipelineStackProps extends StackProps {
  readonly githubToken: string;
}

export class PipelineStack extends Stack {
  constructor(app: App, id: string, props: PipelineStackProps) {
    super(app, id, props);

    const siteBuild = new PipelineProject(this, "SiteBuild", {
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

    new Pipeline(this, "Pipeline", {
      restartExecutionOnUpdate: true,
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
      ],
    });
  }
}
