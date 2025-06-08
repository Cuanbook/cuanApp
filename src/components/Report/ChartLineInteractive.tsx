import * as React from "react"
import { CartesianGrid, Line, LineChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive line chart"

const chartData = [
  { date: "2024-04-01", pemasukan: 222, pengeluaran: 150 },
  { date: "2024-04-02", pemasukan: 97, pengeluaran: 180 },
  { date: "2024-04-03", pemasukan: 167, pengeluaran: 120 },
  { date: "2024-04-04", pemasukan: 242, pengeluaran: 260 },
  { date: "2024-04-05", pemasukan: 373, pengeluaran: 290 },
  { date: "2024-04-06", pemasukan: 301, pengeluaran: 340 },
  { date: "2024-04-07", pemasukan: 245, pengeluaran: 180 },
  { date: "2024-04-08", pemasukan: 409, pengeluaran: 320 },
  { date: "2024-04-09", pemasukan: 59, pengeluaran: 110 },
  { date: "2024-04-10", pemasukan: 261, pengeluaran: 190 },
  { date: "2024-04-11", pemasukan: 327, pengeluaran: 350 },
  { date: "2024-04-12", pemasukan: 292, pengeluaran: 210 },
  { date: "2024-04-13", pemasukan: 342, pengeluaran: 380 },
  { date: "2024-04-14", pemasukan: 137, pengeluaran: 220 },
  { date: "2024-04-15", pemasukan: 120, pengeluaran: 170 },
  { date: "2024-04-16", pemasukan: 138, pengeluaran: 190 },
  { date: "2024-04-17", pemasukan: 446, pengeluaran: 360 },
  { date: "2024-04-18", pemasukan: 364, pengeluaran: 410 },
  { date: "2024-04-19", pemasukan: 243, pengeluaran: 180 },
  { date: "2024-04-20", pemasukan: 89, pengeluaran: 150 },
  { date: "2024-04-21", pemasukan: 137, pengeluaran: 200 },
  { date: "2024-04-22", pemasukan: 224, pengeluaran: 170 },
  { date: "2024-04-23", pemasukan: 138, pengeluaran: 230 },
  { date: "2024-04-24", pemasukan: 387, pengeluaran: 290 },
  { date: "2024-04-25", pemasukan: 215, pengeluaran: 250 },
  { date: "2024-04-26", pemasukan: 75, pengeluaran: 130 },
  { date: "2024-04-27", pemasukan: 383, pengeluaran: 420 },
  { date: "2024-04-28", pemasukan: 122, pengeluaran: 180 },
  { date: "2024-04-29", pemasukan: 315, pengeluaran: 240 },
  { date: "2024-04-30", pemasukan: 454, pengeluaran: 380 }
]

const chartConfig = {
  views: {
    label: "Total",
  },
  pemasukan: {
    label: "Pemasukan",
    color: "#088738",
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "#FF0505",
  },
} satisfies ChartConfig

export function ChartLineInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("pemasukan")

  const total = React.useMemo(
    () => ({
      pemasukan: chartData.reduce((acc, curr) => acc + curr.pemasukan, 0),
      pengeluaran: chartData.reduce((acc, curr) => acc + curr.pengeluaran, 0),
    }),
    []
  )

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Tren {chartConfig[activeChart].label}</CardTitle>
          <CardDescription>
            30 Hari Terakhir
          </CardDescription>
        </div>
        <div className="flex">
          {["pemasukan", "pengeluaran"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className={`text-lg leading-none font-bold sm:text-3xl ${
                  chart === 'pemasukan' ? 'text-[#088738]' : 'text-[#FF0505]'
                }`}>
                  Rp {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={chartConfig[activeChart].color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 