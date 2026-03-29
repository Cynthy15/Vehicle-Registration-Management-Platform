import { z } from 'zod';

const currentYear = new Date().getFullYear();

// Enums
export const VehicleTypes = ['ELECTRIC', 'SUV', 'TRUCK', 'MOTORCYCLE', 'BUS', 'VAN', 'PICKUP', 'OTHER'];
export const FuelTypes = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'GAS', 'OTHER'];
export const Purposes = ['PERSONAL', 'COMMERCIAL', 'TAXI', 'GOVERNMENT'];
export const VehicleStatuses = ['NEW', 'USED', 'REBUILT'];
export const OwnerTypes = ['INDIVIDUAL', 'COMPANY', 'NGO', 'GOVERNMENT'];
export const PlateTypes = ['PRIVATE', 'COMMERCIAL', 'GOVERNMENT', 'DIPLOMATIC', 'PERSONALIZED'];
export const InsuranceStatuses = ['ACTIVE', 'SUSPENDED', 'EXPIRED'];

// Validation Schemas
export const vehicleInfoSchema = z.object({
  manufacture: z.string().min(1, 'Manufacture is required').trim(),
  model: z.string().min(1, 'Model is required').trim(),
  bodyType: z.string().min(1, 'Body type is required').trim(),
  color: z.string().min(1, 'Color is required').trim(),
  year: z.number().int().min(1886, 'Year must be 1886 or later').max(currentYear + 1, `Year cannot exceed ${currentYear + 1}`),
  engineCapacity: z.number().int().positive('Engine capacity must be greater than 0'),
  odometerReading: z.number().int().nonnegative('Odometer cannot be negative'),
  seatingCapacity: z.number().int().positive('Minimum 1 seat required'),
  vehicleType: z.enum(VehicleTypes),
  fuelType: z.enum(FuelTypes),
  vehiclePurpose: z.enum(Purposes),
  vehicleStatus: z.enum(VehicleStatuses),
});

export const ownerInfoSchema = z.object({
  ownerName: z.string().min(1, 'Owner name is required').trim(),
  address: z.string().min(1, 'Address is required').trim(),
  nationalId: z.string().regex(/^\d{16}$/, 'National ID must be exactly 16 digits'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  email: z.string().email('Invalid email address'),
  ownerType: z.enum(OwnerTypes),
  passportNumber: z.string().optional().refine(val => !val || val.trim().length > 0, 'Cannot be just whitespace if provided'),
  companyRegistrationNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.ownerType === 'COMPANY' && (!data.companyRegistrationNumber || data.companyRegistrationNumber.trim().length === 0)) {
    ctx.addIssue({
      path: ['companyRegistrationNumber'],
      message: 'Company Registration Number is required for companies',
      code: z.ZodIssueCode.custom,
    });
  }
});

export const registrationInsuranceSchema = z.object({
  plateNumber: z.string().regex(/^(R[A-Z]{2}|GR|CD)\s?\d{3}\s?[A-Z]?$/i, 'Invalid Rwandan license plate format'),
  registrationDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
  expiryDate: z.string().refine(val => {
    const d = new Date(val);
    return !isNaN(d.getTime()) && d > new Date();
  }, 'Registration Expiry date must be in the future'),
  
  insuranceExpiryDate: z.string().refine(val => {
    const d = new Date(val);
    return !isNaN(d.getTime()) && d > new Date();
  }, 'Insurance Expiry date must be in the future'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  companyName: z.string().min(1, 'Insurance company is required'),
  insuranceType: z.string().min(1, 'Insurance type is required'),
  roadworthyCert: z.string().min(1, 'Roadworthy certificate required'),
  customsRef: z.string().min(1, 'Customs reference required'),
  proofOfOwnership: z.string().min(1, 'Proof of ownership required'),
  state: z.string().min(1, 'State is required'),
  plateType: z.enum(PlateTypes),
  insuranceStatus: z.enum(InsuranceStatuses),
});

export const fullRegistrationSchema = z.object({
  info: vehicleInfoSchema,
  owner: ownerInfoSchema,
  registration: registrationInsuranceSchema,
});
