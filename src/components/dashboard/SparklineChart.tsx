import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
} from "recharts";

interface SparklineChartProps {
  data: number[];
  color: string;
  height?: number;
}

export function SparklineChart({
  data,
  color,
  height = 40,
}: SparklineChartProps) {
  const chartData = data.map((value, i) => ({ i, value }));
  const gradientId = `sparkline-${color.replace("#", "")}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis domain={["dataMin", "dataMax"]} hide />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
