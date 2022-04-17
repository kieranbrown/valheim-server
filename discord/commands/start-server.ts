import { APIGatewayProxyResultV2 } from 'aws-lambda';
import Command from '../contracts/command';

import { ECS } from 'aws-sdk';

const ecs = new ECS();

export default class extends Command {
  public readonly name: string = 'start-server';

  public readonly description: string = 'Starts the Valheim Server';

  public async handle(): Promise<APIGatewayProxyResultV2> {
    const servers = JSON.parse(process.env.VALHEIM_WORLDS);

    await ecs.updateService({
      cluster: servers[0].clusterName,
      service: servers[0].serviceName,
      desiredCount: 1,
    }).promise();

    return this.discord.respond({ content: 'Starting server!' });
  }
}
