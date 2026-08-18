import process from 'node:process';
import fp from 'fastify-plugin';

const TEN_MINUTES_IN_MS = 1000 * 60 * 10;

const appendPingPath = (serverUrl: string): string =>
  `${serverUrl.replace(/\/+$/, '')}/ping`;

export default fp(async (fastify) => {
  const mainServerUrl = process.env.MAIN_SERVER_URL;
  const subServerUrl = process.env.SUB_SERVER_URL;

  const requestPing = (serverUrl: string): void => {
    fetch(appendPingPath(serverUrl)).catch((error: unknown) => {
      fastify.log.error({ error }, '[preventSleep] Error');
    });
  };

  let count = 1;
  console.log('[preventSleep] Fetch:', count, mainServerUrl, subServerUrl);

  if (mainServerUrl) {
    requestPing(mainServerUrl);
  }
  if (subServerUrl) {
    requestPing(subServerUrl);
  }

  const interval = setInterval(() => {
    console.log('[preventSleep] Fetch:', ++count, mainServerUrl, subServerUrl);

    if (mainServerUrl) {
      requestPing(mainServerUrl);
    }
    if (subServerUrl) {
      requestPing(subServerUrl);
    }
  }, TEN_MINUTES_IN_MS);

  fastify.addHook('onClose', async () => {
    clearInterval(interval);
  });
});
