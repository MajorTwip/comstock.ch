import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type SkillTree = CollectionEntry<'skilltree'>;
type RawNode = SkillTree['data']['nodes'][number];

/** Visual state of a node, in the spirit of a game skill tree. */
export type NodeState = 'done' | 'available' | 'locked';

export interface LaidOutNode {
  id: string;
  title: string;
  desc?: string;
  requires: string[];
  /** Resolved blog href when the linked post is published (preferred language). */
  href?: string;
  state: NodeState;
  /** Centre of the node card, in layout pixels. */
  x: number;
  y: number;
}

export interface SkillLayout {
  nodes: LaidOutNode[];
  edges: { x1: number; y1: number; x2: number; y2: number; done: boolean }[];
  width: number;
  height: number;
  done: number;
  total: number;
}

/** Layout geometry (layout pixels — the SVG/card overlay scrolls if wider than the page). */
const COL_W = 168;
const ROW_H = 116;
const PAD = 40;
const MIN_W = 320;

/**
 * Map of blog slug → which languages have a *published* post.
 * Built once per build and shared across every tree so we don't re-query.
 */
export async function getPublishedSlugs(): Promise<Map<string, Set<Lang>>> {
  const all = await getCollection('blog', (e) =>
    import.meta.env.PROD ? !e.data.draft : true,
  );
  const map = new Map<string, Set<Lang>>();
  for (const e of all) {
    const slug = e.id.split('/')[0];
    const lang = e.data.language as Lang;
    (map.get(slug) ?? map.set(slug, new Set()).get(slug)!).add(lang);
  }
  return map;
}

/** Is a node acquired? Explicit `status` wins; otherwise it's the linked post existing. */
function isDone(node: RawNode, published: Map<string, Set<Lang>>): boolean {
  if (node.status === 'done') return true;
  if (node.status === 'planned') return false;
  return Boolean(node.post && published.has(node.post));
}

/** Best blog href for a node's post in the current language (falls back to the other). */
function hrefFor(
  node: RawNode,
  lang: Lang,
  published: Map<string, Set<Lang>>,
): string | undefined {
  if (!node.post) return undefined;
  const langs = published.get(node.post);
  if (!langs) return undefined;
  const target: Lang = langs.has(lang) ? lang : ([...langs][0] as Lang);
  return `/${target}/blog/${node.post}/`;
}

/**
 * Lay a project's DAG out in downward tiers (roots/foundations on top, the final
 * goal at the bottom). Tier = longest dependency path to a node; a light
 * barycentre pass orders each tier under its parents to reduce edge crossings.
 */
export function layoutTree(
  entry: SkillTree,
  lang: Lang,
  published: Map<string, Set<Lang>>,
): SkillLayout {
  const raw = entry.data.nodes;
  const byId = new Map(raw.map((n) => [n.id, n]));
  const doneSet = new Set(raw.filter((n) => isDone(n, published)).map((n) => n.id));

  // Longest-path depth, guarding against cycles / missing prerequisites.
  const depthCache = new Map<string, number>();
  const depth = (id: string, stack = new Set<string>()): number => {
    if (depthCache.has(id)) return depthCache.get(id)!;
    if (stack.has(id)) return 0; // cycle break
    const node = byId.get(id);
    const reqs = (node?.requires ?? []).filter((r) => byId.has(r));
    stack.add(id);
    const d = reqs.length === 0 ? 0 : 1 + Math.max(...reqs.map((r) => depth(r, stack)));
    stack.delete(id);
    depthCache.set(id, d);
    return d;
  };

  // Group ids into tiers by depth, preserving authoring order within a tier.
  const tiers: string[][] = [];
  for (const n of raw) {
    const d = depth(n.id);
    (tiers[d] ??= []).push(n.id);
  }

  // Order each tier (top → down) by the mean x of its already-placed parents.
  const centerX = new Map<string, number>();
  const maxPerTier = Math.max(1, ...tiers.map((t) => t.length));
  const width = Math.max(MIN_W, maxPerTier * COL_W);

  tiers.forEach((tier, d) => {
    if (d > 0) {
      tier.sort((a, b) => bary(a) - bary(b));
    }
    tier.forEach((id, i) => centerX.set(id, (width * (i + 1)) / (tier.length + 1)));

    function bary(id: string): number {
      const parents = (byId.get(id)?.requires ?? []).filter((r) => centerX.has(r));
      if (!parents.length) return Number.MAX_SAFE_INTEGER; // keep parentless trailing, stable
      return parents.reduce((s, r) => s + centerX.get(r)!, 0) / parents.length;
    }
  });

  const yFor = (d: number) => PAD + d * ROW_H + ROW_H / 2;

  const nodes: LaidOutNode[] = raw.map((n) => {
    const done = doneSet.has(n.id);
    const reqs = n.requires.filter((r) => byId.has(r));
    const ready = reqs.every((r) => doneSet.has(r));
    return {
      id: n.id,
      title: n.title[lang],
      desc: n.desc?.[lang],
      requires: reqs,
      href: hrefFor(n, lang, published),
      state: done ? 'done' : ready ? 'available' : 'locked',
      x: centerX.get(n.id) ?? width / 2,
      y: yFor(depth(n.id)),
    };
  });

  const pos = new Map(nodes.map((n) => [n.id, n]));
  const edges = raw.flatMap((n) =>
    n.requires
      .filter((r) => pos.has(r))
      .map((r) => {
        const from = pos.get(r)!; // prerequisite (upper)
        const to = pos.get(n.id)!; // dependant (lower)
        return { x1: from.x, y1: from.y, x2: to.x, y2: to.y, done: from.state === 'done' };
      }),
  );

  return {
    nodes,
    edges,
    width,
    height: PAD * 2 + tiers.length * ROW_H,
    done: doneSet.size,
    total: raw.length,
  };
}

/** All projects, ordered. */
export async function getSkillTrees(): Promise<SkillTree[]> {
  const all = await getCollection('skilltree');
  return all.sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}
