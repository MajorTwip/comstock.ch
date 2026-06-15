import { visit } from 'unist-util-visit';

/**
 * Remark plugin for Obsidian-style image embeds: `![[file.png]]` or `![[folder/file.png]]`.
 *
 * Posts live in `src/content/blog/<slug>/{de,en}.mdx` with images co-located in
 * `src/content/blog/<slug>/assets/`. Any embed is resolved to `./assets/<basename>`
 * (the folder prefix Obsidian sometimes adds is stripped), producing a relative image
 * node that Astro's asset pipeline then optimizes.
 *
 * This preserves writing posts in Obsidian with `![[...]]` syntax.
 */
const EMBED = /!\[\[([^\]]+)\]\]/g;

export default function remarkObsidian() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null) return;
      const value = node.value;
      if (!value.includes('![[')) return;

      const parts = [];
      let last = 0;
      let m;
      EMBED.lastIndex = 0;
      while ((m = EMBED.exec(value)) !== null) {
        if (m.index > last) {
          parts.push({ type: 'text', value: value.slice(last, m.index) });
        }
        const target = m[1].split('|')[0].trim(); // ignore optional `|alt`
        // Match the migration's safeBase(): decode %xx and replace spaces with `-`.
        const base = decodeURIComponent(target.split('/').pop()).replace(/\s+/g, '-');
        parts.push({
          type: 'image',
          url: `./assets/${base}`,
          alt: base.replace(/\.[^.]+$/, ''),
        });
        last = m.index + m[0].length;
      }
      if (last < value.length) {
        parts.push({ type: 'text', value: value.slice(last) });
      }

      parent.children.splice(index, 1, ...parts);
    });
  };
}
