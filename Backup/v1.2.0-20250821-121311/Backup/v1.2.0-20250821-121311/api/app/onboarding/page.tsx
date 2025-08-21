'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Home, 
  CreditCard, 
  Calculator, 
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface OnboardingData {
  fullName: string;
  email: string;
  phone: string;
  monthlyIncome: number;
  housingType: 'renting' | 'owning';
  rentAmount: number;
  hasDebts: boolean;
  debtAmount: number;
  familySize: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    email: '',
    phone: '',
    monthlyIncome: 0,
    housingType: 'renting',
    rentAmount: 0,
    hasDebts: false,
    debtAmount: 0,
    familySize: 1,
  });

  const steps = [
    {
      id: 1,
      title: 'Personlig informasjon',
      description: 'Fortell oss litt om deg selv',
      icon: User,
    },
    {
      id: 2,
      title: 'Økonomisk oversikt',
      description: 'Hjelp oss forstå din økonomiske situasjon',
      icon: Calculator,
    },
    {
      id: 3,
      title: 'Bolig og utgifter',
      description: 'Informasjon om bolig og faste utgifter',
      icon: Home,
    },
    {
      id: 4,
      title: 'Gjeld og lån',
      description: 'Oversikt over gjeld og lån',
      icon: CreditCard,
    },
  ];

  const handleInputChange = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Here you would save the data to Supabase
      console.log('Onboarding data:', data);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="label">Fullt navn</label>
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="input-field"
                placeholder="Ditt navn"
              />
            </div>
            <div>
              <label className="label">E-post</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input-field"
                placeholder="din.epost@eksempel.no"
              />
            </div>
            <div>
              <label className="label">Telefonnummer</label>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="input-field"
                placeholder="123 45 678"
              />
            </div>
            <div>
              <label className="label">Antall personer i husholdningen</label>
              <select
                value={data.familySize}
                onChange={(e) => handleInputChange('familySize', parseInt(e.target.value))}
                className="input-field"
              >
                <option value={1}>1 person</option>
                <option value={2}>2 personer</option>
                <option value={3}>3 personer</option>
                <option value={4}>4 personer</option>
                <option value={5}>5+ personer</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="label">Månedlig inntekt (før skatt)</label>
              <div className="relative">
                <input
                  type="number"
                  value={data.monthlyIncome || ''}
                  onChange={(e) => handleInputChange('monthlyIncome', parseInt(e.target.value) || 0)}
                  className="input-field pr-12"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  kr
                </span>
              </div>
              {data.monthlyIncome > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Netto: ca. {formatCurrency(data.monthlyIncome * 0.7)}
                </p>
              )}
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
              <p className="text-blue-800 text-sm">
                Inkluder lønn, trygd, barnetrygd og andre faste inntekter. 
                Dette hjelper oss å gi deg bedre råd om støtteordninger.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="label">Boligtype</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="housingType"
                    value="renting"
                    checked={data.housingType === 'renting'}
                    onChange={(e) => handleInputChange('housingType', e.target.value)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span>Leier bolig</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="housingType"
                    value="owning"
                    checked={data.housingType === 'owning'}
                    onChange={(e) => handleInputChange('housingType', e.target.value)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span>Eier bolig</span>
                </label>
              </div>
            </div>
            {data.housingType === 'renting' && (
              <div>
                <label className="label">Månedlig husleie</label>
                <div className="relative">
                  <input
                    type="number"
                    value={data.rentAmount || ''}
                    onChange={(e) => handleInputChange('rentAmount', parseInt(e.target.value) || 0)}
                    className="input-field pr-12"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    kr
                  </span>
                </div>
              </div>
            )}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">🏠 Bostøtte</h3>
              <p className="text-green-800 text-sm">
                Basert på din inntekt og husleie kan du ha rett på bostøtte fra Husbanken. 
                Vi vil hjelpe deg med å søke senere.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="label">Har du gjeld eller lån?</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="hasDebts"
                    value="true"
                    checked={data.hasDebts === true}
                    onChange={(e) => handleInputChange('hasDebts', e.target.value === 'true')}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span>Ja</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="hasDebts"
                    value="false"
                    checked={data.hasDebts === false}
                    onChange={(e) => handleInputChange('hasDebts', e.target.value === 'true')}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span>Nei</span>
                </label>
              </div>
            </div>
            {data.hasDebts && (
              <div>
                <label className="label">Total gjeld (omtrentlig)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={data.debtAmount || ''}
                    onChange={(e) => handleInputChange('debtAmount', parseInt(e.target.value) || 0)}
                    className="input-field pr-12"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    kr
                  </span>
                </div>
              </div>
            )}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">💳 Gjeldsrådgivning</h3>
              <p className="text-yellow-800 text-sm">
                Kommunen er lovpålagt å tilby gratis gjeldsrådgivning. 
                Vi kan hjelpe deg med å finne din lokale rådgiver.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600 mt-1">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Step content */}
        <div className="card">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="btn-primary flex items-center gap-2"
            >
              Neste
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn-success flex items-center gap-2"
            >
              Fullfør oppsett
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Privacy notice */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Dine opplysninger er sikre og brukes kun for å gi deg bedre hjelp. 
            Les vår{' '}
            <a href="/privacy" className="text-primary-600 hover:underline">
              personvernerklæring
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
