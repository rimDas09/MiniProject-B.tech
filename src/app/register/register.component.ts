import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, UserService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  semister : string[] = ['1st semister' ,'2nd semister', '3rd semister', '4th semister', '5th semister', '6th semister','7th semister','8th semister']

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private authenticationService: AuthenticationService,
      private userService: UserService,
      //private alertService: AlertService
  ) {
      if (this.authenticationService.currentUserValue) {
          this.router.navigate(['/']);
      }
  }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          username: ['', Validators.required],
          password: ['', [Validators.required, Validators.minLength(6)]],
          email: ['',Validators.required],
          semister : ['',Validators.required],
          phn : ['',Validators.required],
          registerNo : ['',Validators.required],
      });
      console.log(this.registerForm.value);
      
  }

 
  get f() { return this.registerForm.controls; }

  onSubmit() {
      this.submitted = true;

      if (this.registerForm.invalid) {
          return;
      }

      this.loading = true;
      this.userService.register(this.registerForm.value)
          .pipe(first())
          .subscribe(
              data => {
          
                  console.log("success");
                  
                  this.router.navigate(['/login']);
              },
              error => {
       
                  console.log("fail");
                  
                  this.loading = false;
              });
  }

}
