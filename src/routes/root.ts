import { type FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', async function (_request, _reply) {
    return { root: true };
  });

  fastify.get('/ping', async function (_request, reply) {
    return reply.code(204).send();
  });
};

export default root;
