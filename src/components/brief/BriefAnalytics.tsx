
import React from 'react';
import { useBriefAnalytics } from '@/hooks/useBriefAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, Loader2 } from 'lucide-react';

interface BriefAnalyticsProps {
  briefId: string;
}

export const BriefAnalytics = ({ briefId }: BriefAnalyticsProps) => {
  const { data, isLoading } = useBriefAnalytics(briefId);

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <CardHeader className="pb-2">
          <CardTitle>Response Analytics</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.responsesOverTime || data.responsesOverTime.length === 0) {
    return (
      <Card className="col-span-3">
        <CardHeader className="pb-2">
          <CardTitle>Response Analytics</CardTitle>
          <CardDescription>No response data available</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground">
          No responses have been submitted yet.
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    responses: {
      label: "Responses",
      color: "#2563eb"
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Response Analytics</CardTitle>
            <CardDescription>
              Responses over time for this brief
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="font-medium">{data.totalResponses}</span>
            <span className="text-muted-foreground">total responses</span>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]" config={chartConfig}>
          <AreaChart data={data.responsesOverTime}>
            <defs>
              <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="count"
              name="responses"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorResponses)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
