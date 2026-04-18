import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface RiskDistributionData {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

interface RiskDistributionChartProps {
  data?: RiskDistributionData;
  isLoading?: boolean;
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ data, isLoading = false }) => {
  const [viewState, setViewState] = useState<'Bar' | 'Donut'>('Bar');

  const chartData = [
    { name: 'Low', value: data?.low || 0, fill: '#16A34A' },
    { name: 'Medium', value: data?.medium || 0, fill: '#D97706' },
    { name: 'High', value: data?.high || 0, fill: '#DC2626' },
    { name: 'Critical', value: data?.critical || 0, fill: '#7F1D1D' },
  ];

  const totalCases = chartData.reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg shadow-lg border border-slate-100 p-3 text-sm px-4">
          <p className="font-semibold text-slate-800">{payload[0].payload.name}</p>
          <p className="text-slate-600">{payload[0].value} case{payload[0].value !== 1 ? 's' : ''}</p>
        </div>
      );
    }
    return null;
  };

  const CustomDonutLabel = ({ viewBox }: any) => {
    const { cx, cy } = viewBox;
    return (
      <g>
        <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="central" alignmentBaseline="middle" className="text-3xl font-black fill-[#0F2557]">
          {totalCases}
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle" dominantBaseline="central" alignmentBaseline="middle" className="text-xs fill-slate-500">
          Total Cases
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-slate-800">Risk Distribution</h3>
          <p className="text-slate-500 text-sm">Open cases by risk level</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setViewState('Bar')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${viewState === 'Bar' ? 'bg-white shadow-sm font-medium text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Bar
          </button>
          <button 
            onClick={() => setViewState('Donut')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${viewState === 'Donut' ? 'bg-white shadow-sm font-medium text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Donut
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[220px]">
        {isLoading ? (
          <div className="w-full h-[220px] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-200 animate-shimmer rounded-xl" />
        ) : totalCases === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <BarChart3 className="w-12 h-12 text-slate-300 mb-2" />
            <p className="text-slate-500 font-medium">No open cases</p>
            <p className="text-slate-400 text-sm">Create your first case to see risk distribution</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              {viewState === 'Bar' ? (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis hide axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ fill: '#F1F5F9' }} content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={800}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={800}
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <CustomDonutLabel />
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              )}
            </ResponsiveContainer>

            {viewState === 'Donut' && (
              <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                {chartData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-sm">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
