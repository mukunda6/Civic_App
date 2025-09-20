
'use client';

import { useState, useMemo } from 'react';
import type { Issue } from '@/lib/types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { subDays, isAfter } from 'date-fns';

const issueTypes = [
  'All',
  'Garbage & Waste Management Problems',
  'Water Supply Quality',
  'Drainage Issues',
  'Roads, Footpaths & Infrastructure Damage',
  'Streetlights & Electricity Failures',
  'Parks, Trees & Environmental Concerns',
  'Illegal Constructions & Encroachments',
  'Stray Animals & Public Health Hazards',
  'Sanitation & Toiletry Issues',
  'Mosquito Control & Fogging',
  'Pipeline Burst',
  'Road Accident',
  'Fire Hazard',
  'Medical Waste',
  'Major Blockage',
];

const timeFrames = [
  { label: 'Last 7 Days', value: '7' },
  { label: 'Last 30 Days', value: '30' },
  { label: 'All Time', value: 'all' },
];

const cityColors: Record<string, string> = {
  'New York': '#8884d8',
  'Los Angeles': '#82ca9d',
  // Add more cities and colors as needed
};

export function CityIssueChart({ allIssues }: { allIssues: Issue[] }) {
  const [selectedIssueType, setSelectedIssueType] = useState('All');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('all');

  const filteredData = useMemo(() => {
    let issues = allIssues;

    // Filter by time frame
    if (selectedTimeFrame !== 'all') {
      const days = parseInt(selectedTimeFrame, 10);
      const dateLimit = subDays(new Date(), days);
      issues = issues.filter(issue => isAfter(new Date(issue.submittedAt), dateLimit));
    }

    // Filter by issue type
    if (selectedIssueType !== 'All') {
      issues = issues.filter(issue => issue.category === selectedIssueType);
    }

    // Group by city and count issues
    const cityCounts = issues.reduce((acc, issue) => {
      const city = issue.location.city;
      if (!acc[city]) {
        acc[city] = { name: city, count: 0 };
      }
      acc[city].count++;
      return acc;
    }, {} as Record<string, { name: string, count: number }>);

    const sortedCities = Object.values(cityCounts).sort((a, b) => b.count - a.count);
    
    // Assign distinct colors to top cities
    const chartData = sortedCities.map((cityData, index) => {
      let color = cityColors[cityData.name];
      if (!color) {
        // Fallback colors for unassigned cities
        const colors = ['#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF8042'];
        color = colors[index % colors.length];
      }
      return { ...cityData, fill: color };
    });

    return chartData;

  }, [allIssues, selectedIssueType, selectedTimeFrame]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Select value={selectedIssueType} onValueChange={setSelectedIssueType}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Filter by issue type..." />
          </SelectTrigger>
          <SelectContent>
            {issueTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedTimeFrame} onValueChange={setSelectedTimeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by time..." />
          </SelectTrigger>
          <SelectContent>
            {timeFrames.map(frame => (
              <SelectItem key={frame.value} value={frame.value}>
                {frame.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={filteredData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip
                contentStyle={{
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                }}
            />
            <Legend />
            <Bar dataKey="count" name="Issue Count" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
