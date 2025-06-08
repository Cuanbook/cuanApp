import * as React from "react"
import { type TooltipProps } from "recharts"
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts"

import { cn } from "@/lib/utils"

export interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div className={cn("h-[350px] w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

interface ChartTooltipProps<TData extends object> extends TooltipProps<any, any> {
  content?: React.ReactNode
  className?: string
}

export function ChartTooltip<TData extends object>({
  active,
  payload,
  label,
  content,
  className,
}: ChartTooltipProps<TData>) {
  if (!active || !payload) {
    return null
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-background p-2 shadow-sm",
        className
      )}
    >
      {content ?? (
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {label}
              </span>
            </div>
            <span className="text-[0.70rem] font-bold">
              {payload[0].value}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

interface ChartTooltipContentProps {
  className?: string
  nameKey?: string
  labelFormatter?: (value: string) => string
  hideLabel?: boolean
}

export function ChartTooltipContent({
  className,
  nameKey = "name",
  labelFormatter = (value) => value,
  hideLabel = false,
}: ChartTooltipContentProps) {
  return function Content({
    active,
    payload,
    label,
  }: TooltipProps<any, any>) {
    if (!active || !payload) {
      return null
    }

    return (
      <div
        className={cn(
          "rounded-lg border bg-background p-2 shadow-sm",
          className
        )}
      >
        <div className="grid gap-2">
          {!hideLabel && (
            <div className="flex items-center gap-1">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {labelFormatter(label)}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-1">
            {payload.map(({ value, name, color }) => (
              <div
                key={name}
                className="flex items-center justify-between gap-2 text-[0.70rem]"
              >
                <div className="flex items-center gap-1">
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-muted-foreground">{name}</span>
                </div>
                <span className="font-bold">Rp {value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
} 