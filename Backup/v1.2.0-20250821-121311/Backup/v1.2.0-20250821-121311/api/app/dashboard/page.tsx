'use client';

import { useState, useEffect } from 'react';
import { 
  Calculator, 
  CreditCard, 
  FileText, 
  MessageCircle, 
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';
import { formatCurrency, formatDate, getCategoryIcon } from '@/lib/utils';

interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  availableBalance: number;
  totalDebt: number;
  upcomingBills: number;
  recentTransactions: any[];
  budgetOverview: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    totalIncome: 25000,
    totalExpenses: 18000,
    availableBalance: 7000,
    totalDebt: 150000,
    upcomingBills: 3200,
    recentTransactions: [
      {
        id: 1,
        description: 'Lønn',
        amount: 25000,
        type: 'income',
        category: 'lønn',
        date: new Date().toISOString(),
      },
      {
        id: 2,
        description: 'Husleie',
        amount: -8000,
        type: 'expense',
        category: 'bolig',
        date: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3,
        description: 'Matbutikk',
        amount: -1200,
        type: 'expense',
        category: 'mat',
        date: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
    budgetOverview: [
      { category: 'bolig', budget: 8000, spent: 8000, icon: '🏠' },
      { category: 'mat', budget: 3000, spent: 1200, icon: '🍽️' },
      { category: 'transport', budget: 1500, spent: 800, icon: '🚗' },
      { category: 'underholdning', budget: 1000, spent: 500, icon: '🎬' },
    ],
  });

  const [showBalance, setShowBalance] = useState(true);

  const quickActions = [
    {
      title: 'Legg til transaksjon',
      description: 'Registrer inntekt eller utgift',
      icon: Plus,
      color: 'bg-blue-500',
      href: '/transactions/new',
    },
    {
      title: 'Se budsjett',
      description: 'Oversikt over kategorier',
      icon: Calculator,
      color: 'bg-green-500',
      href: '/budget',
    },
    {
      title: 'Gjeldsoverikt',
      description: 'Hold styr på lån og gjeld',
      icon: CreditCard,
      color: 'bg-orange-500',
      href: '/debts',
    },
    {
      title: 'Regninger',
      description: 'Kommende forfall',
      icon: FileText,
      color: 'bg-purple-500',
      href: '/bills',
    },
    {
      title: 'AI-rådgiver',
      description: 'Få hjelp og råd',
      icon: MessageCircle,
      color: 'bg-indigo-500',
      href: '/ai-advisor',
    },
    {
      title: 'Støtteordninger',
      description: 'Sjekk rettigheter',
      icon: TrendingUp,
      color: 'bg-teal-500',
      href: '/support-schemes',
    },
  ];

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">Pengeplan</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-600 hover:text-primary-600"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            God morgen! 👋
          </h2>
          <p className="text-gray-600">
            Her er oversikten over økonomien din for {formatDate(new Date())}
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disponibelt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {showBalance ? formatCurrency(data.availableBalance) : '••••••'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inntekter</p>
                <p className="text-2xl font-bold text-gray-900">
                  {showBalance ? formatCurrency(data.totalIncome) : '••••••'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utgifter</p>
                <p className="text-2xl font-bold text-gray-900">
                  {showBalance ? formatCurrency(data.totalExpenses) : '••••••'}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total gjeld</p>
                <p className="text-2xl font-bold text-gray-900">
                  {showBalance ? formatCurrency(data.totalDebt) : '••••••'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hurtigvalg</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="card hover:shadow-md transition-shadow text-center group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{action.title}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Budget overview */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budsjettoversikt</h3>
            <div className="space-y-4">
              {data.budgetOverview.map((item, index) => {
                const status = getBudgetStatus(item.spent, item.budget);
                const percentage = (item.spent / item.budget) * 100;
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{item.category}</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.spent)} av {formatCurrency(item.budget)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`w-16 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full ${
                            status === 'danger' ? 'bg-red-500' : 
                            status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{Math.round(percentage)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a href="/budget" className="text-primary-600 hover:text-primary-700 font-medium">
                Se fullstendig budsjett →
              </a>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Siste transaksjoner</h3>
            <div className="space-y-3">
              {data.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getCategoryIcon(transaction.category)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a href="/transactions" className="text-primary-600 hover:text-primary-700 font-medium">
                Se alle transaksjoner →
              </a>
            </div>
          </div>
        </div>

        {/* Alerts and notifications */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Varsler</h3>
          <div className="space-y-3">
            {data.upcomingBills > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Kommende regninger</h4>
                    <p className="text-yellow-800 text-sm">
                      Du har regninger for {formatCurrency(data.upcomingBills)} som forfaller snart.
                    </p>
                    <a href="/bills" className="text-yellow-700 hover:text-yellow-800 font-medium text-sm">
                      Se detaljer →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {data.totalDebt > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Gjeldsoversikt</h4>
                    <p className="text-blue-800 text-sm">
                      Du har totalt {formatCurrency(data.totalDebt)} i gjeld. 
                      Vi kan hjelpe deg med en nedbetalingsplan.
                    </p>
                    <a href="/debts" className="text-blue-700 hover:text-blue-800 font-medium text-sm">
                      Se gjeldsplan →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
