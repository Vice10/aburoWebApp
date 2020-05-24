import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataTableItem } from './data-table-datasource'

@Injectable({
    providedIn: 'root',
})
export class DataTableService{
    public serviceData: DataTableItem[];

    addNewElem(newItem : DataTableItem) : Observable<DataTableItem[]>{
        this.serviceData.push(newItem);
        return of(this.serviceData);
    }
}