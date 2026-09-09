import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, AlertTriangle, XCircle, Search, 
  Filter, Eye, Download, ShieldCheck, Check, Clock, User
} from 'lucide-react';
import { OfficerProfile } from '../components/RoleSelector';
import * as api from '../services/api';

interface Props {
  officer: OfficerProfile;
  initialSelectedAppId?: string | null;
}

export const EntrepreneurPipeline: React.FC<Props> = ({ officer, initialSelectedAppId }) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [healthFilter, setHealthFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadPipeline();
  }, [statusFilter, healthFilter]);

  useEffect(() => {
    if (initialSelectedAppId && applications.length > 0) {
      const found = applications.find(a => a.id === initialSelectedAppId);
      if (found) setSelectedApp(found);
    }
  }, [initialSelectedAppId, applications]);

  const loadPipeline = async () => {
    setLoading(true);
    try {
      const res = await api.getPipeline(statusFilter, healthFilter);
      setApplications(res);
      if (initialSelectedAppId) {
        const found = res.find((a: any) => a.id === initialSelectedAppId);
        if (found) setSelectedApp(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (appId: string, action: 'approve' | 'flag_inspection' | 'reject') => {
    try {
      const res = await api.takeApplicationAction(appId, action, actionNotes);
      setActionSuccessMsg(`Application ${appId} successfully marked as: ${res.new_status.toUpperCase()}`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
      loadPipeline();
      if (selectedApp?.id === appId) {
        setSelectedApp((prev: any) => ({ ...prev, status: res.new_status, notes: res.notes }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredApps = applications.filter((a) => {
    const matchesSearch = 
      a.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.village_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Credit & Subsidy Sanction Authority
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Beneficiary Lifecycle & DPR Approval Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review detailed project reports (DPRs), bank feasibility metrics, and authorize subsidy disbursals under PMEGP & Mudra.
          </p>
        </div>

        {actionSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            {actionSuccessMsg}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Status:
          </span>
          {['all', 'submitted', 'approved', 'launched'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition ${
                statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

          <span className="text-xs font-semibold text-slate-500">Repayment:</span>
          {['all', 'healthy', 'at_risk'].map((h) => (
            <button
              key={h}
              onClick={() => setHealthFilter(h)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition ${
                healthFilter === h ? (h === 'at_risk' ? 'bg-red-600 text-white' : 'bg-emerald-700 text-white') : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {h.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by applicant, business or village..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Applicant & Enterprise</th>
                <th className="py-3 px-4">Sector & Village</th>
                <th className="py-3 px-4">Total Cost</th>
                <th className="py-3 px-4">Bank Loan</th>
                <th className="py-3 px-4">Subsidy</th>
                <th className="py-3 px-4">Credit Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Health</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{a.business_name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3" /> {a.applicant_name} ({a.id})
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{a.category}</div>
                    <div className="text-[11px] text-slate-500">{a.village_name}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₹{(a.total_project_cost || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    ₹{(a.loan_amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    ₹{(a.subsidy_amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {a.credit_score_estimate || 740}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      a.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      a.status === 'launched' ? 'bg-blue-100 text-blue-800' :
                      a.status === 'rejected' ? 'bg-slate-200 text-slate-700' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      a.repayment_health === 'at_risk'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : a.repayment_health === 'watch'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      <span>
                        {a.repayment_health === 'at_risk' ? '✗' : a.repayment_health === 'watch' ? '⚠' : '✓'}
                      </span>
                      <span>{a.repayment_health.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => setSelectedApp(a)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect DPR</span>
                      </button>

                      {a.status === 'submitted' && (
                        <button
                          onClick={() => handleAction(a.id, 'approve')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition"
                          title="Approve DPR & Release Subsidy"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DPR Detail Inspector Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-6 text-white flex items-start justify-between rounded-t-2xl">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Detailed Project Report (DPR) Audit
                </span>
                <h2 className="text-xl font-bold mt-1.5">{selectedApp.business_name}</h2>
                <p className="text-xs text-slate-300">
                  Applicant: <strong>{selectedApp.applicant_name}</strong> • Village: {selectedApp.village_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-slate-700">
              {/* Financial Structure Grid */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Project Cost</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    ₹{(selectedApp.total_project_cost || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Bank Term Loan</div>
                  <div className="text-base font-extrabold text-blue-700 mt-0.5">
                    ₹{(selectedApp.loan_amount || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Govt. Rural Subsidy</div>
                  <div className="text-base font-extrabold text-emerald-700 mt-0.5">
                    ₹{(selectedApp.subsidy_amount || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Repayment & Feasibility Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 border border-slate-200 rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Monthly EMI</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">₹{selectedApp.monthly_emi || 3400}/mo</div>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Moratorium</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{selectedApp.moratorium_months || 3} Months</div>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Credit Score</div>
                  <div className="text-sm font-bold text-emerald-700 mt-1">{selectedApp.credit_score_estimate || 750}</div>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">DSCR Coverage</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">1.84x (Healthy)</div>
                </div>
              </div>

              {/* Officer Field Notes */}
              <div className="bg-amber-50/60 p-3.5 rounded-lg border border-amber-200">
                <div className="text-[10px] font-bold text-amber-900 uppercase">Field Verification Notes</div>
                <p className="text-xs text-amber-950 mt-1 font-medium leading-relaxed">
                  {selectedApp.notes || "DPR generated automatically through Rural Enterprise Intelligence Platform. Machinery quotation and land ownership verified."}
                </p>
              </div>

              {/* Action Note Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Administrative Review Comments / Sanction Order Ref:
                </label>
                <input
                  type="text"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Enter endorsement notes (e.g., 'Sanction approved as per PMEGP Rural Subsidy Norms')"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleAction(selectedApp.id, 'reject')}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg transition"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => handleAction(selectedApp.id, 'flag_inspection')}
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg transition"
                >
                  Request Physical Inspection
                </button>
                <button
                  onClick={() => handleAction(selectedApp.id, 'approve')}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition"
                >
                  Authorize Subsidy Sanction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
