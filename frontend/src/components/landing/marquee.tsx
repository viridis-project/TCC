import { useOffscreenPause } from "./use-offscreen-pause";
import { useContent } from "./use-content";
import { LeafMark } from "./icons";

const COPIES = 4; // com 4 cópias e deslocamento de 25%, o laço é contínuo até em telas ultrawide

export function Marquee() {
  const { marquee } = useContent();
  const ref = useOffscreenPause<HTMLDivElement>();
  if (!marquee.length) return null; // sem palavras, sem faixa
  return (
    <div className="marquee" ref={ref}>
      <p className="sr-only">{marquee.join(", ")}.</p>
      <div className="marquee__track" aria-hidden="true">
        {Array.from({ length: COPIES }, (_, c) => (
          <ul className="marquee__group" key={c} data-copy={c > 0 || undefined}>
            {marquee.map((w, i) => (
              <li key={w} className={i % 2 ? "is-outline" : undefined}>
                <span>{w}</span>
                <LeafMark className="marquee__leaf" width={22} height={22} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
