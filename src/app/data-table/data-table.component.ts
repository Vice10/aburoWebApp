import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ViewRef, ApplicationRef, NgZone } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { DataTableDataSource, DataTableItem } from './data-table-datasource';
import { BehaviorSubject, from } from 'rxjs';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})

export class DataTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<DataTableItem>;
  dataSource: DataTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'address', 'managerSurname', 'buttonOptions'];
  burosUri = 'https://localhost:5001/api/ArchBuros';

  ngOnInit() {
    this.dataSource = new DataTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  refreshTable() {
    this.dataSource.paginator = this.paginator;
    this.table.renderRows();
  }

  deleteBuro(id:number){
    fetch(`${this.burosUri}/${id}`, {
      method: 'DELETE'
    })
    .then(() => this.dataSource.getBuros())
    .catch(error => console.error('Unable to delete buro', error));
  }

  public getDataTable() {
    return this.dataSource.data;
  }
}
