import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import Discord from '../discord';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const discord = new Discord(event);

  if (discord.securityVerification() === false) {
    return discord.respond({ content: 'Unauthorized', statusCode: 401 });
  }

  return discord.isPing() ? discord.pong() : discord.handle();
};
