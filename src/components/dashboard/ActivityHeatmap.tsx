"use client";

import { useMemo } from "react";

interface DayData {
    date: string;
    count: number;
    avg_score: number;
}

interface ActivityHeatmapProps {
    data: DayData[];
}

export default function ActivityHeatmap({ data }: ActivityHeatmapProps) {
    const { weeks, dataMap, months, totalSessions } = useMemo(() => {
        const dataMap = new Map<string, DayData>();
        let totalSessions = 0;
        for (const d of data) {
            dataMap.set(d.date, d);
            totalSessions += d.count;
        }

        // Generate last 182 days (26 weeks)
        const today = new Date();
        const days: { date: string; isoDow: number; month: number }[] = [];
        for (let i = 181; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const jsDay = d.getDay();
            days.push({
                date: d.toISOString().split("T")[0],
                isoDow: jsDay === 0 ? 6 : jsDay - 1,
                month: d.getMonth(),
            });
        }

        // Group into ISO weeks (starting Monday)
        const weeks: typeof days[] = [];
        let currentWeek: typeof days = [];
        for (const day of days) {
            // Create new week column on Monday
            if (day.isoDow === 0 && currentWeek.length > 0) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            currentWeek.push(day);
        }
        if (currentWeek.length > 0) weeks.push(currentWeek);

        // Calculate month labels positions
        const months: { label: string; offset: number }[] = [];
        let currentMonth = -1;
        weeks.forEach((week, index) => {
            const firstDay = week[0];
            if (firstDay.month !== currentMonth) {
                currentMonth = firstDay.month;
                const monthName = new Date(firstDay.date).toLocaleDateString("it-IT", { month: "short" });
                const label = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                months.push({ label, offset: index });
            }
        });

        return { weeks, dataMap, months, totalSessions };
    }, [data]);

    function getColor(count: number): string {
        if (count === 0) return "var(--color-bg-elevated, #1a1a2e)";
        if (count === 1) return "rgba(0, 212, 170, 0.3)";
        if (count === 2) return "rgba(0, 212, 170, 0.5)";
        if (count <= 4) return "rgba(0, 212, 170, 0.7)";
        return "rgba(0, 212, 170, 0.95)";
    }

    const cellSize = 15;
    const gap = 4;
    const monthHeight = 24;
    const labelWidth = 28;
    const totalWidth = labelWidth + weeks.length * (cellSize + gap);
    const totalHeight = monthHeight + 7 * (cellSize + gap);

    // Day labels: Lun, Mar, Mer, Gio, Ven, Sab, Dom
    const dayLabels = ["L", "M", "M", "G", "V", "S", "D"];

    return (
        <div className="rounded-xl border border-border bg-bg-secondary p-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wide">
                        Attività (Ultimi 6 Mesi)
                    </h3>
                </div>

                {/* Legend inside header for better space usage */}
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-text-muted">Meno</span>
                    {[0, 1, 2, 3, 5].map((n) => (
                        <div
                            key={n}
                            className="h-3.5 w-3.5 rounded-sm"
                            style={{ backgroundColor: getColor(n) }}
                        />
                    ))}
                    <span className="font-mono text-[10px] text-text-muted">Più</span>
                </div>
            </div>

            <div className="overflow-x-auto pb-2 flex justify-center custom-scrollbar">
                <svg width={totalWidth} height={totalHeight} className="block">
                    {/* Month labels */}
                    {months.map((m, i) => (
                        <text
                            key={i}
                            x={labelWidth + m.offset * (cellSize + gap)}
                            y={12}
                            className="fill-text-secondary"
                            fontSize={11}
                            fontFamily="JetBrains Mono, monospace"
                        >
                            {m.label}
                        </text>
                    ))}

                    {/* Day labels (Mon-Sun) */}
                    {dayLabels.map((label, i) =>
                        i % 2 === 0 ? (
                            <text
                                key={i}
                                x={0}
                                y={monthHeight + i * (cellSize + gap) + cellSize - 3}
                                className="fill-text-muted"
                                fontSize={10}
                                fontFamily="JetBrains Mono, monospace"
                            >
                                {label}
                            </text>
                        ) : null
                    )}

                    {/* Cells */}
                    {weeks.map((week, wi) =>
                        week.map((day) => {
                            const d = dataMap.get(day.date);
                            const count = d?.count ?? 0;
                            return (
                                <rect
                                    key={day.date}
                                    x={labelWidth + wi * (cellSize + gap)}
                                    y={monthHeight + day.isoDow * (cellSize + gap)}
                                    width={cellSize}
                                    height={cellSize}
                                    rx={3.5}
                                    fill={getColor(count)}
                                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                >
                                    <title>
                                        {day.date}: {count} session{count !== 1 ? "i" : "e"}
                                        {d && d.avg_score > 0 ? ` — media ${d.avg_score}/100` : ""}
                                    </title>
                                </rect>
                            );
                        })
                    )}
                </svg>
            </div>
        </div>
    );
}
