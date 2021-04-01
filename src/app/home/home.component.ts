import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import readXlsxFile from 'read-excel-file'

import { Role, User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';
import * as XLSX from 'xlsx';
import { CommonServiceService } from '@app/_services/common-service.service';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    currentUser: User;
    userFromApi: User;
    saveData = false;

    personList : any =[]
    marksheet :any=[];

    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private commonServiceService :CommonServiceService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }
    
    get isAdmin() {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }

    ngOnInit() {
        this.loading = true;
        this.userService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });
      if(!this.isAdmin) {
          this.marksheet = this.commonServiceService.get("studentList")
          console.log("marksheet",this.marksheet);
          
      }
      
        
    }

    excelRecord(e) {

    const target: DataTransfer = <DataTransfer><unknown>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws); 
      
      this.personList.push(data)
      this.commonServiceService.set("data" , this.personList)

      console.log("this.StudentsRecord....",this.personList);

    }
    }

    editField: string;
    // personList: Array<any> = [
    //   { id: 1, name: 'Aurelia Vega', age: 30, companyName: 'Deepends', country: 'Spain', city: 'Madrid' },
    //   { id: 2, name: 'Guerra Cortez', age: 45, companyName: 'Insectus', country: 'USA', city: 'San Francisco' },
    //   { id: 3, name: 'Guadalupe House', age: 26, companyName: 'Isotronic', country: 'Germany', city: 'Frankfurt am Main' },
    //   { id: 4, name: 'Aurelia Vega', age: 30, companyName: 'Deepends', country: 'Spain', city: 'Madrid' },
    //   { id: 5, name: 'Elisa Gallagher', age: 31, companyName: 'Portica', country: 'United Kingdom', city: 'London' },
    // ];

    updateList(id: number, property: string, event: any) {
      const editField = event.target.textContent;
      this.personList[id][property] = editField;
      console.log(this.personList);
      
    }

    remove(id: any) {
      this.personList.push(this.personList[0][id]);
      this.personList[0].splice(id, 1);
    }

    add() {
      if (this.personList.length > 0) {
        const person = this.personList[0];
        this.commonServiceService.set("studentList" , person);
        console.log("publish data are" , this.commonServiceService.get("studentList"));
        
        
      }
    }

    changeValue(id: number, property: string, event: any) {
      this.editField = event.target.textContent;
    }
}