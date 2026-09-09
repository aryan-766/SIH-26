import React from 'react';
import { CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Language } from '../locales';

interface ComparisonRow {
  factor: string;
  values: Record<string, string>;
}

interface ComparisonMatrixProps {
  businesses: any[];
  matrix: ComparisonRow[];
  selectedBizId: string;
  onSelectBiz: (id: string) => void;
  lang?: Language;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  businesses,
  matrix,
  selectedBizId,
  onSelectBiz,
  lang = 'hi'
}) => {
  const isEn = lang === 'en';

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {isEn ? 'Side-by-Side Opportunity Comparison' : 'व्यवसाय तुलना (Side-by-Side Comparison)'}
          </h3>
          <p className="text-[11px] text-slate-500">
            {isEn ? 'Compare demand, capital investment, expected margin and risk' : 'मांग, निवेश, मार्जिन और जोखिम की तुलना करें'}
          </p>
        </div>
      </div>

      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="py-2.5 px-2 font-bold text-slate-500 w-28 bg-slate-50 rounded-l-lg">
              {isEn ? 'Evaluation Metric' : 'पैमाना (Metric)'}
            </th>
            {businesses.map((biz) => {
              const isSelected = selectedBizId === biz.id;
              const displayName = isEn ? biz.name : (biz.name_hi || biz.name);
              return (
                <th
                  key={biz.id}
                  className={`py-2 px-2.5 text-center transition-all ${
                    isSelected ? 'bg-emerald-50 text-emerald-900 font-bold border-b-2 border-emerald-600' : 'text-slate-700'
                  }`}
                >
                  <div className="text-[11px] truncate max-w-[90px] mx-auto font-bold">{displayName}</div>
                  <button
                    onClick={() => onSelectBiz(biz.id)}
                    className={`mt-1 text-[10px] px-2.5 py-0.5 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? (isEn ? 'Selected ✓' : 'चुना गया ✓') : (isEn ? 'Select' : 'चुनें')}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {matrix.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-2.5 px-2 font-medium text-slate-600 bg-slate-50/50">{row.factor}</td>
              {businesses.map((biz) => {
                const val = row.values[biz.id] || '-';
                const isSelected = selectedBizId === biz.id;
                return (
                  <td
                    key={biz.id}
                    className={`py-2.5 px-2 text-center text-[11px] ${
                      isSelected ? 'bg-emerald-50/40 font-semibold text-emerald-950' : 'text-slate-600'
                    }`}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
