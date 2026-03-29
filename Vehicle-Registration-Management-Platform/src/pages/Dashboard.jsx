import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { vehicleApi } from '../services/api';
import { Link } from 'react-router-dom';
import { Car, AlertTriangle, ShieldCheck, Activity, Users, FileText } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="glass p-6 rounded-2xl flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass}`}>
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: vehicles, isLoading, isError, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehicleApi.getAllVehicles
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Manage your vehicle registry, insurance, and compliance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Vehicles" value={vehicles?.length || 0} icon={Car} colorClass="bg-blue-50 text-blue-600" />
        <StatCard title="Active Registrations" value="1,245" icon={ShieldCheck} colorClass="bg-emerald-50 text-emerald-600" />
        <StatCard title="Pending Inspections" value="34" icon={AlertTriangle} colorClass="bg-amber-50 text-amber-600" />
        <StatCard title="Total Owners" value="892" icon={Users} colorClass="bg-purple-50 text-purple-600" />
      </div>

      <div className="glass rounded-2xl p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Registrations</h2>
          <Link to="/vehicle/new" className="text-sm font-semibold text-prime-600 hover:text-prime-700">
            + New Registration
          </Link>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Plate</th>
              <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Make/Model</th>
              <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Status</th>
              <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-400">Loading live vehicles...</td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-red-500 bg-red-50/50">Failed to fetch data: {error.message}</td>
              </tr>
            )}
            {!isLoading && vehicles?.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">No vehicles found in the database.</td>
              </tr>
            )}
            {vehicles?.slice(0, 17).map(vehicle => (
              <tr key={vehicle.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-4 font-medium text-gray-900">{vehicle.plateNumber}</td>
                <td className="py-3 px-4 text-gray-600">{vehicle.manufacture} {vehicle.model}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                    vehicle.registrationStatus === 'ACTIVE' || vehicle.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {vehicle.registrationStatus || vehicle.status || 'ACTIVE'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Link to={`/vehicle/${vehicle.id}`} className="p-2 text-gray-400 hover:text-prime-600 inline-block transition-colors rounded-lg hover:bg-prime-50">
                    <FileText size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
