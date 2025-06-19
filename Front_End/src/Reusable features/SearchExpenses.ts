import { Expense } from "./DateRangeFilter";

export const searchExpenses = (
    expense: Expense[],
    query: string,): Expense[]=>{
        if(!query.trim)
            return expense;
        return expense.filter((expense)=>expense.description.toLowerCase().includes(query.toLowerCase()));
    };