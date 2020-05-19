import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Component, OnInit } from '@angular/core';

// TODO: Replace this with your own data model type
export interface DataTableItem {
  id: number;
  name: string;
  address : string;
  managerId : number;
  managerSurname : string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: DataTableItem[] = [
  {id: 1, name: 'Hydrogen', managerId:1, address:"123", managerSurname:"asd"},
  {id: 2, name: 'Helium', managerId:1, address:"123", managerSurname:"asd"},
  {id: 3, name: 'Lithium', managerId:1, address:"123", managerSurname:"asd"}
];

//let buros: DataTableItem[];

const burosUri = 'https://localhost:5001/api/ArchBuros';

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DataTableDataSource extends DataSource<DataTableItem> {
  data: DataTableItem[];
  paginator: MatPaginator;
  sort: MatSort;

  constructor() {
    super();
    console.log('Inside data-table constructor');
    this.data = [];
    this.getBuros();
    console.log('Log in the enf d consr')
    console.log(this.data);
    //this.data = EXAMPLE_DATA;
  }
  
  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DataTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: DataTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: DataTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }

  private getBuros() {
    fetch(burosUri).then(response => {
      response.json().then(newData => {
        console.log(newData);
        //this.data = newData;
        this.assignData(newData);
      })
    }).catch(function (error) {
      console.error('Buros import failure');
      console.error(error);
    });
  }
  
  private assignData(myData) {
   console.log('inside assignData');
   myData.forEach(
     val => this.data.push(Object.assign({}, val))
   );
   console.log(this.data);
  }

  public static buroNameIsUnique(buroName : string) {
    return true;
  }

  public static buroAddressIsUnique(buroAddress : string) {
    return true;
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}