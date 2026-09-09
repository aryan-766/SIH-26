import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, 
  FileCheck, Clock, ArrowUpRight, BarChart3, RefreshCw, Landmark
} from 'lucide-react';
import * as api from '../services/api';
import { OfficerProfile } from '../components/RoleSelector';
import { OfficerAiConsole } from '../components/OfficerAiConsole';

interface Props {
  officer: OfficerProfile;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<Props> = ({ officer, onNavigateTab }) => {
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadKpis = async () => {
    setLoading(true);
    try {
      const res = await api.getKpis(officer.districtId);
      setKpis(res.kpis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKpis();
  }, [officer.districtId]);

  return (
    <div className="space-y-6">
      {/* Top Banner with Officer Welcome & Refresh */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white shadow-md border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Mission Command Hub</span>
            <span>•</span>
            <span>{officer.districtName}</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Welcome, {officer.name}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            {officer.designation} — Monitoring district entrepreneur discovery, credit delivery under PMEGP & Mudra, and post-launch enterprise repayment health.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadKpis}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-white/20 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Metrics</span>
          </button>
          <button
            onClick={() => onNavigateTab('pipeline')}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <span>Review 46 Pending Cases</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 8 Government KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Entrepreneurs Registered</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {(kpis?.total_entrepreneurs || 12482).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>↑ 8.4%</span>
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>AI Assessments Completed</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {(kpis?.business_assessments || 8921).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="font-semibold text-emerald-700">71.4%</span> conversion from registration
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Feasible DPRs Generated</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {(kpis?.businesses_selected || 6432).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="font-semibold text-purple-700">51.5%</span> ready for bank credit
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Loan Applications Processed</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {(kpis?.loan_applications || 4812).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            PMEGP, Mudra & PMFME
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Businesses Launched</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-2">
            {(kpis?.active_businesses || 3487).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            Module 3 Daily Ledger Active
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>District Repayment Health</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {(kpis?.repayment_health_percent || 91.4)}%
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            Well above state benchmark (88.0%)
          </div>
        </div>

        {/* Card 7 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>At-Risk Watchlist</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600 mt-2">
            {(kpis?.at_risk_businesses || 182).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-red-600 font-medium mt-1">
            Feed inflation & working capital delay
          </div>
        </div>

        {/* Card 8 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pending Officer Approvals</span>
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-orange-600 mt-2">
            {(kpis?.pending_district_approval || 46).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-orange-600 font-semibold mt-1">
            Action required within 48h
          </div>
        </div>
      </div>

      {/* Grid: Sector Distribution & Action Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sector Breakdown & GIS Quick View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Top Rural Enterprise Sectors</h3>
                <p className="text-xs text-slate-500">Distribution of active and sanctioned ventures in {officer.districtName}</p>
              </div>
              <button 
                onClick={() => onNavigateTab('geo')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View GIS Map</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Dairy & Milk Processing (1,420 units)</span>
                  <span className="text-emerald-700 font-bold">40.7%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '40.7%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Agro & Spices Processing (860 units)</span>
                  <span className="text-amber-700 font-bold">24.6%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '24.6%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Poultry & Livestock Hatchery (540 units)</span>
                  <span className="text-blue-700 font-bold">15.5%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '15.5%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Solar & Farm Machinery Repair (395 units)</span>
                  <span className="text-purple-700 font-bold">11.3%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '11.3%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Handloom & Tailoring SHG Clusters (272 units)</span>
                  <span className="text-teal-700 font-bold">7.9%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '7.9%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Officer AI Console */}
          <OfficerAiConsole districtId={officer.districtId} />
        </div>

        {/* Right Col: Urgent Action Alerts & Field Verification Feed */}
        <div className="space-y-6">
          {/* Urgent Review Needed Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 text-orange-600 font-bold text-sm mb-3">
              <Clock className="w-4 h-4" />
              <h3>Pending Administrative Actions</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-orange-50/70 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between text-xs font-bold text-orange-900">
                  <span>DPR Subsidy Clearance</span>
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded">24 pending</span>
                </div>
                <p className="text-xs text-orange-800 mt-1">
                  PMEGP 35% subsidy proposals awaiting district committee approval signature.
                </p>
                <button
                  onClick={() => onNavigateTab('pipeline')}
                  className="mt-2 text-xs font-bold text-orange-800 hover:text-orange-900 underline"
                >
                  Open Approval Queue →
                </button>
              </div>

              <div className="p-3 bg-red-50/70 rounded-lg border border-red-200">
                <div className="flex items-center justify-between text-xs font-bold text-red-900">
                  <span>At-Risk Repayment Alert</span>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">182 units</span>
                </div>
                <p className="text-xs text-red-800 mt-1">
                  Campierganj & Pipraich clusters show EMI payment delays over 15 days.
                </p>
                <button
                  onClick={() => onNavigateTab('geo')}
                  className="mt-2 text-xs font-bold text-red-800 hover:text-red-900 underline"
                >
                  Inspect on GIS Map →
                </button>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>Field Officer Offline Sync</span>
                  <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">Active</span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  Sahjanwa block field officers synced 42 audio-recorded entrepreneur surveys today.
                </p>
              </div>
            </div>
          </div>

          {/* Scheme Allocation Summary Mini Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-600" /> Scheme Disbursement
              </h3>
              <button
                onClick={() => onNavigateTab('schemes')}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                All Schemes →
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Total Sanctioned:</span>
                <span className="font-bold text-slate-900">₹95.70 Cr</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">PMEGP Subsidy Released:</span>
                <span className="font-bold text-emerald-700">₹12.40 Cr</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Mudra Disbursement:</span>
                <span className="font-bold text-slate-900">₹26.80 Cr</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">District Target Achieved:</span>
                <span className="font-bold text-emerald-700">83.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
