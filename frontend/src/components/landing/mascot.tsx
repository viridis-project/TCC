import { assets } from "./assets";

export type Mood = "greet" | "talk" | "cheer";

/**
 * Mascote oficial do Viridis, com os sprites originais do Showcase (sem redesenho).
 * As "expressões" são a troca entre os dois sprites existentes — apontando (explicando)
 * e animado (saudação/comemoração) — com crossfade suave. O balanço enquanto fala é
 * só transform.
 */
export function Mascot({ mood, talking }: { mood: Mood; talking: boolean }) {
  const happy = mood !== "talk";
  return (
    <div className="mascot" data-mood={mood} data-talking={talking || undefined}>
      <img
        className="mascot__img"
        data-on={!happy || undefined}
        src={assets.brand.mascotPoint}
        width={376}
        height={511}
        alt=""
      />
      <img
        className="mascot__img"
        data-on={happy || undefined}
        src={assets.brand.mascotHappy}
        width={360}
        height={727}
        alt=""
      />
    </div>
  );
}
