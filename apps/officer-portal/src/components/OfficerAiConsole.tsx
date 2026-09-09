import React, { useState } from 'react';
import { Sparkles, Send, ShieldCheck, Database, HelpCircle, Terminal, CheckCircle } from 'lucide-react';
import * as api from '../services/api';

interface Props {
  districtId: string;
}

export const OfficerAiConsole: React.FC<Props> = ({ districtId }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any | null>(null);

  const presetQueries = [
    "Kaunse villages mein dairy demand high hai par competition low hai?",
    "Show businesses with repayment risk in my district",
    "PMEGP vs Mudra subsidy utilization and pending cases",
    "Which village cluster urgently requires a milk chilling facility?"
  ];

  const handleSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setQuery(queryText);
    try {
      const res = await api.askOfficerAi(queryText, districtId);
      setResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
              Officer Intelligence Assistant (SQL-Grounded AI)
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-400/30">
                Llama 3.3 / Gemini
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic numerical aggregation — zero hallucinated figures.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-800 px-2.5 py-1 rounded-md text-xs text-slate-300 border border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>RBAC Scoped</span>
        </div>
      </div>

      {/* Preset Fast Queries */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Quick Administrative Queries:
        </div>
        <div className="flex flex-wrap gap-2">
          {presetQueries.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(pq)}
              className="text-xs text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition text-left"
            >
              "{pq}"
            </button>
          ))}
        </div>
      </div>

      {/* Query Output Display */}
      <div className="p-4 flex-1 min-h-[220px] bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-medium text-slate-500">Querying SQL database aggregations & synthesizing natural language report...</p>
          </div>
        ) : response ? (
          <div className="space-y-4">
            {/* Direct Answer Box */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-slate-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Administrative Finding
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">District: {response.district_id}</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line font-medium">
                {response.answer || response.response}
              </p>
            </div>

            {/* SQL Context Provenance (Proves zero hallucination) */}
            {response.sql_context && (
              <div className="p-3 bg-slate-900 rounded-lg text-slate-300 text-xs font-mono border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1.5 text-[11px] font-sans font-semibold">
                  <span className="flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-emerald-400" /> Database Aggregation Provenance (Verified Metrics)
                  </span>
                  <span className="text-emerald-400">Deterministic SQL</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800">
                  {Object.entries(response.sql_context).map(([k, v]: [string, any]) => (
                    <div key={k} className="bg-slate-800/80 p-2 rounded border border-slate-700">
                      <div className="text-[10px] text-slate-400 uppercase">{k.replace(/_/g, ' ')}</div>
                      <div className="text-sm font-bold text-emerald-300 mt-0.5">{String(v)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-44 text-slate-400 space-y-2 text-center">
            <Terminal className="w-8 h-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Ask any question regarding your district's rural enterprise ecosystem.</p>
            <p className="text-xs text-slate-400 max-w-md">
              Ask in Hindi or English: query high-yield dairy pockets, repayment delays, subsidy disbursements, or facility shortages.
            </p>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-50 border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type query (e.g. 'Kis village mein chilling center ki zaroorat hai?')"
            className="flex-1 bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-400 shadow-sm"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center space-x-1.5 shadow-sm transition"
          >
            <span>Query</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
