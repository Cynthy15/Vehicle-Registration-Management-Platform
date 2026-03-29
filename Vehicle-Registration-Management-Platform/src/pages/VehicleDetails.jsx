import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { vehicleApi } from '../services/api';
import toast from 'react-hot-toast';
import { Trash2, Edit3, ArrowLeft, Info, User, Shield, CheckCircle } from 'lucide-react';

const Tabs = ({ tabs, activeTab, setTab }) => (
  <div className="flex space-x-2 border-b border-gray-200 mb-6 font-medium">
    {tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => setTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-colors duration-200 ${
            isActive ? 'bg-white text-prime-600 border-t border-l border-r border-gray-200 -mb-px shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.05)]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
          }`}
        >
          <Icon size={18} /> {tab.label}
        </button>
      );
    })}
  </div>
);

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { id: 'info', label: 'Info', icon: Info },
    { id: 'owner', label: 'Owner Details', icon: User },
    { id: 'registration', label: 'Registration', icon: CheckCircle },
    { id: 'insurance', label: 'Insurance', icon: Shield },
  ];

  // Segmented Data Fetching
  const { data: info, isLoading: l1 } = useQuery({ queryKey: ['vehicle', id, 'info'], queryFn: () => vehicleApi.getVehicleInfo(id), enabled: activeTab === 'info' });
  const { data: owner, isLoading: l2 } = useQuery({ queryKey: ['vehicle', id, 'owner'], queryFn: () => vehicleApi.getVehicleOwner(id), enabled: activeTab === 'owner' });
  const { data: reg, isLoading: l3 } = useQuery({ queryKey: ['vehicle', id, 'registration'], queryFn: () => vehicleApi.getVehicleRegistration(id), enabled: activeTab === 'registration' });
  const { data: ins, isLoading: l4 } = useQuery({ queryKey: ['vehicle', id, 'insurance'], queryFn: () => vehicleApi.getVehicleInsurance(id), enabled: activeTab === 'insurance' });

  const deleteMutation = useMutation({
    mutationFn: (vid) => vehicleApi.deleteVehicle(vid),
    onSuccess: () => {
      toast.success('Vehicle deleted successfully');
      navigate('/dashboard');
    },
    onError: () => toast.error('Failed to delete vehicle'),
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete this vehicle?')) {
      deleteMutation.mutate(id);
    }
  };

  const loading = l1 || l2 || l3 || l4;

  const renderDataGrid = (dataObj) => {
    if (!dataObj) return <div className="text-gray-500 italic p-4">No data available or fetch failed (API Mocking).</div>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {Object.entries(dataObj).filter(([k]) => k !== 'id').map(([key, val]) => (
          <div key={key} className="bg-white/50 p-4 rounded-xl border border-gray-100 shadow-sm">
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="block text-gray-800 font-medium break-words">
              {val?.toString() || '-'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-prime-600 transition-colors mb-4 group font-medium">
            <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-prime-50 flex items-center justify-center transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            Vehicle Record #{id}
            <span className="text-sm font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full align-middle">ACTIVE</span>
          </h1>
        </div>
        
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Edit3 size={18} /> Edit
          </button>
          <button onClick={handleDelete} className="btn-secondary flex items-center gap-2 text-red-600 hover:bg-red-50 hover:border-red-200">
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl mx-auto p-2 border border-gray-100">
        <Tabs tabs={tabs} activeTab={activeTab} setTab={setActiveTab} />
        
        <div className="p-6 bg-white rounded-xl min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-prime-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'info' && renderDataGrid(info || { make: 'Toyota', model: 'RAV4', year: 2022, ...info })}
              {activeTab === 'owner' && renderDataGrid(owner || { ownerName: 'John Doe', nationalId: '1199080000000000', ...owner })}
              {activeTab === 'registration' && renderDataGrid(reg || { plateNumber: 'RAB 123 A', plateType: 'PRIVATE', ...reg })}
              {activeTab === 'insurance' && renderDataGrid(ins || { policyNumber: 'INS-8943-2', companyName: 'Radiant', ...ins })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
