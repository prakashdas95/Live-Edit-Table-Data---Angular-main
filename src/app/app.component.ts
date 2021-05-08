import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface FORM {
  name: string;
  email: string;
  contact: number;
  details: string;
  isEdit: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'email', 'contact', 'details'];
  dataSource: MatTableDataSource<any>;
  public TABLEDATA: FORM[] = [];

  public hideShow: boolean = true;

  public contactform: FormGroup;

  @ViewChild("inputBox") _el: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  disable: any;
  getlocaleStorageData: any;

  ngOnInit() {
    this.contactform = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      contact: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.pattern("^[0-9]*$")]),
      details: new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z0-9]{10}$")]),
    });

    this.getlocaleStorageData = this.getFromLocalStorage();

    if (this.getlocaleStorageData?.length !== 0) {
      this.TABLEDATA = this.getlocaleStorageData;
      this.dataSource = new MatTableDataSource<any>(this.TABLEDATA);
    }
  }

  ngAfterViewInit() {
    if (this.dataSource) this.dataSource.paginator = this.paginator;
    console.log(this._el);
    this._el && this._el.nativeElement.focus();
  }

  public setFocus() {
    console.log(this._el);
    this._el && this._el.nativeElement.focus();
  }

  public onSubmit() {
    if (!this.contactform.valid) {
      return;
    }
    const data = this.contactform.value;
    this.TABLEDATA.push({ ...data, isEdit: false });
    this.dataSource = new MatTableDataSource<any>(this.TABLEDATA);

    this.saveTolocaleStorage(this.TABLEDATA);
  };

  public editValue(newValue, index, keyName) {
    // console.log('onClick', newValue, index, keyName);
    this.TABLEDATA.map((item) => {
      if (
        item['name'] === index['name'] &&
        item['email'] === index['email'] &&
        item['contact'] === index['contact'] &&
        item['details'] === index['details']

      ) {
        // console.log('found : ', item);
        item[keyName] = newValue;
        item['isEdit'] = false;
      }
    });
    this.saveTolocaleStorage(this.TABLEDATA);
    this.dataSource = new MatTableDataSource<any>(this.getFromLocalStorage());
  }

  public toggle(data: FORM) {
    console.log(data);
    data.isEdit = !data.isEdit;
  }









  //////////// localstorage 

  saveTolocaleStorage(data) {
    localStorage.setItem('formData', JSON.stringify(data))
  }

  getFromLocalStorage() {
    const formData = localStorage.getItem('formData');
    const parsedData = JSON.parse(formData);
    return parsedData;
  }
}
