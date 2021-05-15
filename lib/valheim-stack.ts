import { App, Stack, StackProps } from '@aws-cdk/core';
import { ValheimWorld } from 'cdk-valheim';

export class ValheimStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new ValheimWorld(this, 'ValheimWorld', {
      cpu: 256,
      memoryLimitMiB: 512,
      schedules: [{
        start: { hour: '18', weekDay: '5' },
        stop: { hour: '1', weekDay: '1' },
      }],
      environment: {
        SERVER_NAME: 'CDK Valheim',
        WORLD_NAME: 'Daddies',
        SERVER_PASS: process.env.SERVER_PASS!,
        BACKUPS: 'true',
      },
    });
  }
}
