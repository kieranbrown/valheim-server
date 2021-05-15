import { App, Stack, StackProps } from '@aws-cdk/core';
import { ValheimWorld } from 'cdk-valheim';

export class ValheimStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new ValheimWorld(this, 'ValheimWorld', {
      cpu: 2048,
      memoryLimitMiB: 4096,
      schedules: [{
        start: { hour: '18', weekDay: '5' },
        stop: { hour: '1', weekDay: '1' },
      }],
      environment: {
        SERVER_NAME: 'Gamers - Friend Finder',
        WORLD_NAME: 'Gamers',
        SERVER_PASS: process.env.SERVER_PASS!,
        BACKUPS: 'true',
      },
    });
  }
}
