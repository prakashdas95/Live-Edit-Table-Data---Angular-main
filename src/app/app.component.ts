import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface FORM {
  name: string;
  email: string;
  contact: number;
  details: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'email', 'contact', 'details'];
  dataSource: MatTableDataSource<any>;
  TABLEDATA: FORM[] = [];


  contactform: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  disable: any;

  ngOnInit() {
    this.contactform = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      contact: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      details: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$')]),
    });

    const getlocaleStorageData = this.getFromLocalStorage();
    console.log(getlocaleStorageData);

    if (getlocaleStorageData.length !== 0) {
      this.dataSource = getlocaleStorageData;
      this.TABLEDATA = getlocaleStorageData;
      console.log(this.dataSource, getlocaleStorageData);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSubmit() {
    if (!this.contactform.valid) {
      return;
    }
    const data = this.contactform.value;
    this.TABLEDATA.push(data);
    this.dataSource = new MatTableDataSource<any>(this.TABLEDATA);

    this.saveTolocaleStorage(this.TABLEDATA);
  };

  editValue(newValue, index, keyName) {
    console.log(newValue, index, keyName);
    this.TABLEDATA.findIndex((item) => {
      if (
        item[keyName] === index[keyName] ||
        (
          item['name'] === index['name'] &&
          item['email'] === index['email'] &&
          item['contact'] === index['contact'] &&
          item['details'] === index['details']
        )
      ) {
        console.log('found : ', item);
        item[keyName] = newValue;
      }
    });
    this.saveTolocaleStorage(this.TABLEDATA);
  }


  saveTolocaleStorage(data) {
    localStorage.setItem('formData', JSON.stringify(data))
  }

  getFromLocalStorage() {
    const formData = localStorage.getItem('formData');
    const parsedData = JSON.parse(formData);
    return parsedData;
  }
}
