import React, { useState } from 'react';
import { MapPin, Store, Building2, Landmark, Truck, ShieldAlert } from 'lucide-react';
import { Language } from '../locales';

interface Facility {
  id: string;
  name: string;
  facility_type: string;
  distance_km: number;
  description?: string;
}

interface FacilityRadarProps {
  facilities: Facility[];
  counts: Record<string, number>;
  radiusKm: number;
  onRadiusChange: (r: number) => void;
  villageName: string;
  lang?: Language;
}

export const FacilityRadar: React.FC<FacilityRadarProps> = ({
  facilities,
  counts,
  radiusKm,
  onRadiusChange,
  villageName,
  lang = 'hi'
}) => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const isEn = lang === 'en';

  const labels = {
    title: isEn ? `Local Spatial Radar (${villageName})` : `स्थानीय रडार विश्लेषण (${villageName})`,
    subtitle: isEn ? 'Markets, lead banks, and competitor density' : 'बाजार, बैंक, और प्रतिस्पर्धी रडार',
    radius5: isEn ? '5 km' : '5 किमी',
    radius10: isEn ? '10 km' : '10 किमी',
    competitors: isEn ? 'Competitors' : 'प्रतिस्पर्धी',
    chilling: isEn ? 'Chilling Center' : 'चिलिंग केंद्र',
    mandi: isEn ? 'Mandi / Market' : 'कृषि मंडी',
    bank: isEn ? 'Rural Bank' : 'बैंक शाखाएं',
    distanceAway: isEn ? 'away' : 'दूरी पर',
    tapToInspect: isEn ? 'Tap any facility to inspect distance & services' : 'सुविधा पर टैप करके दूरी व विवरण देखें'
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'competitor': return <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />;
      case 'chilling_center': return <Store className="w-3.5 h-3.5 text-blue-500" />;
      case 'mandi': return <Building2 className="w-3.5 h-3.5 text-amber-500" />;
      case 'bank': return <Landmark className="w-3.5 h-3.5 text-emerald-600" />;
      default: return <Truck className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      {/* Header & Radius Switcher */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{labels.title}</span>
          </h3>
          <p className="text-[11px] text-slate-500">{labels.subtitle}</p>
        </div>

        <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
          <button
            onClick={() => onRadiusChange(5.0)}
            className={`px-2.5 py-1 rounded-md transition-all ${
              radiusKm === 5 ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            {labels.radius5}
          </button>
          <button
            onClick={() => onRadiusChange(10.0)}
            className={`px-2.5 py-1 rounded-md transition-all ${
              radiusKm === 10 ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            {labels.radius10}
          </button>
        </div>
      </div>

      {/* Facilities Count Pills */}
      <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] mb-3">
        <div className="bg-rose-50 border border-rose-100 p-1.5 rounded-xl">
          <span className="font-extrabold text-rose-700 text-xs block">{counts.competitor || 0}</span>
          <span className="text-rose-600 truncate block">{labels.competitors}</span>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-1.5 rounded-xl">
          <span className="font-extrabold text-blue-700 text-xs block">{counts.chilling_center || 0}</span>
          <span className="text-blue-600 truncate block">{labels.chilling}</span>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-1.5 rounded-xl">
          <span className="font-extrabold text-amber-700 text-xs block">{counts.mandi || 0}</span>
          <span className="text-amber-600 truncate block">{labels.mandi}</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-1.5 rounded-xl">
          <span className="font-extrabold text-emerald-700 text-xs block">{counts.bank || 0}</span>
          <span className="text-emerald-600 truncate block">{labels.bank}</span>
        </div>
      </div>

      {/* Facilities List */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {facilities.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">
            {isEn ? `No commercial facilities recorded within ${radiusKm}km.` : `${radiusKm} किमी दायरे में कोई सुविधा दर्ज नहीं है।`}
          </p>
        ) : (
          facilities.map((f) => (
            <div
              key={f.id}
              onClick={() => setSelectedFacility(f)}
              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                selectedFacility?.id === f.id
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                {getIcon(f.facility_type)}
                <div>
                  <span className="font-semibold text-slate-800 block text-xs">{f.name}</span>
                  {f.description && <span className="text-[10px] text-slate-500">{f.description}</span>}
                </div>
              </div>
              <span className="font-mono text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {f.distance_km} {isEn ? 'km' : 'किमी'}
              </span>
            </div>
          ))
        )}
      </div>

      <p className="text-[10px] text-slate-400 text-center mt-2.5">
        {labels.tapToInspect}
      </p>
    </div>
  );
};
