import React, { ReactElement } from "react";
import { TooltipProps } from "recharts";
import { ResponsiveContainer } from "recharts";

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface ChartContainerProps {
  config: ChartConfig;
  children: ReactElement;
}

export function ChartContainer({ config, children }: ChartContainerProps) {
  return (
    <div className="w-full h-[137px]">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

interface ChartTooltipContentProps extends TooltipProps<any, any> {
  hideLabel?: boolean;
}

export function ChartTooltipContent({
  active,
  payload,
  hideLabel = false,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {!hideLabel && (
              <span className="font-medium">{item.name}:</span>
            )}
            <span>Rp {item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartTooltip(props: any) {
  return <ChartTooltipContent {...props} />;
} 