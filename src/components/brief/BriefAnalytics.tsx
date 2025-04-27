
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface AnalyticsProps {
  responsesOverTime: {
    date: string;
    count: number;
  }[];
  totalResponses: number;
  averageCompletionTime?: number;
}

export function BriefAnalytics({ responsesOverTime, totalResponses, averageCompletionTime }: AnalyticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{totalResponses}</div>
              </CardContent>
            </Card>
            
            {averageCompletionTime && (
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{averageCompletionTime}m</div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Responses Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ChartContainer className="w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responsesOverTime}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={({ active, payload }) => {
                        if (!active || !payload) return null;
                        return (
                          <ChartTooltip>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <div className="text-sm">{payload[0]?.payload.date}</div>
                              </div>
                              <div className="text-lg font-bold">
                                {payload[0]?.value} responses
                              </div>
                            </div>
                          </ChartTooltip>
                        );
                      }} />
                      <Bar dataKey="count" fill="var(--primary)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
