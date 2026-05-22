import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
  Tooltip,
  ReferenceDot,
} from "recharts";

interface SparklineChartProps {
  data: number[];
  color: string;
  height?: number;
  formatValue?: (v: number) => string;
}

function defaultFormat(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  if (v % 1 !== 0) return v.toFixed(1);
  return String(v);
}

export function SparklineChart({
  data,
  color,
  height = 40,
  formatValue = defaultFormat,
}: SparklineChartProps) {
  const chartData = data.map((value, i) => ({ i, value }));
  const gradientId = `sparkline-${color.replace("#", "")}-${data.length}`;

  const firstVal = data[0];
  const lastVal = data[data.length - 1];
  const lastIdx = data.length - 1;

  const range = Math.max(Math.abs(data[data.length - 1] - data[0]), 1);
  const pad = Math.max(range * 0.15, 1);

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 4, right: 6, bottom: 6, left: 6 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={[`dataMin - ${pad}`, `dataMax + ${pad}`]} hide />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const val = payload[0].value as number;
              return (
                <div className="bg-surface-900 text-surface-0 text-[10px] font-semibold px-2 py-1 rounded-md shadow-lg">
                  {formatValue(val)}
                </div>
              );
            }}
            cursor={false}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 3, fill: color, stroke: "var(--color-surface-0)", strokeWidth: 1.5 }}
            animationDuration={800}
          />
          <ReferenceDot
            x={lastIdx}
            y={lastVal}
            r={3}
            fill={color}
            stroke="var(--color-surface-0)"
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-between mt-1.5 px-0.5">
        <span className="text-[10px] font-medium text-surface-400">
          {formatValue(firstVal)}
        </span>
        <span className="text-[10px] font-semibold" style={{ color }}>
          {formatValue(lastVal)}
        </span>
      </div>
    </div>
  );
}
