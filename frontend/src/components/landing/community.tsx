import { useId, useState } from "react";
import { assets } from "./assets";
import { useContent } from "./use-content";
import { useCarousel } from "./use-carousel";
import { relativeTime, useInstagramPosts, type InstagramPost } from "./instagram";
import { ChevronLeftIcon, ChevronRightIcon, ExternalIcon, PhotoIcon, PlayIcon } from "./icons";
import { Reveal } from "./reveal";

const isProfileUrl = (u?: string): u is string => !!u && /^https:\/\/(www\.)?instagram\.com\//i.test(u);

const TYPE_LABEL: Record<NonNullable<InstagramPost["type"]>, string> = {
  image: "Post",
  video: "Vídeo",
  carousel: "Álbum",
};

function PostCard({ post }: { post: InstagramPost }) {
  const [broken, setBroken] = useState(false);
  const type = post.type ?? "image";
  const when = relativeTime(post.timestamp);
  return (
    <li className="igcard">
      <a
        className="igcard__link"
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        aria-label={post.caption ? undefined : "Ver publicação no Instagram"}
      >
        <figure className="igcard__media">
          {broken ? (
            <span className="igcard__fallback" aria-hidden="true">
              <img src={assets.brand.symbol} alt="" width={120} height={120} />
            </span>
          ) : (
            <img
              src={post.image}
              alt={post.alt ?? ""}
              loading="lazy"
              decoding="async"
              draggable={false}
              onError={() => setBroken(true)}
            />
          )}
          <span className="igcard__badge">
            {type === "video" ? <PlayIcon width={12} height={12} /> : <PhotoIcon width={12} height={12} />}
            {TYPE_LABEL[type]}
          </span>
          {post.sample && <span className="igcard__sample">Exemplo de layout</span>}
        </figure>
        <div className="igcard__body">
          <p className="igcard__cap">{post.caption || "Publicação do Instagram"}</p>
          <div className="igcard__foot">
            <time dateTime={post.timestamp}>{when ?? "Instagram"}</time>
            <span className="igcard__view">
              Ver no Instagram
              <ExternalIcon width={14} height={14} />
              <span className="sr-only"> (abre em nova aba)</span>
            </span>
          </div>
        </div>
      </a>
    </li>
  );
}

/** Cards "em breve": deixam claro que ainda não há publicações — nada fictício como se fosse oficial. */
function Placeholders({ busy }: { busy?: boolean }) {
  return (
    <ul className="igreel igreel--static" aria-hidden="true" aria-busy={busy}>
      {[0, 1, 2, 3].map((i) => (
        <li className="igcard igcard--ph" key={i}>
          <div className="igcard__media">
            <span className="igcard__fallback">
              <img src={assets.brand.symbol} alt="" width={120} height={120} />
            </span>
            <span className="igcard__badge">{busy ? "Carregando" : "Em breve"}</span>
          </div>
          <div className="igcard__body">
            <span className="igcard__bar" />
            <span className="igcard__bar igcard__bar--s" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Community() {
  const { instagram } = useContent();
  const { status, posts } = useInstagramPosts(instagram.feedUrl, instagram.posts);
  const { track, thumb, edge, go, onPointerDown, onClickCapture } = useCarousel<HTMLUListElement>(status === "ready" ? posts.length : 0);
  const id = useId();
  const profile = isProfileUrl(instagram.profileUrl) ? instagram.profileUrl : undefined;

  const lead =
    status === "ready"
      ? "Acompanhe as publicações mais recentes do Viridis."
      : status === "error"
        ? "Não foi possível carregar as publicações agora. Tente novamente mais tarde."
        : status === "loading"
          ? "Carregando as publicações mais recentes."
          : "As publicações do Viridis vão aparecer aqui.";

  return (
    <section id="comunidade" className="section ach ig" aria-labelledby="ig-title">
      <div className="ach__bg" aria-hidden="true" />
      <div className="wrap">
        <Reveal className="ach__head">
          <p className="eyebrow eyebrow--ondark">
            <span className="eyebrow__n">06</span>
            <span className="eyebrow__rule" />
            Comunidade
          </p>
          <h2 id="ig-title" className="h2">
            Viridis no Instagram
          </h2>
          <p className="ig__lead" role="status">
            {lead}
          </p>
          {profile && (
            <a className="btn btn--ghost" href={profile} target="_blank" rel="noopener noreferrer">
              {instagram.handle ? `Seguir ${instagram.handle}` : "Ver perfil no Instagram"}
              <ExternalIcon width={16} height={16} />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          )}
        </Reveal>

        {status === "ready" && posts.length > 0 ? (
          <Reveal className="ig__car" role="region" aria-roledescription="carousel" aria-label="Publicações do Instagram" delay={80}>
            <ul
              ref={track}
              id={id}
              className="igreel"
              onPointerDown={onPointerDown}
              onClickCapture={onClickCapture}
            >
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </ul>
            <div className="igctl">
              <div className="igprog" aria-hidden="true">
                <span ref={thumb} />
              </div>
              <div className="igbtns">
                <button
                  type="button"
                  className="igbtn"
                  aria-label="Publicações anteriores"
                  aria-controls={id}
                  aria-disabled={edge.start}
                  onClick={() => !edge.start && go(-1)}
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  className="igbtn"
                  aria-label="Próximas publicações"
                  aria-controls={id}
                  aria-disabled={edge.end}
                  onClick={() => !edge.end && go(1)}
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal className="ig__soon" delay={80}>
            <Placeholders busy={status === "loading"} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
