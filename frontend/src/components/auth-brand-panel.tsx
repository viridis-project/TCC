import { motion } from "motion/react";
import { Leaf, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthBrandPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  /** Lado da tela em que o painel aparece (define a direção da animação de entrada). */
  side?: "left" | "right";
  className?: string;
};

const LEAVES = [
  { x: 262, y: 128, r: -14, s: 1.25, fill: "#8bc34a", o: 0.3 },
  { x: 272, y: 196, r: 58, s: 1.05, fill: "#c5e9ae", o: 0.2 },
  { x: 268, y: 246, r: -62, s: 1, fill: "#8bc34a", o: 0.22 },
  { x: 286, y: 298, r: 52, s: 0.8, fill: "#c5e9ae", o: 0.18 },
  { x: 282, y: 330, r: -48, s: 0.65, fill: "#8bc34a", o: 0.2 },
];

const ease = [0.22, 1, 0.36, 1] as const;

const content = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

/** Elementos gráficos sutis inspirados em natureza: ramo de folhas, anéis e brilho. */
function NatureDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute -bottom-32 -right-28 h-80 w-80 rounded-full bg-lime/10 blur-2xl" />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/10" />

      <motion.div
        className="absolute -bottom-6 -right-6 w-48 origin-bottom-right sm:w-64 lg:w-[22rem] xl:w-[26rem]"
        animate={{ rotate: [0, 1.6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 360 360" fill="none" className="h-auto w-full">
          <path
            d="M300 360C292 262 284 196 254 124"
            stroke="#c5e9ae"
            strokeOpacity="0.25"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {LEAVES.map((leaf, index) => (
            <g
              key={index}
              transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`}
            >
              <path
                d="M0 0C38-28 48-78 0-122C-48-78-38-28 0 0Z"
                fill={leaf.fill}
                fillOpacity={leaf.o}
              />
              <path
                d="M0-4V-108"
                stroke="#ffffff"
                strokeOpacity="0.18"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
      </motion.div>

      <motion.div
        className="absolute right-[18%] top-[22%] hidden h-5 w-5 rounded-full rounded-bl-none bg-lime/40 lg:block"
        animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function AuthBrandPanel({
  eyebrow,
  title,
  description,
  side = "left",
  className,
}: AuthBrandPanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: side === "left" ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease }}
      className={cn(
        "auth-panel flex flex-col overflow-hidden rounded-b-[2rem] px-6 pb-8 pt-9 sm:px-10 sm:pb-10",
        "lg:min-h-screen lg:justify-between lg:rounded-none lg:p-12 xl:p-16",
        className,
      )}
    >
      <NatureDecor />

      <div className="hidden items-center gap-2 text-sm font-semibold lg:flex">
        <Sprout className="h-5 w-5" aria-hidden="true" /> Viridis
      </div>

      <motion.div className="max-w-xl" variants={content} initial="hidden" animate="show">
        <motion.div
          variants={item}
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mint/80"
        >
          {eyebrow}
        </motion.div>
        <motion.h2
          variants={item}
          className="mt-3 font-display text-[1.75rem] font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:mt-4 lg:text-[2.4rem] xl:text-[2.75rem]"
        >
          {title}
        </motion.h2>
        <motion.p
          variants={item}
          className="mt-4 hidden max-w-md text-sm leading-relaxed text-white/75 sm:block"
        >
          {description}
        </motion.p>
      </motion.div>

      <div className="hidden items-center gap-3 border-t border-white/15 pt-6 text-xs text-white/60 lg:flex">
        <Leaf className="h-4 w-4" aria-hidden="true" /> Educação, cultivo e impacto no mesmo lugar.
      </div>
    </motion.aside>
  );
}
