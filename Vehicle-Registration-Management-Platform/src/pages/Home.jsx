import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { vehicleApi } from '../services/api';
import { Car, Search } from 'lucide-react';

const Home = () => {
  const { data: vehicles, isLoading, isError } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehicleApi.getAllVehicles
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Public Fleet Registry</h1>
          <p className="text-gray-500 mt-2">View all registered vehicles in the system.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search plates..." 
            className="input-field pl-10 w-64"
          />
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 font-semibold text-gray-600">ID</th>
              <th className="py-4 px-6 font-semibold text-gray-600">Plate Number</th>
              <th className="py-4 px-6 font-semibold text-gray-600">Manufacture</th>
              <th className="py-4 px-6 font-semibold text-gray-600">Model</th>
              <th className="py-4 px-6 font-semibold text-gray-600">Year</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-400">Loading vehicles...</td>
              </tr>
            ) : vehicles?.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-gray-500">#{vehicle.id}</td>
                <td className="py-4 px-6 font-medium text-prime-600 bg-prime-50/30 inline-flex items-center gap-2 m-2 rounded-lg px-3 py-1">
                  <Car size={16} />{vehicle.plateNumber}
                </td>
                <td className="py-4 px-6 text-gray-800">{vehicle.manufacture}</td>
                <td className="py-4 px-6 text-gray-800">{vehicle.model}</td>
                <td className="py-4 px-6 text-gray-500">{vehicle.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
