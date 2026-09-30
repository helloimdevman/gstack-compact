import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { once } from 'node:events';

/** Local design servers keep their Web Request/Response handlers under Node. */
export async function serveHttp(opts: {
  port: number; hostname: string; fetch: (request: Request) => Response | Promise<Response>;
}) {
  const server = createServer(async (incoming, outgoing) => {
    try {
      const headers = new Headers();
      for (let i = 0; i < incoming.rawHeaders.length; i += 2) headers.append(incoming.rawHeaders[i], incoming.rawHeaders[i + 1]);
      const url = `http://${opts.hostname}:${(server.address() as { port: number }).port}${incoming.url}`;
      const request = new Request(url, {
        method: incoming.method, headers,
        ...(['GET', 'HEAD'].includes(incoming.method ?? 'GET') ? {} : { body: Readable.toWeb(incoming), duplex: 'half' }),
      } as RequestInit);
      const response = await opts.fetch(request);
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body && incoming.method !== 'HEAD') {
        const body = Readable.fromWeb(response.body as any);
        body.on('error', error => outgoing.destroy(error));
        body.pipe(outgoing);
      } else outgoing.end();
    } catch {
      if (!outgoing.headersSent) outgoing.writeHead(500);
      outgoing.end('Internal server error');
    }
  });
  server.listen(opts.port, opts.hostname);
  await once(server, 'listening');
  return { port: (server.address() as { port: number }).port,
    stop: () => { server.close(); server.closeAllConnections(); } };
}
