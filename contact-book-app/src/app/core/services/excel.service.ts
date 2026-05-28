
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as XLSX from 'xlsx';
import { Transaction } from '../Model/model';
@Injectable({
    providedIn:'root'
})

export class ExcelService{
  
    exportToExcel(data: any[], fileName: string): void {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, fileName);
      }
    
      private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(data);
        link.download = fileName + '_export_' + new Date().getTime() + '.xlsx';
        link.click();
      }
    
      importFromExcel(file: File): Promise<any> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const data = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });
            const sheetName = wb.SheetNames[0];
            const ws = wb.Sheets[sheetName];
            const contacts = XLSX.utils.sheet_to_json(ws);
            resolve(contacts);
          };
          reader.onerror = (error) => reject(error);
          reader.readAsArrayBuffer(file);
        });
      }

        getTransactions(): Observable<Transaction[]> {

    const statuses: Transaction['status'][] = [
      'SUCCESS',
      'FAILED',
      'PENDING',
      'IN_PROGRESS'
    ];

    const currencies = ['USD', 'INR', 'EUR', 'GBP'];

    const data: Transaction[] = [];

    for (let i = 1; i <= 5000; i++) {

      const randomDate = new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      );

      data.push({
        transactionId: `TSI${100000 + i}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        name: `User ${i}`,
        accountNumber: `ACC${1000 + i}`,
        transForeignCurr: currencies[Math.floor(Math.random() * currencies.length)],
        transFCAmt: Math.floor(Math.random() * 100000),
        panCard: `PAN${1000 + i}`,
        transactionNumber: `TXN${5000 + i}`,
        date: randomDate.toISOString().split('T')[0]
      });
    }

    return of(data);
  }
}