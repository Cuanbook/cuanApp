"use client"

import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

const monthNames = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "Mei",
  5: "Jun"
};

interface ChartLineSimpleProps {
  title: string;
  amount: string;
  trend: {
    percentage: number;
    isUp: boolean;
  };
  data: Array<{ month: string; value: number }>;
  shouldAnimate: boolean;
}

export function ChartLineSimple({ title, amount, trend, data, shouldAnimate }: ChartLineSimpleProps) {
  const [key, setKey] = useState(0);
  const [animatedData, setAnimatedData] = useState(data);

  // Reset animation when data changes
  useEffect(() => {
    if (shouldAnimate) {
      // First set all values to 0
      setAnimatedData(data.map(item => ({ ...item, value: 0 })));
      
      // After a brief delay, animate to actual values
      const timer = setTimeout(() => {
        setAnimatedData(data);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      setAnimatedData(data);
    }
  }, [data, shouldAnimate]);

  return (
    <div className="space-y-2">
      <div>
        <h3 className="font-inter text-base font-medium text-[#111611]">{title}</h3>
        <div className="font-inter text-[32px] font-bold text-[#111611]">
          Rp {amount}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-inter text-base text-[#639154]">30 Hari Terakhir</span>
          <span className={`font-inter text-base font-medium ${trend.isUp ? 'text-[#088738]' : 'text-[#FF0505]'}`}>
            {trend.isUp ? '+' : '-'}{Math.abs(trend.percentage)}%
          </span>
        </div>
      </div>

      <div className="h-[148px] w-full" data-testid="chart-line-simple">
        <LineChart
          key={key}
          width={358}
          height={148}
          data={animatedData}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid 
            vertical={false} 
            horizontal={true}
            stroke="#E8EDF5"
            opacity={0.5}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tick={{ 
              fill: '#639154',
              fontSize: 13,
              fontWeight: 'bold',
              fontFamily: 'Inter'
            }}
            tickFormatter={(value) => {
              const [_, month] = value.split('-');
              return monthNames[parseInt(month) - 1 as keyof typeof monthNames];
            }}
          />
          <Line
            type="natural"
            dataKey="value"
            stroke="#54D12B"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4, fill: "#54D12B" }}
            isAnimationActive={true}
            animationDuration={800}
            animationBegin={0}
            animationEasing="ease-out"
          />
        </LineChart>
      </div>
    </div>
  );
} 