import { App } from '@aws-cdk/core';
import { ValheimStack } from '../lib/valheim-stack';

const app = new App();

new ValheimStack(app, 'Valheim');

app.synth();
