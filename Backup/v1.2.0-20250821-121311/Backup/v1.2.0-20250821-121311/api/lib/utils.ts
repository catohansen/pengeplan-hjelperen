import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('nb-NO', {
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function getDaysUntil(date: string | Date): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diffTime = d.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'paid':
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'overdue':
    case 'defaulted':
      return 'danger';
    default:
      return 'primary';
  }
}

export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+47)?[49]\d{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateAmount(amount: string): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function sumBy<T>(array: T[], key: keyof T): number {
  return array.reduce((sum, item) => {
    const value = item[key];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
}

export function getMonthName(month: number): string {
  const months = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[month];
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getPreviousMonth(): string {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;
}

export function isOverdue(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'mat': '🍽️',
    'transport': '🚗',
    'bolig': '🏠',
    'underholdning': '🎬',
    'helse': '🏥',
    'utdanning': '📚',
    'klær': '👕',
    'kommunikasjon': '📱',
    'forsikring': '🛡️',
    'sparing': '💰',
    'lønn': '💼',
    'støtte': '🤝',
    'annet': '📋',
  };
  return icons[category] || '📋';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'mat': 'bg-orange-100 text-orange-800',
    'transport': 'bg-blue-100 text-blue-800',
    'bolig': 'bg-green-100 text-green-800',
    'underholdning': 'bg-purple-100 text-purple-800',
    'helse': 'bg-red-100 text-red-800',
    'utdanning': 'bg-indigo-100 text-indigo-800',
    'klær': 'bg-pink-100 text-pink-800',
    'kommunikasjon': 'bg-cyan-100 text-cyan-800',
    'forsikring': 'bg-yellow-100 text-yellow-800',
    'sparing': 'bg-emerald-100 text-emerald-800',
    'lønn': 'bg-lime-100 text-lime-800',
    'støtte': 'bg-teal-100 text-teal-800',
    'annet': 'bg-gray-100 text-gray-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}
