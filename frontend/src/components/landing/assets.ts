/** Caminhos de assets da landing (public/landing). Só os derivados otimizados (.webp) foram portados. */
const O = "/landing/opt";
const B = "/landing/brand";
const M = "/landing/medals";

export const assets = {
  brand: {
    logo: `${B}/logo.webp`, // 640×170
    symbol: `${B}/symbol.webp`,
    mascotPoint: `${B}/mascot-point.webp`, // 376×511
    mascotHappy: `${B}/mascot-happy.webp`, // 360×727
  },
  garden: { src: `${O}/garden.webp` },
  sprout: `${O}/sprout.webp`,
  leaves: `${O}/leaves.webp`,
  schedule: `${O}/schedule.webp`,
  medal: (id: string) => `${M}/${id}.webp`,
} as const;
