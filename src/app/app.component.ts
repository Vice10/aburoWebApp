import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, NgForm, FormGroup } from '@angular/forms';
import {DataTableItem} from './data-table/data-table-datasource';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent{
  title = 'aburoWebApp';
  data : DataTableItem[];

  form = new FormGroup({
    addNameField : new FormControl('', [Validators.required]),
    addAddressField : new FormControl('', [Validators.required]),
  });
  /*getNameErrorMessage() {
    if (this.form.get('addNameField').hasError('required')) {
      return 'You must enter a value';
    }
    /*else if(this.dataTable.buroNameIsUnique(this.form.get('addNameField').value))
      return 'Yee';
    return '';
  }

  getAddressErrorMessage() {
    if (this.form.get('addAddressField').hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }*/

  resetAddForm() {
    this.form.setValue({
      addNameField : "",
      addAddressField : "",
    });
    //expect(this.form.get('addAddressField').valid).toEqual(true);
  }
  newNameIsGood(){
    let addNameFieldValue = this.form.get('addNameField').value;
    if(addNameFieldValue == ''){
      const addNameControl = this.form.get('addNameField');
      addNameControl.setErrors({
      "required": true
      });
      return false;
    }
    //else if(DataTableDataSource.buroNameIsUnique(addNameFieldValue)){
    else if(this.nameIsUnique(addNameFieldValue))
      return true;
    else {
      const addNameControl = this.form.get('addNameField');
      addNameControl.setErrors({
      "notUnique": true
      });
      return false;
    }
  }

  newAddressIsGood() {
    let addAddressFieldValue = this.form.get('addAddressField').value;
    if(addAddressFieldValue == ''){
      const addNameControl = this.form.get('addAddressField');
      addNameControl.setErrors({
      "required": true
      });
      return false;
    }
    //else if(DataTableDataSource.buroAddressIsUnique(addAddressFieldValue)){
    else if(this.addressIsUnique(addAddressFieldValue))
      return true;
    else{
      const addAddressControl = this.form.get('addAddressField');
      addAddressControl.setErrors({
      "notUnique": true
      });
      return false;
    }
  }

  submit() {
    var a = this.newNameIsGood();
    var b = this.newAddressIsGood();
    if(a && b)
      alert("Gonna add buro!!");
  }

  nameIsUnique(buroName:string) {
    this.data.forEach(element => {
      if(element.name == buroName.trim())
        return false;
    });
    return true;
  }

  addressIsUnique(buroAddress:string) {
    this.data.forEach(element => {
      if(element.address == buroAddress.trim())
        return false;
    });
    return true;
  }

}
