import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Building2, AlertTriangle, Layers, Filter, CheckCircle2 } from 'lucide-react';

interface Props {
  geoData: {
    district_center: { lat: number; lng: number; zoom: number };
    villages: any[];
    applications: any[];
    facilities: any[];
  } | null;
  onSelectApplication?: (app: any) => void;
}

export const GisMapViewer: React.FC<Props> = ({ geoData, onSelectApplication }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [filterType, setFilterType] = useState<string>('all'); // all, dairy, food, solar, at_risk
  const [showFacilities, setShowFacilities] = useState<boolean>(true);
  const [showVillages, setShowVillages] = useState<boolean>(true);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up if map instance already exists
    if (!mapInstanceRef.current) {
      const center = geoData?.district_center || { lat: 26.7606, lng: 83.3732, zoom: 11 };
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: center.zoom,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers whenever geoData or filter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current || !geoData) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // Center map if district center changes
    if (geoData.district_center) {
      mapInstanceRef.current.setView(
        [geoData.district_center.lat, geoData.district_center.lng],
        geoData.district_center.zoom
      );
    }

    // 1. Render Villages
    if (showVillages && geoData.villages) {
      geoData.villages.forEach((v) => {
        const villageIcon = L.divIcon({
          className: 'custom-map-icon',
          html: `
            <div style="background-color: #166534; color: white; border-radius: 9999px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
              V
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker([v.lat, v.lng], { icon: villageIcon });
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #166534;">${v.name}</h4>
            <p style="margin: 0; font-size: 12px; color: #475569;">Block: <strong>${v.block}</strong></p>
            <p style="margin: 2px 0 0; font-size: 12px; color: #475569;">Population: <strong>${v.population.toLocaleString('en-IN')}</strong></p>
            <p style="margin: 2px 0 0; font-size: 12px; color: #475569;">Milk Yield: <strong>${v.milk_yield} L/day</strong></p>
            <p style="margin: 2px 0 0; font-size: 12px; color: #475569;">Power Supply: <strong>${v.power_hours} hrs/day</strong></p>
          </div>
        `);
        marker.on('click', () => setSelectedEntity({ type: 'village', data: v }));
        layerGroup.addLayer(marker);
      });
    }

    // 2. Render Facilities
    if (showFacilities && geoData.facilities) {
      geoData.facilities.forEach((f) => {
        const facIcon = L.divIcon({
          className: 'custom-map-icon',
          html: `
            <div style="background-color: #0284c7; color: white; border-radius: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
              🏢
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([f.lat, f.lng], { icon: facIcon });
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #0284c7;">${f.name}</h4>
            <p style="margin: 0; font-size: 12px; color: #475569;">Type: <strong>${f.facility_type.replace('_', ' ').toUpperCase()}</strong></p>
            <p style="margin: 2px 0 0; font-size: 12px; color: #475569;">${f.description || ''}</p>
          </div>
        `);
        marker.on('click', () => setSelectedEntity({ type: 'facility', data: f }));
        layerGroup.addLayer(marker);
      });
    }

    // 3. Render Beneficiary Applications
    if (geoData.applications) {
      geoData.applications.forEach((a) => {
        // Filter logic
        if (filterType === 'at_risk' && a.repayment_health !== 'at_risk') return;
        if (filterType === 'dairy' && !a.category?.toLowerCase().includes('dairy')) return;
        if (filterType === 'food' && !a.category?.toLowerCase().includes('food')) return;
        if (filterType === 'solar' && !a.category?.toLowerCase().includes('solar')) return;

        const isAtRisk = a.repayment_health === 'at_risk';
        const color = isAtRisk ? '#dc2626' : (a.status === 'launched' ? '#059669' : '#d97706');
        const badgeChar = isAtRisk ? '!' : (a.status === 'launched' ? '★' : '●');

        const appIcon = L.divIcon({
          className: 'custom-map-icon',
          html: `
            <div style="background-color: ${color}; color: white; border-radius: 9999px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 2.5px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.35);">
              ${badgeChar}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([a.lat, a.lng], { icon: appIcon });
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; min-width: 190px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: ${isAtRisk ? '#fee2e2' : '#dcfce7'}; color: ${isAtRisk ? '#991b1b' : '#166534'};">
                ${isAtRisk ? 'REPAYMENT AT RISK' : a.status.toUpperCase()}
              </span>
            </div>
            <h4 style="margin: 2px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${a.business || a.business_name}</h4>
            <p style="margin: 0; font-size: 12px; color: #475569;">Applicant: <strong>${a.applicant || a.applicant_name}</strong></p>
            <p style="margin: 2px 0 0; font-size: 12px; color: #475569;">Sector: <strong>${a.category}</strong></p>
            <p style="margin: 2px 0 0; font-size: 12px; color: #475569;">Total Cost: <strong>₹${(a.total_cost || a.total_project_cost || 0).toLocaleString('en-IN')}</strong></p>
            <p style="margin: 2px 0 0; font-size: 12px; color: #475569;">Subsidy: <strong>₹${(a.subsidy_amount || 0).toLocaleString('en-IN')}</strong></p>
          </div>
        `);
        marker.on('click', () => {
          setSelectedEntity({ type: 'application', data: a });
          if (onSelectApplication) onSelectApplication(a);
        });
        layerGroup.addLayer(marker);
      });
    }
  }, [geoData, filterType, showFacilities, showVillages]);

  return (
    <div className="relative w-full h-[620px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
      {/* Map Control Toolbar */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-md border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-700 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-emerald-600" /> Sector Filter:
        </span>
        <button
          onClick={() => setFilterType('all')}
          className={`px-2.5 py-1 rounded-md font-medium transition ${
            filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Sectors
        </button>
        <button
          onClick={() => setFilterType('dairy')}
          className={`px-2.5 py-1 rounded-md font-medium transition ${
            filterType === 'dairy' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Dairy Farming
        </button>
        <button
          onClick={() => setFilterType('food')}
          className={`px-2.5 py-1 rounded-md font-medium transition ${
            filterType === 'food' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Food Processing
        </button>
        <button
          onClick={() => setFilterType('solar')}
          className={`px-2.5 py-1 rounded-md font-medium transition ${
            filterType === 'solar' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Solar & Technical
        </button>
        <button
          onClick={() => setFilterType('at_risk')}
          className={`px-2.5 py-1 rounded-md font-medium transition ${
            filterType === 'at_risk' ? 'bg-red-600 text-white shadow-sm' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
          }`}
        >
          ⚠️ At-Risk Only
        </button>

        <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>

        <label className="flex items-center space-x-1 text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showVillages}
            onChange={(e) => setShowVillages(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-0"
          />
          <span>Villages</span>
        </label>
        <label className="flex items-center space-x-1 text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showFacilities}
            onChange={(e) => setShowFacilities(e.target.checked)}
            className="rounded text-blue-600 focus:ring-0"
          />
          <span>Facilities</span>
        </label>
      </div>

      {/* Leaflet DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Legend & Entity Inspector Overlay */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-md border border-slate-200 text-xs max-w-xs space-y-2">
        <div className="font-semibold text-slate-800 flex items-center justify-between border-b border-slate-200 pb-1.5">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-600" /> GIS Legend
          </span>
          <span className="text-[10px] text-slate-500 font-normal">Live Radius: 15km</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-slate-600 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-700 border border-white inline-block"></span>
            <span>Village Cluster</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-sky-600 border border-white inline-block"></span>
            <span>Market / Chilling Center</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white inline-block"></span>
            <span>Healthy Business</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white inline-block"></span>
            <span>Repayment At Risk</span>
          </div>
        </div>

        {selectedEntity && (
          <div className="mt-2 pt-2 border-t border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-400">Selected Entity</div>
            <div className="font-bold text-slate-900 text-xs mt-0.5">
              {selectedEntity.type === 'village' && selectedEntity.data.name}
              {selectedEntity.type === 'facility' && selectedEntity.data.name}
              {selectedEntity.type === 'application' && (selectedEntity.data.business || selectedEntity.data.business_name)}
            </div>
            <div className="text-[11px] text-slate-600">
              {selectedEntity.type === 'village' && `Population: ${selectedEntity.data.population} | Milk Yield: ${selectedEntity.data.milk_yield} L/day`}
              {selectedEntity.type === 'facility' && selectedEntity.data.description}
              {selectedEntity.type === 'application' && `Applicant: ${selectedEntity.data.applicant || selectedEntity.data.applicant_name} (₹${(selectedEntity.data.total_cost || selectedEntity.data.total_project_cost).toLocaleString('en-IN')})`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
