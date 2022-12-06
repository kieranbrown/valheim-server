import { App, Stack, StackProps, aws_iam, aws_lambda_nodejs } from 'aws-cdk-lib';
import * as aws_apigatewayv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import { Trigger } from 'aws-cdk-lib/triggers';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { ValheimStack } from './valheim-stack';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export interface DiscordBotStackProps extends StackProps {
  valheimStacks: ValheimStack[];
}

export class DiscordBotStack extends Stack {
  constructor(scope: App, id: string, props: DiscordBotStackProps) {
    super(scope, id, props);

    const registerCommandsHandler = new aws_lambda_nodejs.NodejsFunction(this, 'RegisterCommandsHandler', {
      entry: 'discord/functions/register-commands.ts',
      environment: {
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID!,
        DISCORD_TOKEN: process.env.DISCORD_TOKEN!,
      },
      logRetention: 7,
      runtime: Runtime.NODEJS_16_X,
    });

    new Trigger(this, 'RegisterCommandsTrigger', {
      handler: registerCommandsHandler,
    });

    const interactionHandler = new aws_lambda_nodejs.NodejsFunction(this, 'InteractionHandler', {
      entry: 'discord/functions/interactions.ts',
      environment: {
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID!,
        DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY!,
        DISCORD_TOKEN: process.env.DISCORD_TOKEN!,
        VALHEIM_WORLDS: JSON.stringify(props.valheimStacks.map(stack => ({
          clusterName: stack.world.service.cluster.clusterName,
          serviceName: stack.world.service.serviceName,
          worldName: stack.stackName,
        }))),
      },
      logRetention: 7,
      runtime: Runtime.NODEJS_16_X,
    });

    interactionHandler.addToRolePolicy(new aws_iam.PolicyStatement({
      actions: ['ecs:UpdateService'],
      resources: props.valheimStacks.map(stack => stack.world.service.serviceArn),
    }));

    const httpApi = new aws_apigatewayv2.HttpApi(this, `${id}HttpApi`);

    httpApi.addRoutes({
      path: '/interactions',
      methods: [aws_apigatewayv2.HttpMethod.POST],
      integration: new HttpLambdaIntegration('InteractionIntegration', interactionHandler),
    });
  }
}
