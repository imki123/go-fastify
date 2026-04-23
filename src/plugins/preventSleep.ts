import process from 'node:process';
import fp from 'fastify-plugin';

const TEN_MINUTES_IN_MS = 1000 * 60 * 10;

export default fp(async (fastify) => {
  const mainServerUrl = process.env.MAIN_SERVER_URL;
  const subServerUrl = process.env.SUB_SERVER_URL;

  let count = 1;
  console.log('[preventSleep] Fetch:', count, mainServerUrl, subServerUrl);

  if (mainServerUrl) {
    fetch(mainServerUrl).catch((error: unknown) => {
      fastify.log.error({ error }, '[preventSleep] Error');
    });
  }
  if (subServerUrl) {
    fetch(subServerUrl).catch((error: unknown) => {
      fastify.log.error({ error }, '[preventSleep] Error');
    });
  }

  const interval = setInterval(() => {
    console.log('[preventSleep] Fetch:', ++count, mainServerUrl, subServerUrl);

    if (mainServerUrl) {
      fetch(mainServerUrl).catch((error: unknown) => {
        fastify.log.error({ error }, '[preventSleep] Error');
      });
    }
    if (subServerUrl) {
      fetch(subServerUrl).catch((error: unknown) => {
        fastify.log.error({ error }, '[preventSleep] Error');
      });
    }
  }, TEN_MINUTES_IN_MS);

  fastify.addHook('onClose', async () => {
    clearInterval(interval);
  });
});
