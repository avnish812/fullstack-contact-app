import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ContactService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    // Upload contacts
    uploadContacts(file: any): Observable<any> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        const headers = new HttpHeaders();
        return this.http.post(`${this.apiUrl}/upload`, formData, { headers });
    }

    getContacts(page: number, limit: number, search: string, sortBy: string, sortOrder: string, filters?: any): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString())
            .set('search', search)
            .set('sortBy', sortBy)
            .set('sortOrder', sortOrder);

        for (const key in filters) {
            if (filters[key]) {
                params = params.set(key, filters[key]);
            }
        }

        return this.http.get(`${this.apiUrl}/contacts`, { params });
    }

    updateContact(id: any, contact: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, contact);
    }

    addContacts(contact: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/addContacts`, contact);
    }

    deleteContact(id: any): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete`);
    }

    deleteContacts(ids: any[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/delete`, { ids });
    }
private searchCache =
  new Map<string, any[]>();

private filterCache =
  new Map<string, any[]>();



/* =========================================
   GLOBAL SEARCH
========================================= */

search(

  data: any[],

  value: string

): any[] {

  const searchValue =
    value
    .toLowerCase()
    .trim();

  // RESET
  if (!searchValue) {

    return data;
  }

  // CACHE HIT
  if (
    this.searchCache
    .has(searchValue)
  ) {

    return this.searchCache
    .get(searchValue)!;
  }

  // RESULT
  const result = [];

  // LOOP
  for (
    let i = 0;
    i < data.length;
    i++
  ) {

    const item =
      data[i];

    if (

      item?.searchText
      ?.includes(searchValue)

    ) {

      result.push(item);
    }
  }

  // STORE CACHE
  this.searchCache.set(
    searchValue,
    result
  );

  return result;
}



/* =========================================
   DROPDOWN FILTERS
========================================= */

applyFilters(

  data: any[],

  filters: any

): any[] {

     // CHECK FILTERS
  const hasFilters =

    filters?.status?.length ||

    filters?.currency?.length ||

    filters?.paymentMode?.length ||

    filters?.source?.length;


  // NO FILTERS
  if (!hasFilters) {

    return data;
  }

  // CACHE KEY
const cacheKey =
  JSON.stringify({

    status:
      filters.status ?? [],

    currency:
      filters.currency ?? [],

    paymentMode:
      filters.paymentMode ?? [],

    source:
      filters.source ?? []
  });

  // CACHE HIT
  if (
    this.filterCache
    .has(cacheKey)
  ) {

    return this.filterCache
    .get(cacheKey)!;
  }

  let filteredData =
    [...data];

  // FILTER KEYS
  const filterKeys = [

    'status',
    'currency',
    'paymentMode',
    'source'
  ];


  // LOOP FILTERS
  for (
    let i = 0;
    i < filterKeys.length;
    i++
  ) {

    const key =
      filterKeys[i];

    const selectedValues =
      filters[key];

    // SKIP
    if (
      !selectedValues?.length
    ) {

      continue;
    }

    // TEMP RESULT
    const tempResult = [];

    // DATA LOOP
    for (
      let j = 0;
      j < filteredData.length;
      j++
    ) {

      const item =
        filteredData[j];

      if (

        selectedValues
        .includes(item[key])

      ) {

        tempResult.push(item);
      }
    }

    filteredData =
      tempResult;
  }

  // STORE CACHE
  this.filterCache.set(
    cacheKey,
    filteredData
  );

  return filteredData;
}



/* =========================================
   CLEAR CACHE
========================================= */

clearCache(): void {

  this.searchCache.clear();

  this.filterCache.clear();
}
}