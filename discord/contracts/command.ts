import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { SlashCommandBuilder } from '@discordjs/builders';

import Discord from '../discord';

export default abstract class {
  public abstract readonly name: string;

  public abstract readonly description: string;

  public constructor(protected discord: Discord) { }

  public build(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }

  public abstract handle(): Promise<APIGatewayProxyResultV2>;
}
