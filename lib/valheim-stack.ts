import { App, Stack, StackProps } from '@aws-cdk/core';
import { ValheimServer } from '@raykrueger/cdk-valheim-server';

export class ValheimStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new ValheimServer(this, 'Valheim');
  }
}
