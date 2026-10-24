import { existsSync, lstatSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

/**
 * Next 16 Windows exports can leave backslash-separated RSC segments nested.
 * The client requests dotted names. Add byte-identical aliases without changing
 * the framework, original payloads, ordinary assets, or already-flat exports.
 * See https://github.com/vercel/next.js/issues/85374.
 */
export function normalizeStaticSegments(outputDirectory: string): number {
  const root = resolve(outputDirectory);
  if (!lstatSync(root).isDirectory() || lstatSync(root).isSymbolicLink()) throw new Error('Expected a real static export directory.');
  const aliases = new Map<string, Buffer>();

  function collectSegments(directory: string, routeDirectory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const source = join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Refusing a symbolic link in static segments: ${source}`);
      if (entry.isDirectory()) collectSegments(source, routeDirectory);
      else if (entry.isFile() && entry.name.endsWith('.txt')) {
        const filename = relative(routeDirectory, source).split(sep).join('.');
        const destination = join(routeDirectory, filename);
        const contents = readFileSync(source);
        const previous = aliases.get(destination);
        if (previous && !previous.equals(contents)) throw new Error(`Conflicting static segment aliases: ${destination}`);
        aliases.set(destination, contents);
      }
    }
  }

  function visitRoutes(directory: string) {
    const route = existsSync(join(directory, 'index.html'));
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.isSymbolicLink() || entry.name === '_next') continue;
      const child = join(directory, entry.name);
      if (entry.name.startsWith('__next.')) {
        if (route) collectSegments(child, directory);
      } else visitRoutes(child);
    }
  }
  visitRoutes(root);

  // Check every collision before writing any alias; existing content is never overwritten.
  const pending: [string, Buffer][] = [];
  for (const [destination, contents] of aliases) {
    if (existsSync(destination)) {
      const stat = lstatSync(destination);
      if (!stat.isFile() || stat.isSymbolicLink() || !readFileSync(destination).equals(contents)) {
        throw new Error(`Existing static segment differs: ${destination}`);
      }
    } else pending.push([destination, contents]);
  }
  for (const [destination, contents] of pending) writeFileSync(destination, contents, { flag: 'wx' });
  return pending.length;
}
