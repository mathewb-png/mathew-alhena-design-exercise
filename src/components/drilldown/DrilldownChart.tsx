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
      className="bg-white rounded-xl border border-surface-200 p-6"
    >
      <h3 className="text-sm font-semibold text-surface-900 mb-1">{title}</h3>
      <p className="text-xs text-surface-400 mb-4">Last 30 days</p>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="drilldownGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.12} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e4e7f0"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3b0" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3b0" }}
              tickFormatter={format}
              dx={-8}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #e4e7f0",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
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
                stroke: "#fff",
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
