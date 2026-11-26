const POSES = {
  apresentando: { src: "/brand/mascote-apresentando.webp", width: 376, height: 511 },
  comemorando: { src: "/brand/mascote-comemorando.webp", width: 360, height: 728 },
  cabeca: { src: "/brand/mascote-cabeca.webp", width: 193, height: 310 },
} as const;

export type MascotPose = keyof typeof POSES;

/**
 * Mascote original do Viridis. As imagens vêm dos arquivos enviados pelo projeto
 * (recortadas em cópia, sem redesenho). Use `alt=""` quando for decorativo.
 */
export function Mascot({
  pose,
  alt = "",
  className,
  eager = false,
}: {
  pose: MascotPose;
  alt?: string;
  className?: string;
  eager?: boolean;
}) {
  const p = POSES[pose];
  return (
    <img
      src={p.src}
      width={p.width}
      height={p.height}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={className}
    />
  );
}
