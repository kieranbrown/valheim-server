import { App, Stack, StackProps, aws_ec2 } from 'aws-cdk-lib';
import { ValheimWorld } from 'cdk-valheim';

interface ValheimStackProps extends StackProps {
  readonly environment: { [key: string]: string }
}

export class ValheimStack extends Stack {
  constructor(scope: App, id: string, props: ValheimStackProps) {
    super(scope, id, props);

    const vpc = new aws_ec2.Vpc(this, 'VPC', {
      cidr: "10.0.0.0/26",
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 28,
          name: 'public-subnet',
          subnetType: aws_ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 28,
          name: 'private-subnet',
          subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    new ValheimWorld(this, 'ValheimWorld', {
      cpu: 1024,
      memoryLimitMiB: 3072,
      // schedules: [{
      //   start: { hour: '18', weekDay: '5' },
      //   stop: { hour: '1', weekDay: '1' },
      // }],
      environment: {
        ...props.environment,
        BACKUPS: 'true',
        DISCORD_POST_START_MESSAGE: '$SERVER_NAME: Server started on `curl https://ipinfo.io/ip`',
        DISCORD_POST_SHUTDOWN_MESSAGE: '$SERVER_NAME: Server shutdown',
        VALHEIM_LOG_FILTER_CONTAINS_Spawned: 'Got character ZDOID from',
        ON_VALHEIM_LOG_FILTER_CONTAINS_Spawned: '{ read l; l=${l//*ZDOID from /}; l=${l// :*/}; msg="$SERVER_NAME: Player $l spawned into the world"; curl -sfSL -X POST -H "Content-Type: application/json" -d "{\\"username\\":\\"Valheim\\",\\"content\\":\\"$msg\\"}" "$DISCORD_WEBHOOK"; }',
        POST_START_HOOK: 'curl -sfSL -X POST -H "Content-Type: application/json" -d "{\\"username\\":\\"Valheim\\",\\"content\\":\\"$(eval echo $DISCORD_POST_START_MESSAGE)\\"}" "$DISCORD_WEBHOOK"',
        POST_SERVER_SHUTDOWN_HOOK: 'curl -sfSL -X POST -H "Content-Type: application/json" -d "{\\"username\\":\\"Valheim\\",\\"content\\":\\"$(eval echo $DISCORD_POST_SHUTDOWN_MESSAGE)\\"}" "$DISCORD_WEBHOOK"',
      },
      vpc: vpc,
    });
  }
}
