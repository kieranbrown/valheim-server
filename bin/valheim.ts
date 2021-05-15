import { App } from '@aws-cdk/core';
import { ValheimStack } from '../lib/valheim-stack';

const app = new App();

new ValheimStack(app, 'Valheim', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});

app.synth();
