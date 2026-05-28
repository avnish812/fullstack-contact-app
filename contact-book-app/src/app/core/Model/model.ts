export interface Transaction {
  transactionId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'IN_PROGRESS';
  name: string;
  accountNumber: string;
  transForeignCurr: string;
  transFCAmt: number;
  panCard: string;
  transactionNumber: string;
  date: string;
}