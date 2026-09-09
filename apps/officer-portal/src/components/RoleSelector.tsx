import React from 'react';
import { Shield, ShieldAlert, UserCheck, Briefcase } from 'lucide-react';

export interface OfficerProfile {
  id: string;
  name: string;
  designation: string;
  role: 'super_admin' | 'district_officer' | 'sca_pwd_officer' | 'field_officer';
  districtId: string;
  districtName: string;
  scopeBadge: string;
}

export const OFFICER_ROLES: OfficerProfile[] = [
  {
    id: 'admin_super',
    name: 'Dr. Alok Ranjan (IAS)',
    designation: 'State Mission Director (Panchayati Raj & MSME)',
    role: 'super_admin',
    districtId: 'dist_gorakhpur',
    districtName: 'All Districts (National/State)',
    scopeBadge: 'Full National & State Scope'
  },
  {
    id: 'officer_district_gkp',
    name: 'Shri Rajesh Verma (IAS)',
    designation: 'District Magistrate & Task Force Chairman',
    role: 'district_officer',
    districtId: 'dist_gorakhpur',
    districtName: 'Gorakhpur District',
    scopeBadge: 'District Jurisdiction (Gorakhpur)'
  },
  {
    id: 'officer_district_varanasi',
    name: 'Smt. Priya Mishra (IAS)',
    designation: 'District Magistrate & Task Force Chairman',
    role: 'district_officer',
    districtId: 'dist_varanasi',
    districtName: 'Varanasi District',
    scopeBadge: 'District Jurisdiction (Varanasi)'
  },
  {
    id: 'officer_sca_welfare',
    name: 'Shri Anand Prakash (PCS)',
    designation: 'Special Component Welfare Officer',
    role: 'sca_pwd_officer',
    districtId: 'dist_gorakhpur',
    districtName: 'Gorakhpur & Varanasi',
    scopeBadge: 'SC/ST/Women/Divyangjan Scope'
  },
  {
    id: 'officer_field_sahjanwa',
    name: 'Vikas Chandra',
    designation: 'Senior Field & Extension Officer',
    role: 'field_officer',
    districtId: 'dist_gorakhpur',
    districtName: 'Sahjanwa Block',
    scopeBadge: 'Block / Village Cluster Scope'
  }
];

interface Props {
  currentOfficer: OfficerProfile;
  onSelectRole: (officer: OfficerProfile) => void;
}

export const RoleSelector: React.FC<Props> = ({ currentOfficer, onSelectRole }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
        {currentOfficer.role === 'super_admin' && <Shield className="w-4 h-4 text-amber-400" />}
        {currentOfficer.role === 'district_officer' && <Briefcase className="w-4 h-4 text-emerald-400" />}
        {currentOfficer.role === 'sca_pwd_officer' && <ShieldAlert className="w-4 h-4 text-purple-400" />}
        {currentOfficer.role === 'field_officer' && <UserCheck className="w-4 h-4 text-blue-400" />}
        
        <div className="text-left">
          <div className="text-xs text-slate-300 font-medium leading-none">Acting Officer Role</div>
          <select
            value={currentOfficer.id}
            onChange={(e) => {
              const found = OFFICER_ROLES.find(r => r.id === e.target.value);
              if (found) onSelectRole(found);
            }}
            className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer pr-4"
          >
            {OFFICER_ROLES.map((r) => (
              <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                {r.name} — {r.designation} ({r.districtName})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <span className="hidden xl:inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
        {currentOfficer.scopeBadge}
      </span>
    </div>
  );
};
