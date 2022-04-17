import { APIGatewayProxyResultV2 } from 'aws-lambda';
import Command from '../contracts/command';

export default class extends Command {
  public readonly name: string = 'list-servers';

  public readonly description: string = 'List the available servers';

  public async handle(): Promise<APIGatewayProxyResultV2> {
    const servers = JSON.parse(process.env.VALHEIM_WORLDS);

    const content = servers.map((server, index) => `${index + 1}. ${server.worldName}`).join("\n");

    return this.discord.respond({ content });
  }
}
