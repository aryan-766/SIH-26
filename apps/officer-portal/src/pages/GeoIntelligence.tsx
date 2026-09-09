import React, { useState, useEffect } from 'react';
import { MapPin, Building2, AlertTriangle, Layers, Download, CheckCircle2, Search } from 'lucide-react';
import { GisMapViewer } from '../components/GisMapViewer';
import { OfficerProfile } from '../components/RoleSelector';
import * as api from '../services/api';

interface Props {
  officer: OfficerProfile;
  onSelectApplicationForReview?: (appId: string) => void;
}

export const GeoIntelligence: React.FC<Props> = ({ officer, onSelectApplicationForReview }) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGeoData();
  }, [officer.districtId]);

  const loadGeoData = async () => {
    setLoading(true);
    try {
      const res = await api.getGeoIntelligence(officer.districtId);
      setGeoData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVillages = (geoData?.villages || []).filter((v: any) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Spatial GIS Decision Support System
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">
            District Geo-Intelligence & Facility Radius Radar ({officer.districtName})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            5km & 10km spatial radius mapping of competitor density, bulk milk chilling centers, mandis, and enterprise clusters.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadGeoData}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition"
          >
            Refresh Coordinates
          </button>
        </div>
      </div>

      {/* Interactive Map Component */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <GisMapViewer geoData={geoData} onSelectApplication={(app) => {
          if (onSelectApplicationForReview) onSelectApplicationForReview(app.id);
        }} />
      </div>

      {/* Village Cluster Analysis Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Village Cluster Resource Index</h3>
            <p className="text-xs text-slate-500">Live dairy yield, power availability, and enterprise concentration</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search village or block..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Village Name</th>
                <th className="py-3 px-4">Block Jurisdiction</th>
                <th className="py-3 px-4">Population</th>
                <th className="py-3 px-4">Milk Yield (Daily)</th>
                <th className="py-3 px-4">Power Supply</th>
                <th className="py-3 px-4">Enterprise Feasibility</th>
                <th className="py-3 px-4 text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVillages.map((v: any) => (
                <tr key={v.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {v.name}
                  </td>
                  <td className="py-3 px-4 font-medium">{v.block}</td>
                  <td className="py-3 px-4">{v.population.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-700">{v.milk_yield} L / day</td>
                  <td className="py-3 px-4">{v.power_hours} hrs / day</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      High (Score 88/100)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline">
                      View Local Radar →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
