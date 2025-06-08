"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A line chart"

const chartData = [
  { month: "January", value: 186 },
  { month: "February", value: 305 },
  { month: "March", value: 237 },
  { month: "April", value: 73 },
  { month: "May", value: 209 },
  { month: "June", value: 214 },
]

const chartConfig = {
  value: {
    label: "Total",
    color: "#54D12B",
  },
} satisfies ChartConfig

interface ChartLineDefaultProps {
  title: string;
  data: Array<{ month: string; value: number }>;
  trend: {
    percentage: number;
    isUp: boolean;
  };
  color?: string;
}

export function ChartLineDefault({ title, data = chartData, trend, color = "#54D12B" }: ChartLineDefaultProps) {
  const config = {
    value: {
      label: "Total",
      color: color,
    },
  } satisfies ChartConfig

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="font-inter text-base font-medium text-[#111611]">{title}</CardTitle>
        <CardDescription className="font-inter text-[32px] font-bold text-[#111611]">
          Rp {data.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="value"
              type="natural"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center gap-2 text-sm">
        <span className="font-inter text-base text-[#639154]">30 Hari Terakhir</span>
        <div className="flex items-center gap-1">
          {trend.isUp ? (
            <TrendingUp className="h-4 w-4 text-[#088738]" />
          ) : (
            <TrendingDown className="h-4 w-4 text-[#FF0505]" />
          )}
          <span className={`font-inter text-base font-medium ${trend.isUp ? 'text-[#088738]' : 'text-[#FF0505]'}`}>
            {trend.isUp ? '+' : '-'}{Math.abs(trend.percentage)}%
          </span>
        </div>
      </CardFooter>
    </Card>
  )
} 