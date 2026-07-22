import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee, Hash, Users, BarChart2, Activity } from 'lucide-react';
import { KPI } from '../../services/api/dashboardApi';

interface KPICardProps {
  kpi: KPI;
  index: number;
}

const gradients = [
  { bg: 'from-violet-600 to-indigo-600', light: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-200' },
  { bg: 'from-blue-600 to-cyan-500',    light: 'bg-blue-50',   text: 'text-blue-600',   ring: 'ring-blue-200'   },
  { bg: 'from-emerald-500 to-teal-500', light: 'bg-emerald-50',text: 'text-emerald-600',ring: 'ring-emerald-200' },
  { bg: 'from-orange-500 to-rose-500',  light: 'bg-orange-50', text: 'text-orange-600', ring: 'ring-orange-200'  },
  { bg: 'from-pink-500 to-fuchsia-600', light: 'bg-pink-50',   text: 'text-pink-600',   ring: 'ring-pink-200'   },
  { bg: 'from-amber-500 to-yellow-400', light: 'bg-amber-50',  text: 'text-amber-600',  ring: 'ring-amber-200'  },
];

export const KPICard: React.FC<KPICardProps> = ({ kpi, index }) => {
  const g = gradients[index % gradients.length];

  const formatValue = (value: number, format: string) => {
    if (format === 'currency') {
      if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
      if (value >= 100000)   return `₹${(value / 100000).toFixed(2)} L`;
      if (value >= 1000)     return `₹${(value / 1000).toFixed(1)} K`;
      return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
      }).format(value);
    }
    if (format === 'percent') return `${value.toFixed(1)}%`;
    if (value >= 10000000)   return `${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000)     return `${(value / 100000).toFixed(2)} L`;
    if (value >= 1000)       return `${(value / 1000).toFixed(1)} K`;
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);
  };

  const renderIcon = () => {
    const text = (kpi.title + kpi.id).toLowerCase();
    const cls = `w-5 h-5 ${g.text}`;
    if (text.includes('revenue') || text.includes('sales') || text.includes('profit') || text.includes('price'))
      return <IndianRupee className={cls} />;
    if (text.includes('user') || text.includes('customer') || text.includes('client'))
      return <Users className={cls} />;
    if (text.includes('record') || text.includes('total_rows') || text.includes('count'))
      return <Hash className={cls} />;
    if (text.includes('avg') || text.includes('average'))
      return <Activity className={cls} />;
    return <BarChart2 className={cls} />;
  };

  const isPositive = kpi.value >= 0;

  return (
    <div className={`relative bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ${g.ring} hover:shadow-lg transition-all duration-300 group`}>
      {/* Top gradient accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${g.bg}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${g.light} ring-1 ${g.ring} transition-transform group-hover:scale-110`}>
            {renderIcon()}
          </div>
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {kpi.type === 'sum' ? 'Total' : kpi.type === 'average' ? 'Avg' : 'Count'}
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 truncate" title={kpi.title}>
          {kpi.title.replace(/_/g, ' ')}
        </p>
        <p className={`text-2xl font-extrabold text-gray-900 truncate`} title={formatValue(kpi.value, kpi.format)}>
          {formatValue(kpi.value, kpi.format)}
        </p>
      </div>

      {/* Bottom shimmer line on hover */}
      <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${g.bg} transition-all duration-500`} />
    </div>
  );
};
