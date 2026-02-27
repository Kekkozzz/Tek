"use client";

import { useEffect, useRef, useState } from "react";

interface SkillRadarProps {
    /** Array of { label, value (0-100) } */
    skills: { label: string; value: number }[];
}

export default function SkillRadar({ skills }: SkillRadarProps) {
    const [animated, setAnimated] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 200);
        return () => clearTimeout(timer);
    }, []);

    if (skills.length < 3) {
        return (
            <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wide mb-4">
                    Radar Competenze
                </h3>
                <p className="text-sm text-text-muted">
                    Servono almeno 3 categorie per il radar chart.
                </p>
            </div>
        );
    }

    const size = 260;
    const center = size / 2;
    const maxRadius = size / 2 - 30;
    const angleStep = (2 * Math.PI) / skills.length;

    // Generate concentric rings (20, 40, 60, 80, 100)
    const rings = [20, 40, 60, 80, 100];

    function getPoint(index: number, value: number): { x: number; y: number } {
        const angle = angleStep * index - Math.PI / 2; // Start from top
        const radius = (value / 100) * maxRadius;
        return {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle),
        };
    }

    // Build the data polygon
    const dataPoints = skills.map((s, i) =>
        getPoint(i, animated ? s.value : 0)
    );
    const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ") + " Z";

    // Build axis lines
    const axisEndpoints = skills.map((_, i) => getPoint(i, 100));

    return (
        <div ref={containerRef} className="rounded-xl border border-border bg-bg-secondary p-6">
            <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wide mb-4">
                Radar Competenze
            </h3>
            <div className="flex justify-center">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Concentric rings */}
                    {rings.map((ring) => {
                        const points = skills
                            .map((_, i) => {
                                const p = getPoint(i, ring);
                                return `${p.x},${p.y}`;
                            })
                            .join(" ");
                        return (
                            <polygon
                                key={ring}
                                points={points}
                                fill="none"
                                stroke="var(--color-border)"
                                strokeWidth={1}
                                opacity={0.5}
                            />
                        );
                    })}

                    {/* Axis lines */}
                    {axisEndpoints.map((p, i) => (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={p.x}
                            y2={p.y}
                            stroke="var(--color-border)"
                            strokeWidth={1}
                            opacity={0.3}
                        />
                    ))}

                    {/* Data fill */}
                    <path
                        d={dataPath}
                        fill="rgba(0, 212, 170, 0.15)"
                        stroke="var(--color-accent)"
                        strokeWidth={2}
                        className="transition-all duration-700 ease-out"
                    />

                    {/* Data dots */}
                    {dataPoints.map((p, i) => (
                        <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r={4}
                            fill="var(--color-accent)"
                            className="transition-all duration-700 ease-out"
                        />
                    ))}

                    {/* Labels */}
                    {skills.map((s, i) => {
                        const labelPoint = getPoint(i, 120);
                        const angle = angleStep * i - Math.PI / 2;
                        const textAnchor =
                            Math.abs(Math.cos(angle)) < 0.1
                                ? "middle"
                                : Math.cos(angle) > 0
                                    ? "start"
                                    : "end";
                        return (
                            <text
                                key={i}
                                x={labelPoint.x}
                                y={labelPoint.y}
                                textAnchor={textAnchor}
                                dominantBaseline="central"
                                className="fill-text-secondary"
                                fontSize={10}
                                fontFamily="JetBrains Mono, monospace"
                            >
                                {s.label.length > 12 ? s.label.slice(0, 12) + "…" : s.label}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
