import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { TimeSeriesPoint } from "../../types/dashboard";

interface DrilldownChartProps {
  data: TimeSeriesPoint[];
  color: string;
  title: string;
  format?: (v: number) => string;
}

export function DrilldownChart({
  data,
  color,
  title,
  format = (v) => v.toLocaleString(),
}: DrilldownChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-surface-0 rounded-xl border border-surface-200 p-6"
    >
      <h3 className="text-[0.9375rem] font-semibold text-surface-900 mb-1">
        {title}
      </h3>
      <p className="text-sm text-surface-600 mb-5">Last 30 days</p>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="drilldownGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={0.12} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-surface-200)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: "var(--color-surface-600)" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: "var(--color-surface-600)" }}
              tickFormatter={format}
              dx={-8}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid var(--color-surface-200)",
                borderRadius: 8,
                fontSize: 14,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                backgroundColor: "var(--color-surface-0)",
                color: "var(--color-surface-900)",
              }}
              formatter={(value) => [format(Number(value)), "Value"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill="url(#drilldownGradient)"
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "var(--color-surface-0)",
                fill: color,
              }}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
