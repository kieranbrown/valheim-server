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
      // cpu: 2048,
      // memoryLimitMiB: 4096,
      // schedules: [{
      //   start: { hour: '18', weekDay: '5' },
      //   stop: { hour: '1', weekDay: '1' },
      // }],
      environment: {
        ...props.environment,
        BACKUPS: 'true',
      },
      vpc: vpc,
    });
  }
}
