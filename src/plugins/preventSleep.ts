import process from 'node:process';
import fp from 'fastify-plugin';

const TEN_MINUTES_IN_MS = 1000 * 60 * 10;

export default fp(async (fastify) => {
  console.log('[preventSleep] NODE_ENV:', process.env.NODE_ENV);

  const sleepPreventionTargetUrl = process.env.MAIN_SERVER_URL;

  if (!sleepPreventionTargetUrl) {
    fastify.log.warn(
      '[preventSleep] Skipped because MAIN_SERVER_URL is not set.',
    );
    return;
  }

  let count = 1;
  console.log('[preventSleep] Fetch:', count++, sleepPreventionTargetUrl);
  fetch(sleepPreventionTargetUrl).catch((error: unknown) => {
    fastify.log.error({ error }, '[preventSleep] Error');
  });

  const interval = setInterval(() => {
    console.log('[preventSleep] Fetch:', count++, sleepPreventionTargetUrl);
    fetch(sleepPreventionTargetUrl).catch((error: unknown) => {
      fastify.log.error({ error }, '[preventSleep] Error');
    });
  }, TEN_MINUTES_IN_MS);

  fastify.addHook('onClose', async () => {
    clearInterval(interval);
  });
});
