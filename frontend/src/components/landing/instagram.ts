import { useEffect, useState } from "react";

/**
 * Formato de uma publicação. É o contrato entre o site e a fonte de dados real
 * (curadoria manual em config.ts ou um endpoint JSON próprio).
 *
 * Endpoint aceito: `{ "posts": [ ... ] }` ou diretamente `[ ... ]`, com itens:
 *   { id, permalink, image, caption?, timestamp?, type?, alt? }
 * Na Instagram Graph API: id → id, permalink → permalink, image → media_url (ou thumbnail_url
 * para vídeos), caption → caption, timestamp → timestamp, type → media_type.
 */
export type InstagramPost = {
  id: string;
  /** Link da publicação no Instagram (https://www.instagram.com/...). */
  permalink: string;
  /** Imagem da publicação (https:// ou caminho local do site). */
  image: string;
  alt?: string;
  caption?: string;
  /** ISO 8601. */
  timestamp?: string;
  type?: "image" | "video" | "carousel";
  /** Somente desenvolvimento: marca o card como exemplo de layout. */
  sample?: boolean;
};

export type FeedStatus = "loading" | "ready" | "empty" | "error";

const INSTAGRAM_HOST = /^https:\/\/(www\.)?instagram\.com\//i;
const SAFE_IMAGE = /^(https:\/\/|\/)/i;

const TYPE_MAP: Record<string, InstagramPost["type"]> = {
  IMAGE: "image",
  VIDEO: "video",
  CAROUSEL_ALBUM: "carousel",
  image: "image",
  video: "video",
  carousel: "carousel",
};

/** Aceita só o que é seguro de renderizar; descarta o resto sem quebrar a seção. */
export function normalizePosts(input: unknown): InstagramPost[] {
  const list = Array.isArray(input)
    ? input
    : input && typeof input === "object" && Array.isArray((input as { posts?: unknown }).posts)
      ? (input as { posts: unknown[] }).posts
      : [];
  const out: InstagramPost[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const permalink = typeof r.permalink === "string" ? r.permalink : "";
    const image = typeof r.image === "string" ? r.image : typeof r.media_url === "string" ? r.media_url : "";
    if (!INSTAGRAM_HOST.test(permalink) || !SAFE_IMAGE.test(image)) continue;
    out.push({
      id: String(r.id ?? permalink),
      permalink,
      image,
      alt: typeof r.alt === "string" ? r.alt : undefined,
      caption: typeof r.caption === "string" ? r.caption : undefined,
      timestamp: typeof r.timestamp === "string" ? r.timestamp : undefined,
      type: TYPE_MAP[String(r.type ?? r.media_type ?? "")] ?? "image",
      sample: r.sample === true ? true : undefined,
    });
  }
  return out;
}

/** Resolve as publicações: endpoint próprio (se houver) ou a lista fixa. */
export function useInstagramPosts(feedUrl: string | undefined, fixed: InstagramPost[]) {
  const url = feedUrl || undefined;
  const [state, setState] = useState<{ status: FeedStatus; posts: InstagramPost[] }>(() => ({
    status: url ? "loading" : fixed.length ? "ready" : "empty",
    posts: url ? [] : fixed,
  }));

  useEffect(() => {
    if (!url) {
      setState({ status: fixed.length ? "ready" : "empty", posts: fixed });
      return;
    }
    const ctrl = new AbortController();
    setState({ status: "loading", posts: [] });
    fetch(url, { signal: ctrl.signal, headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json) => {
        const posts = normalizePosts(json);
        setState({ status: posts.length ? "ready" : "empty", posts });
      })
      .catch((e) => {
        if ((e as Error).name !== "AbortError") setState({ status: "error", posts: [] });
      });
    return () => ctrl.abort();
  }, [url, fixed]);

  return state;
}

/** "há 3 dias" / "3 days ago" — via Intl, sem biblioteca. */
export function relativeTime(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return undefined;
  const diff = (t - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [u, s] of units) if (Math.abs(diff) >= s) return rtf.format(Math.round(diff / s), u);
  return rtf.format(0, "second");
}
