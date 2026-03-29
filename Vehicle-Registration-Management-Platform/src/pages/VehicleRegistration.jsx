import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleInfoSchema, ownerInfoSchema, registrationInsuranceSchema } from '../utils/schemas';
import { vehicleApi } from '../services/api';
import toast from 'react-hot-toast';
import { ChevronRight, ChevronLeft, CheckCircle2, Car, User, ShieldCheck } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

const steps = [
  { id: 1, title: 'Vehicle Info', schema: vehicleInfoSchema, icon: Car },
  { id: 2, title: 'Owner Details', schema: ownerInfoSchema, icon: User },
  { id: 3, title: 'Reg & Insurance', schema: registrationInsuranceSchema, icon: ShieldCheck },
];

// Helper Input component handling error mapping
const Field = ({ label, name, type = 'text', register, errors, ...rest }) => (
  <div className="mb-4">
    <label className="label-text">{label}</label>
    <input
      type={type}
      className={`input-field ${errors[name] ? 'input-error' : ''}`}
      {...register(name, { valueAsNumber: type === 'number' })}
      {...rest}
    />
    {errors[name] && <span className="text-red-500 font-medium text-xs mt-1 block">{errors[name].message}</span>}
  </div>
);

const Select = ({ label, name, options, register, errors, ...rest }) => (
  <div className="mb-4">
    <label className="label-text">{label}</label>
    <select className={`input-field bg-white ${errors[name] ? 'input-error' : ''}`} {...register(name)} {...rest}>
      <option value="">Select option...</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {errors[name] && <span className="text-red-500 font-medium text-xs mt-1 block">{errors[name].message}</span>}
  </div>
);

