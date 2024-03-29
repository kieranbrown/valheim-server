import { App, Environment } from 'aws-cdk-lib';
import { DiscordBotStack } from '../stacks/discord-bot-stack';
import { ValheimStack } from '../stacks/valheim-stack';

const app = new App();

const env: Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const gamersValheimStack = new ValheimStack(app, 'GamersValheimStack', {
  env,
  environment: {
    ADMINLIST_IDS: '76561198041195400',
    DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK!,
    SERVER_NAME: 'Gamers - Friend Finder',
    SERVER_PASS: process.env.GAMERS_SERVER_PASS!,
    WORLD_NAME: 'Gamers',
  },
});

const gamersValheimStackFresh = new ValheimStack(app, 'GamersValheimStackFresh', {
  env,
  environment: {
    ADMINLIST_IDS: '76561198041195400',
    DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK!,
    SERVER_NAME: 'Gamers - Friend Finder (Fresh)',
    SERVER_PASS: process.env.GAMERS_SERVER_PASS!,
    WORLD_NAME: 'GamersFresh',
  },
});

new DiscordBotStack(app, 'DiscordBotStack', {
  env,
  valheimStacks: [gamersValheimStackFresh, gamersValheimStack],
});
