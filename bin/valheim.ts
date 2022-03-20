import { App, Environment } from 'aws-cdk-lib';
import { ValheimStack } from '../lib/valheim-stack';

const app = new App();

const env: Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

new ValheimStack(app, 'GamersValheimStack', {
  env,
  environment: {
    ADMINLIST_IDS: '76561198041195400',
    SERVER_NAME: 'Gamers - Friend Finder',
    SERVER_PASS: process.env.GAMERS_SERVER_PASS!,
    WORLD_NAME: 'Gamers',
  },
});
