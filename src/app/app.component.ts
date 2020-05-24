import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, NgForm, FormGroup } from '@angular/forms';
import { DataTableItem, DataTableDataSource} from './data-table/data-table-datasource';
import { DataTableComponent } from './data-table/data-table.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent{
  title = 'aburoWebApp';
  data : DataTableItem[] = [];
  dataSource : DataTableDataSource;
  burosUri = 'https://localhost:5001/api/ArchBuros';
  form = new FormGroup({
    addNameField : new FormControl('', [Validators.required]),
    addAddressField : new FormControl('', [Validators.required]),
  });

  constructor(ds : DataTableDataSource) {
    this.dataSource = ds;
  }
  resetAddForm() {
    this.form.reset();
    /*this.form.setValue({
      addNameField : "",
      addAddressField : "",
    });*/
    //expect(this.form.get('addAddressField').valid).toEqual(true);
  }

  private getBuros() {
    fetch(this.burosUri).then(response => {
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
   //console.log('inside assignData');
   (this.data).splice(0, this.data.length);
   myData.forEach(
     val => this.data.push(Object.assign({}, val))
   );
   console.log('inside assign data');
   console.log(this.data);
  }

  newNameIsNotEmpty(){
    let addNameFieldValue = this.form.get('addNameField').value;
    if(addNameFieldValue == ''){
      const addNameControl = this.form.get('addNameField');
      addNameControl.setErrors({
      "required": true
      });
      return false;
    }
    return true;
    //else if(DataTableDataSource.buroNameIsUnique(addNameFieldValue)){
    /*else if(this.nameIsUnique(addNameFieldValue, this.data))
      return true;
    else {
      const addNameControl = this.form.get('addNameField');
      addNameControl.setErrors({
      "notUnique": true
      });
      return false;
    }*/
  }

  newAddressIsNotEmpty() {
    let addAddressFieldValue = this.form.get('addAddressField').value;
    if(addAddressFieldValue == ''){
      const addNameControl = this.form.get('addAddressField');
      addNameControl.setErrors({
      "required": true
      });
      return false;
    }
    return true;
    //else if(DataTableDataSource.buroAddressIsUnique(addAddressFieldValue)){
    /*else if(this.addressIsUnique(addAddressFieldValue, this.data))
      return true;
    else{
      const addAddressControl = this.form.get('addAddressField');
      addAddressControl.setErrors({
      "notUnique": true
      });
      return false;
    }*/
  }

  async submit() {
    if(!(this.newNameIsNotEmpty() && this.newAddressIsNotEmpty()))
      return;
    const addNameFieldValue = this.form.get('addNameField').value;
    const addAddressFieldValue = this.form.get('addAddressField').value;
    const newBuro = {
      Name: addNameFieldValue.trim(),
      Address: addAddressFieldValue.trim(),
      ManagerId: 0
    };

    let responseIsOk = true;
    (async () => {const rawResponse = fetch(this.burosUri, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBuro)
      })
      const respContent = await (await rawResponse).json();
      if((await rawResponse).status != 201) {
        alert("Buro is not unique");
          responseIsOk = false;
      }
      else {
        const newItem = {
          id: respContent.id,
          name: newBuro.Name,
          address : newBuro.Address,
          managerId : 0,
          managerSurname : "N/A"
        }
        this.dataSource.addBuro(newItem);
      }
    })();
      this.form.reset();
  }

  nameIsUnique(buroName:string, buroData:DataTableItem[]) {
    //(this.data).splice(0, this.data.length);
    //this.getBuros();
    console.log('inside nameIsUnique');
    console.log(buroData);
    buroData.forEach(element => {
      if(element.name == buroName.trim()) {
        return false;
      }
    });
    return true;
  }

  addressIsUnique(buroAddress:string, buroData:DataTableItem[]) {
    //this.getBuros();
    buroData.forEach(element => {
      if(element.address == buroAddress.trim())
        return false;
    });
    return true;
  }


}