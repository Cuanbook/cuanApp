import React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";

interface ChartBarProps {
  data: Array<{
    month: string;
    value: number;
  }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">{`${label}: Rp ${new Intl.NumberFormat('id-ID').format(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export function ChartBar({ data }: ChartBarProps) {
  return (
    <div className="w-full h-[137px]" data-testid="chart-bar">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 3, left: 3, bottom: 0 }}
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
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill="#EBF2E8"
            stroke="#639154"
            strokeWidth={2}
            strokeOpacity={1}
            radius={[4, 4, 0, 0]}
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