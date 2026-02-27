"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ScoreChartProps {
  sessions: {
    score: number | null;
    started_at: string;
    type: string;
  }[];
}

export default function ScoreChart({ sessions }: ScoreChartProps) {
  const data = sessions
    .filter((s) => s.score != null)
    .reverse()
    .map((s, i) => ({
      name: `#${i + 1}`,
      score: s.score,
      type: s.type,
    }));

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-bg-secondary p-6">
        <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wide mb-4">
          Andamento Punteggi
        </h3>
        <p className="text-sm text-text-muted">Nessun dato disponibile.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-6">
      <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wide mb-4">
        Andamento Punteggi
      </h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e30" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#4a4a5e", fontSize: 11 }}
              axisLine={{ stroke: "#1e1e30" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#4a4a5e", fontSize: 11 }}
              axisLine={{ stroke: "#1e1e30" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#12121a",
                border: "1px solid #1e1e30",
                borderRadius: "8px",
                fontSize: 12,
                fontFamily: "JetBrains Mono, monospace",
              }}
              labelStyle={{ color: "#7a7a8e" }}
              itemStyle={{ color: "#00d4aa" }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#00d4aa"
              strokeWidth={2}
              fill="url(#scoreGradient)"
              dot={{ fill: "#00d4aa", r: 4 }}
              activeDot={{ r: 6, fill: "#00d4aa" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
