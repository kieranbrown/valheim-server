import { Handler } from 'aws-lambda';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import Discord from '../discord';

const clientId = process.env.DISCORD_CLIENT_ID!;
const token = process.env.DISCORD_TOKEN!;

const commands = new Discord().commands.map((command) => command.build().toJSON());
const rest = new REST({ version: '9' }).setToken(token);

export const handler: Handler = async () => {
  await rest.put(Routes.applicationCommands(clientId), { body: commands });
};
