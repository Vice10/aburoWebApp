import {Component, NgModule, Input, OnInit} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormGroup, FormControl, Validators, SelectControlValueAccessor } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { DataTableDataSource, DataTableItem } from '../data-table/data-table-datasource'
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component'
export interface EmployeeItem {
    id:number,
    archBuroId : number,
    name : string,
    surname : string,
    salary : number
}

const empsBuroUri = 'https://localhost:5001/api/Employees/';
const burosUri = 'https://localhost:5001/api/ArchBuros';
@Component({
    selector: 'edit-card-form',
    templateUrl: 'edit-card-form.html',
    styleUrls: ['edit-card-form.css'],})
export class EditCardForm{
    editForm = new FormGroup({
        editNameField : new FormControl('', [Validators.required]),
        editAddressField : new FormControl('', [Validators.required]),
        selectedBuroOption : new FormControl('', [Validators.required]),
        selectedManagerOption : new FormControl('', [Validators.required])
    });
    empsBuroData : EmployeeItem[] = [];
    burosData : DataTableItem[] = [];
    selEmpId : number;
    //buroIsSelected = this.editForm.get('selectedBuroOption').value === null ? false : true;
    
    constructor() {
      this.getBuros();
      this.getEmps();
    }

    buroIsSelected() {
      this.editForm.get('selectedBuroOption').value === 0 ? false : true;
    }

    public getEmps() {
        fetch(empsBuroUri).then(response => {
          response.json().then(newData => {
            console.log(newData);
            //this.data = newData;
            this.assignEmpData(newData);
          })
        }).catch(function (error) {
          console.error('Buros import failure');
          console.error(error);
        });
      }
    
      public getBuros() {
        fetch(burosUri).then(response => {
          response.json().then(newData => {
            console.log(newData);
            //this.data = newData;
            this.assignBurosData(newData);
          })
        }).catch(function (error) {
          console.error('Buros import failure');
          console.error(error);
        });
      }
      
      private assignBurosData(myData) {
       //console.log('inside assignData');
       myData.forEach(
         val => this.burosData.push(Object.assign({}, val))
       );
       //console.log(this.data);
      }
      
    private assignEmpData(myData) {
       //console.log('inside assignData');
      myData.forEach(
       val => this.empsBuroData.push(Object.assign({}, val))
      );
       //console.log(this.data);
    }

    resetEditForm() {
        this.editForm.reset();
    }

    submitPut() {

      const editNameFieldValue = this.editForm.get('editNameField').value;
      const editAddressFieldValue = this.editForm.get('editAddressField').value;
      const editBuroId = parseInt(this.editForm.get('selectedBuroOption').value, 10);
      const editManagerId = parseInt(this.editForm.get('selectedManagerOption').value, 10);
      var manager = this.empsBuroData.find(e => e.id == editManagerId);
      if(manager != null && manager.archBuroId != editBuroId) {
        alert("Manager and buro mismatch");
        this.resetEditForm();
        return; 
      }
      const newBuro = {
        Id : editBuroId,
        Name: editNameFieldValue.trim(),
        Address: editAddressFieldValue.trim(),
        ManagerId: editManagerId
      };

      let responseIsOk = true;
      (async () => {const rawResponse = fetch(`${burosUri}/${editBuroId}`, {
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBuro)
      })
      //const respContent = await (await rawResponse).json();
      if((await rawResponse).status != 204) {
        alert("Buro is not unique");
          responseIsOk = false;
      }
    })();
      this.resetEditForm();
    }
}