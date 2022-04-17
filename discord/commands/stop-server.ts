import { APIGatewayProxyResultV2 } from 'aws-lambda';
import Command from '../contracts/command';

import { ECS } from 'aws-sdk';

const ecs = new ECS();

export default class extends Command {
  public readonly name: string = 'stop-server';

  public readonly description: string = 'Stops the Valheim Server';

  public async handle(): Promise<APIGatewayProxyResultV2> {
    const servers = JSON.parse(process.env.VALHEIM_WORLDS);

    await ecs.updateService({
      cluster: servers[0].clusterName,
      service: servers[0].serviceName,
      desiredCount: 0,
    }).promise();

    return this.discord.respond({ content: 'Stopping server!' });
  }
}
