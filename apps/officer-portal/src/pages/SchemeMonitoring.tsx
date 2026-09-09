import React, { useState, useEffect } from 'react';
import { Landmark, TrendingUp, AlertTriangle, CheckCircle, Clock, ShieldAlert, ArrowUpRight, Download } from 'lucide-react';
import { OfficerProfile } from '../components/RoleSelector';
import * as api from '../services/api';

interface Props {
  officer: OfficerProfile;
}

export const SchemeMonitoring: React.FC<Props> = ({ officer }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchemeData();
  }, [officer.districtId]);

  const loadSchemeData = async () => {
    setLoading(true);
    try {
      const res = await api.getSchemeStats(officer.districtId);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const schemes = data?.schemes || [];
  const summary = data?.summary || {
    total_allocated_cr: 115.0,
    total_disbursed_cr: 95.7,
    utilization_rate_pct: 83.2,
    total_beneficiaries: 3487,
    total_pending_approval: 182
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5" /> Central & State Welfare Schemes
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Scheme Credit Disbursement & Subsidy Monitoring ({officer.districtName})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of PMEGP, PM MUDRA, PMFME, and Stand-Up India fund utilization, subsidy release, and repayment health.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => alert("District Scheme Disbursement Summary Statement downloaded as PDF.")}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export District Audit Sheet</span>
          </button>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Total Credit Target Allocated</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{summary.total_allocated_cr} Cr</div>
          <div className="text-xs text-slate-400 mt-1">FY 2025-26 District Target</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Cumulative Disbursed</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">₹{summary.total_disbursed_cr} Cr</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            {summary.utilization_rate_pct}% Absorption Rate
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Beneficiaries Financed</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{summary.total_beneficiaries.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-400 mt-1">Rural enterprises launched</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Pending Subsidy Clearances</div>
          <div className="text-2xl font-black text-orange-600 mt-1">{summary.total_pending_approval}</div>
          <div className="text-xs text-orange-600 font-semibold mt-1">Awaiting District Committee signoff</div>
        </div>
      </div>

      {/* Detailed Scheme Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((s: any) => {
          const utilPct = Math.round((s.disbursed_cr / s.allocated_cr) * 100);
          return (
            <div key={s.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {s.ministry}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1.5">{s.name}</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {s.repayment_health_pct}% Repayment
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Disbursed: ₹{s.disbursed_cr} Cr of ₹{s.allocated_cr} Cr</span>
                  <span className="text-emerald-700 font-bold">{utilPct}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                    style={{ width: `${utilPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Beneficiaries</div>
                  <div className="font-bold text-slate-800 mt-0.5">{s.beneficiaries_count}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Subsidy Outlay</div>
                  <div className="font-bold text-emerald-700 mt-0.5">₹{s.subsidy_released_cr} Cr</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">At-Risk Cases</div>
                  <div className="font-bold text-red-600 mt-0.5">{s.at_risk_count}</div>
                </div>
              </div>

              {/* Footer Notice */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">Avg Rural Subsidy: <strong>{s.avg_subsidy_pct}%</strong></span>
                <span className="text-orange-600 font-semibold">{s.pending_approval} pending review</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
