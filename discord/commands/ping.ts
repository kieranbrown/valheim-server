import { APIGatewayProxyResultV2 } from 'aws-lambda';
import Command from '../contracts/command';

export default class extends Command {
  public readonly name: string = 'ping';

  public readonly description: string = 'Responds with pong!';

  public async handle(): Promise<APIGatewayProxyResultV2> {
    return this.discord.respond({ content: 'Pong!' });
  }
}
