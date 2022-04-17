import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { APIChatInputApplicationCommandDMInteraction, APIPingInteraction, InteractionType } from 'discord-api-types/v9';
import nacl from 'tweetnacl';

import { ListServers, PingCommand, StartServerCommand, StopServerCommand } from './commands';
import Command from './contracts/command';

type RespondArgs = {
  content?: string;
  statusCode?: number;
  type?: InteractionType;
};

export default class {
  public readonly commands: Command[] = [
    new ListServers(this),
    new PingCommand(this),
    new StartServerCommand(this),
    new StopServerCommand(this),
  ];

  private readonly defaultInteractionType = InteractionType.ApplicationCommandAutocomplete;

  private readonly publicKey: string = process.env.DISCORD_PUBLIC_KEY!;

  public constructor(private readonly event: APIGatewayProxyEventV2 | null = null) { }

  private getEvent(): APIGatewayProxyEventV2 {
    if (this.event === null) {
      throw new Error('Event is not APIGatewayProxyEventV2');
    }

    return this.event;
  }

  private getEventBody(): APIChatInputApplicationCommandDMInteraction | APIPingInteraction {
    const event = this.getEvent();

    if (event.body === undefined || event.body === null) {
      throw new Error('Event body is missing');
    }

    return JSON.parse(event.body);
  }

  public handle(): Promise<APIGatewayProxyResultV2> {
    const body = this.getEventBody();

    const command = this.commands.find((c) => c.name === body.data?.name);

    return command ? command.handle() : this.respond({ content: 'Unknown command :thinking:' });
  }

  public isPing(): boolean {
    const { type } = this.getEventBody();
    return type === InteractionType.Ping;
  }

  public pong = () => this.respond({ type: InteractionType.Ping });

  public async respond({ content, statusCode = 200, type = this.defaultInteractionType }: RespondArgs) {
    return {
      body: JSON.stringify({ type, ...(content ? { data: { content } } : {}) }),
      headers: { 'content-type': 'application/json' },
      statusCode,
    };
  }

  public securityVerification(): boolean {
    const event = this.getEvent();
    const signature = event.headers['x-signature-ed25519'] || '';
    const timestamp = event.headers['x-signature-timestamp'] || '';

    try {
      return nacl.sign.detached.verify(
        Buffer.from(timestamp + JSON.stringify(this.getEventBody())),
        Buffer.from(signature, 'hex'),
        Buffer.from(this.publicKey, 'hex'),
      );
    } catch {
      return false;
    }
  }
}
