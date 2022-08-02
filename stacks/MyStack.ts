import { StackContext, Api } from "@serverless-stack/resources";

import * as sst from "@serverless-stack/resources";
import * as cdk from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";

const getEnviroment = (args: any) => {
  if (!args) return "develop";
  const jsonNPM: any = JSON.parse(args);
  return jsonNPM["original"][2]; //return stage
};

export default class StackAroundLambdas extends sst.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    // @ts-ignore
    super(scope, id, props);
    const environment = getEnviroment(process.env.npm_config_argv);
    if (!environment) return;
    /* ---------------------------Create Lambda Functions start ------------------------------------------ */
    /*
      Resource Type: AWS::Lambda::Function
      Resource Name: LambdaStori-${enviroment}
      Function Description: This lambda execute stori challenge
    */
    const storiTriggerLambdaResourceName = `LambdaStori-${environment}`;
    const storiTriggerLambdaEntry = "src/index.ts";
    const storiTriggerLambda = new NodejsFunction(
      this,
      storiTriggerLambdaResourceName,
      {
        memorySize: 128,
        timeout: cdk.Duration.seconds(10),
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "handler",
        entry: storiTriggerLambdaEntry,
      }
    );
    new cdk.CfnOutput(this, "lambdaStoriInstanceLambda", {
      value: storiTriggerLambda.functionArn,
    });
  }
}
