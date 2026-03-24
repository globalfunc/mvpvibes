import { useState } from 'react';

type Step = { num: string; title: string; desc: string };

const CX    = 250;
const CY    = 250;
const R_OUT = 218;
const R_IN  = 118;
const R_MID = (R_OUT + R_IN) / 2;          // 168 — arrow tip / notch radius
const R_LBL = R_IN + (R_OUT - R_IN) * 0.5; // 168 — label radial position

const COLORS = ['#ef4444', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];
const GAP    = 2;  // no gap — left edge of N+1 reuses right edge of N exactly
const DELTA  = 7;  // degrees before end-angle where arc stops before the arrow

function toRad(d: number) { return (d * Math.PI) / 180; }

function pt(r: number, deg: number): [number, number] {
    const a = toRad(deg - 90); // 0° = top, clockwise
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

/**
 * Each segment is a true puzzle piece — the left notch shares the EXACT
 * same boundary line as the previous segment's right arrow:
 *
 *   Shared boundary at angle S (= previous E):
 *     (R_OUT, S-DELTA) → (R_MID, S) → (R_IN, S-DELTA)
 *
 *   This means:
 *   • Segment N's   RIGHT arrow:  outer/inner walls at E-DELTA, tip at R_MID/E
 *   • Segment N+1's LEFT  notch:  outer/inner walls at S-DELTA, tip at R_MID/S
 *
 *   Because E_N ≈ S_{N+1}, both walls are the same line → perfect interlock.
 *   GAP degrees of separation give a clean hairline gap between pieces.
 */
function segPath(i: number, n: number): string {
    const seg = 360 / n;
    const S   = i * seg + GAP / 2;
    const E   = (i + 1) * seg - GAP / 2;

    const [ax, ay] = pt(R_OUT, S - DELTA); // outer arc start (left notch wall)
    const [bx, by] = pt(R_OUT, E - DELTA); // outer arc end   (right arrow wall)
    const [cx, cy] = pt(R_MID, E);         // right arrow tip
    const [dx, dy] = pt(R_IN,  E - DELTA); // inner arc start (right arrow wall)
    const [ex, ey] = pt(R_IN,  S - DELTA); // inner arc end   (left notch wall)
    const [fx, fy] = pt(R_MID, S);         // left notch tip

    return [
        `M ${ax} ${ay}`,                              // outer, left notch wall start
        `A ${R_OUT} ${R_OUT} 0 0 1 ${bx} ${by}`,    // outer arc clockwise
        `L ${cx} ${cy}`,                              // right arrow tip
        `L ${dx} ${dy}`,                              // drop to inner
        `A ${R_IN} ${R_IN} 0 0 0 ${ex} ${ey}`,      // inner arc counter-clockwise
        `L ${fx} ${fy}`,                              // left notch tip
        'Z',                                          // close: notch-tip → outer notch wall start
    ].join(' ');
}

/** Rotate label text so it reads tangentially and never upside-down. */
function labelRotation(midDeg: number): number {
    const r = midDeg > 90 && midDeg < 270 ? midDeg + 180 : midDeg;
    return r % 360;
}

export default function LifecycleDiagram({ steps, defaultActive = 0 }: { steps: Step[]; defaultActive?: number | null }) {
    const [active, setActive] = useState<number | null>(defaultActive);
    const n   = steps.length;
    const seg = 360 / n;

    return (
        <div className="flex flex-col lg:flex-row items-center gap-6">

            {/* ── Wheel ── */}
            <div className="w-full max-w-2xl shrink-0">
                <svg viewBox="0 0 500 500" className="w-full">
                    {steps.map((step, i) => {
                        const midDeg   = i * seg + seg / 2;
                        const rot      = labelRotation(midDeg);
                        const [lx, ly] = pt(R_LBL, midDeg);
                        const on       = active === i;

                        return (
                            <g
                                key={i}
                                onMouseEnter={() => setActive(i)}
                                onMouseLeave={() => setActive(null)}
                                onTouchStart={() => setActive(i === active ? null : i)}
                                className="cursor-pointer"
                            >
                                <path
                                    d={segPath(i, n)}
                                    fill={on ? COLORS[i] : '#232323'}
                                    style={{
                                        transition: 'fill 0.25s ease, filter 0.25s ease',
                                        filter: on
                                            ? `drop-shadow(0 0 12px ${COLORS[i]}55)`
                                            : 'none',
                                    }}
                                />

                                <g transform={`rotate(${rot}, ${lx}, ${ly})`}>
                                    <text
                                        x={lx} y={ly - 11}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fontWeight="800"
                                        letterSpacing="2"
                                        fontFamily="Space Grotesk, sans-serif"
                                        fill={on ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.28)'}
                                        style={{ transition: 'fill 0.25s ease' }}
                                    >
                                        {step.num}
                                    </text>
                                    <text
                                        x={lx} y={ly + 5}
                                        textAnchor="middle"
                                        fontSize="9"
                                        fontWeight="700"
                                        letterSpacing="1.8"
                                        fontFamily="Space Grotesk, sans-serif"
                                        fill={on ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.7)'}
                                        style={{ transition: 'fill 0.25s ease' }}
                                    >
                                        {step.title.toUpperCase()}
                                    </text>
                                </g>
                            </g>
                        );
                    })}

                    {/* Centre label */}
                    <text x={CX} y={CY - 14} textAnchor="middle" fontSize="8"  fontWeight="700" letterSpacing="3" fill="rgba(255,255,255,0.25)" fontFamily="Space Grotesk, sans-serif">THE</text>
                    <text x={CX} y={CY + 3}  textAnchor="middle" fontSize="13" fontWeight="800" letterSpacing="2" fill="rgba(255,255,255,0.7)"  fontFamily="Space Grotesk, sans-serif">MVP VIBES</text>
                    <text x={CX} y={CY + 19} textAnchor="middle" fontSize="8"  fontWeight="700" letterSpacing="3" fill="rgba(255,255,255,0.25)" fontFamily="Space Grotesk, sans-serif">PROCESS</text>
                </svg>
            </div>

            {/* ── Info panel ── */}
            <div className="flex-1 w-full min-h-[160px] flex items-center">
                {active !== null ? (
                    <div
                        className="w-full border border-white/10 p-8 transition-all duration-300"
                        style={{ borderLeftColor: COLORS[active], borderLeftWidth: '3px' }}
                    >
                        <span
                            className="text-xs font-headline uppercase tracking-[0.3em] mb-3 block"
                            style={{ color: COLORS[active] }}
                        >
                            Step {steps[active].num}
                        </span>
                        <h4 className="font-headline font-bold text-2xl text-white mb-3">
                            {steps[active].title}
                        </h4>
                        <p className="text-white/60 text-sm leading-relaxed">
                            {steps[active].desc}
                        </p>
                    </div>
                ) : (
                    <p className="text-white/20 text-xs font-headline uppercase tracking-[0.3em]">
                        Hover a segment to explore
                    </p>
                )}
            </div>
        </div>
    );
}
