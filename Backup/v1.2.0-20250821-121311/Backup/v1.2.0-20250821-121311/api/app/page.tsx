'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Shield, 
  Heart, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Smartphone,
  Lock
} from 'lucide-react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setIsLoading(true);
    // Redirect to onboarding or sign up
    window.location.href = '/onboarding';
  };

  const features = [
    {
      icon: Calculator,
      title: 'Enkelt budsjett',
      description: 'Få oversikt over inntekter og utgifter med automatisk kategorisering'
    },
    {
      icon: Shield,
      title: 'Gjeldsoversikt',
      description: 'Hold styr på alle gjeldsposter og få hjelp til nedbetaling'
    },
    {
      icon: Heart,
      title: 'Støtteordninger',
      description: 'Få informasjon om hvilke ytelser du kan ha rett på'
    },
    {
      icon: Users,
      title: 'AI-veiledning',
      description: 'Få personlig råd og svar på spørsmål om økonomi'
    }
  ];

  const benefits = [
    '100% gratis å bruke',
    'Ingen reklame eller salg av data',
    'Sikker og kryptert',
    'Tilgjengelig på alle enheter',
    'Støtte på norsk',
    'Integrert med NAV-tjenester'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">Pengeplan</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                Funksjoner
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-primary-600 transition-colors">
                Om oss
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                Logg inn
              </Link>
            </nav>
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-primary-600">
                <span className="sr-only">Åpne meny</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Din digitale{' '}
            <span className="text-primary-600">økonomiske hjelper</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Pengeplan hjelper deg med å få bedre kontroll over økonomien din. 
            Gratis budsjettverktøy, gjeldsoversikt og veiledning til støtteordninger.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Laster...' : 'Kom i gang gratis'}
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link href="#demo" className="btn-secondary text-lg px-8 py-3">
              Se demo
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span>Sikker og kryptert</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              <span>Fungerer på alle enheter</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span>100% gratis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Alt du trenger for bedre økonomi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pengeplan kombinerer de viktigste verktøyene for å hjelpe deg med å få kontroll over økonomien din.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Hvorfor velge Pengeplan?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Vi har laget Pengeplan spesielt for deg som trenger litt ekstra hjelp med økonomien. 
                Alt er designet for å være enkelt, trygt og tilgjengelig.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Budsjett på 5 minutter</h3>
                    <p className="text-sm text-gray-600">Enkel registrering og oppsett</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sikker og privat</h3>
                    <p className="text-sm text-gray-600">Dine data er beskyttet</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-warning-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Gratis for alle</h3>
                    <p className="text-sm text-gray-600">Ingen skjulte kostnader</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Klar til å ta kontroll over økonomien din?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Start gratis i dag og få bedre oversikt over din økonomiske situasjon.
          </p>
          <button
            onClick={handleGetStarted}
            disabled={isLoading}
            className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors text-lg"
          >
            {isLoading ? 'Laster...' : 'Kom i gang nå'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Pengeplan</h3>
              <p className="text-gray-400">
                Din digitale økonomiske hjelper for bedre kontroll over økonomien.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Funksjoner</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Personvern</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Vilkår</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Støtte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Hjelp</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Kontakt</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sosiale medier</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Facebook</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Pengeplan. Alle rettigheter forbeholdt.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
