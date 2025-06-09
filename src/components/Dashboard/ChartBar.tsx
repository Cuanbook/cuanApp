import React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";

interface ChartBarProps {
  data: Array<{
    month: string;
    value: number;
  }>;
}

export function ChartBar({ data }: ChartBarProps) {
  return (
    <div className="w-full h-[137px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 0, right: 3, left: 3, bottom: 0 }}
          barGap={0}
        >
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: 13,
              fontFamily: 'Manrope',
              fontWeight: 700,
              fill: '#639154'
            }}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis hide />
          <Bar
            dataKey="value"
            fill="#EBF2E8"
            stroke="#757575"
            strokeWidth={2}
            strokeOpacity={1}
            radius={[0, 0, 0, 0]}
            maxBarSize={45}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 