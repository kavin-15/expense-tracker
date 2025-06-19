export type Expense = {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
  exchangeRate: number;
  currencyCode: string;
};

export const filterOptions = [
  'This week',
  'Last Week',
  'This month',
  'Last month',
  'This Year',
  'Last Year',
  'Custom',
];

export const getFilteredExpenses = (
  expenses: Expense[],
  filter: string,
  customStartDate?: string,
  customEndDate?: string
): Expense[] => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (filter) {
    case 'This week': {
      const day = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - day);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;
    }
    case 'Last Week': {
      const day = now.getDay();
      endDate = new Date(now);
      endDate.setDate(now.getDate() - day - 1);
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);
      break;
    }
    case 'This month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 'Last month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case 'This Year':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;
    case 'Last Year':
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear() - 1, 11, 31);
      break;
    case 'Custom':
      if (!customStartDate || !customEndDate) return [];
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
      break;
    default:
      return expenses;
  }

  return expenses
    .filter((e) => {
      const createdAt = new Date(e.createdAt);
      return createdAt >= startDate && createdAt <= endDate;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