const VehicleRegistration = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(steps[currentStep].schema),
    mode: 'onTouched',
  });

  const { register, handleSubmit, formState: { errors }, reset, trigger, getValues, watch } = methods;
  
  // Custom multi-step form state aggregator
  const [formData, setFormData] = useState({});

  const mutation = useMutation({
    mutationFn: vehicleApi.createVehicle,
    onSuccess: (data) => {
      toast.success('Vehicle registered successfully!');
      navigate(`/vehicle/${data.id || 'new'}`);
    },
    onError: (error) => {
      // Elegantly map 422 errors to display them via toasts
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errors.forEach(err => toast.error(err, { duration: 6000 }));
        } else {
          toast.error('Validation failed. Please review your inputs.');
        }
      } else {
        toast.error('An error occurred while saving the record.');
      }
    }
  });

  const nextStep = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setFormData((prev) => ({ ...prev, ...getValues() }));
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = (data) => {
    const finalData = { ...formData, ...data };
    
    // Process layout mapping to API constraints
    const payload = {
      ...finalData,
      registrationDate: finalData.registrationDate ? new Date(finalData.registrationDate).toISOString() : undefined,
      expiryDate: finalData.expiryDate ? new Date(finalData.expiryDate).toISOString() : undefined,
      insuranceExpiryDate: finalData.insuranceExpiryDate ? new Date(finalData.insuranceExpiryDate).toISOString() : undefined,
      passportNumber: finalData.passportNumber || "NOT-PROVIDED",
      companyRegNumber: finalData.companyRegistrationNumber || "NOT-APPLICABLE",
      registrationStatus: finalData.registrationStatus || "ACTIVE",
      insuranceStatus: finalData.insuranceStatus || "ACTIVE",
    };
    
    mutation.mutate(payload);
  };

  // Enums mapped for selection
  const eVehicle = ['ELECTRIC', 'SUV', 'TRUCK', 'MOTORCYCLE', 'BUS', 'VAN', 'PICKUP', 'OTHER'];
  const eFuel = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'GAS', 'OTHER'];
  const ePurpose = ['PERSONAL', 'COMMERCIAL', 'TAXI', 'GOVERNMENT'];
  const eStatus = ['NEW', 'USED', 'REBUILT'];
  const eOwner = ['INDIVIDUAL', 'COMPANY', 'NGO', 'GOVERNMENT'];
  const ePlate = ['PRIVATE', 'COMMERCIAL', 'GOVERNMENT', 'DIPLOMATIC', 'PERSONALIZED'];
  const eInsStat = ['ACTIVE', 'SUSPENDED', 'EXPIRED'];

  const ownerType = watch('ownerType');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Register New Vehicle</h1>
        <p className="text-gray-500 mt-2">Complete the wizard below to register a vehicle.</p>
      </div>

      {/* Stepper */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-gray-200 z-0"></div>
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          const Icon = step.icon;
          
          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-gray-50 transition-colors duration-300
                ${isCompleted ? 'bg-prime-500 text-white' : isActive ? 'bg-white border-prime-500 text-prime-600' : 'bg-gray-100 text-gray-400'}`}>
                {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={20} />}
              </div>
              <span className={`mt-2 text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</span>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 animate-fade-in">
                <Field label="Manufacture" name="manufacture" register={register} errors={errors} placeholder="e.g. Toyota" />
                <Field label="Model" name="model" register={register} errors={errors} placeholder="e.g. RAV4" />
                <Field label="Body Type" name="bodyType" register={register} errors={errors} placeholder="e.g. SUV" />
                <Field label="Color" name="color" register={register} errors={errors} placeholder="e.g. Silver" />
                <Field label="Year" name="year" type="number" register={register} errors={errors} />
                <Field label="Engine Capacity (CC)" name="engineCapacity" type="number" register={register} errors={errors} />
                <Field label="Odometer Reading (KM)" name="odometerReading" type="number" register={register} errors={errors} />
                <Field label="Seating Capacity" name="seatingCapacity" type="number" register={register} errors={errors} />
                
                <Select label="Vehicle Type" name="vehicleType" options={eVehicle} register={register} errors={errors} />
                <Select label="Fuel Type" name="fuelType" options={eFuel} register={register} errors={errors} />
                <Select label="Purpose" name="vehiclePurpose" options={ePurpose} register={register} errors={errors} />
                <Select label="Status" name="vehicleStatus" options={eStatus} register={register} errors={errors} />
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 animate-fade-in">
                <Field label="Full Name" name="ownerName" register={register} errors={errors} />
                <Field label="Address" name="address" register={register} errors={errors} />
                <Field label="National ID (16 Digits)" name="nationalId" register={register} errors={errors} />
                <Field label="Mobile Number (10 Digits)" name="mobile" register={register} errors={errors} />
                <Field label="Email Address" type="email" name="email" register={register} errors={errors} />
                <Select label="Owner Type" name="ownerType" options={eOwner} register={register} errors={errors} />
                <Field label="Passport Number (Optional)" name="passportNumber" register={register} errors={errors} />
                
                {ownerType === 'COMPANY' && (
                  <Field label="Company Reg Number" name="companyRegistrationNumber" register={register} errors={errors} />
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 animate-fade-in">
                <Field label="Plate Number (e.g. RAB 123 A)" name="plateNumber" register={register} errors={errors} />
                <Select label="Plate Type" name="plateType" options={ePlate} register={register} errors={errors} />
                <Field label="Registration Date" type="datetime-local" name="registrationDate" register={register} errors={errors} />
                <Field label="Registration Expiry" type="datetime-local" name="expiryDate" register={register} errors={errors} />
                
                <div className="col-span-1 md:col-span-2 my-4 border-t border-gray-100 pt-4"><h3 className="font-semibold text-gray-700">Insurance Details</h3></div>
                
                <Field label="Insurance Provider" name="companyName" register={register} errors={errors} />
                <Field label="Policy Number" name="policyNumber" register={register} errors={errors} />
                <Field label="Insurance Type" name="insuranceType" register={register} errors={errors} />
                <Field label="Insurance Expiry Date" type="datetime-local" name="insuranceExpiryDate" register={register} errors={errors} />
                <Select label="Insurance Status" name="insuranceStatus" options={eInsStat} register={register} errors={errors} />
                
                <div className="col-span-1 md:col-span-2 my-4 border-t border-gray-100 pt-4"><h3 className="font-semibold text-gray-700">Documents</h3></div>
                
                <Field label="Roadworthy Certificate Ref" name="roadworthyCert" register={register} errors={errors} />
                <Field label="Customs Reference" name="customsRef" register={register} errors={errors} />
                <Field label="Proof of Ownership Ref" name="proofOfOwnership" register={register} errors={errors} />
                <Field label="State of Registration" name="state" register={register} errors={errors} />
              </div>
            )}

            <div className="mt-8 flex justify-between items-center border-t border-gray-100 pt-6">
              <button 
                type="button" 
                onClick={prevStep} 
                disabled={currentStep === 0}
                className={`btn-secondary flex items-center gap-2 ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ChevronLeft size={18} /> Back
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
                  Next Step <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="btn-primary flex items-center gap-2 relative bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-500/30"
                >
                  {mutation.isPending ? 'Submitting...' : 'Register Vehicle'} <CheckCircle2 size={18} />
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default VehicleRegistration;
