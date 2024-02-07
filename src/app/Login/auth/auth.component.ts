import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Service/auth.service';

function emailValidator(control: AbstractControl): { [key: string]: any } | null {
  const email: string = control.value;
  if (email && !email.toLowerCase().endsWith('.com')) {
    return { 'invalidEmail': true };
  }
  return null;
}
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  SignUpForm!:FormGroup;
  LoginForm!:FormGroup;

  submitted = false;
constructor(private fb: FormBuilder, private service:AuthService,private toastr: ToastrService, private router:Router){
  this.LoginForm = this.fb.group({
    EmailAddress: ['', [Validators.required,Validators.email,emailValidator]],
    Password: ['', [Validators.required,Validators.maxLength]]
  })
}

  ngOnInit(){
    this.SignUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email,emailValidator]],
      pswd: ['', [Validators.required,Validators.maxLength]]
    })

   
  }
  get f() {
    return this.SignUpForm.controls;
    
  }
  get g (){
    return this.LoginForm.controls
  }

  onSubmit(){
    console.log(this.SignUpForm.value, this.SignUpForm.valid)
    this.submitted = true;
    if (this.SignUpForm.invalid) {
      return;
    }
    let data = {
      ...this.SignUpForm.value
    }
    this.service.signUp(data).subscribe((res:any) => {
      if (res) {
        this.toastr.success('Sign Up Successfully');
        this.SignUpForm.reset();
      }
      else {
        this.toastr.error(res.error, 'error')
      }
    })
  }

  onLogin(){
    console.log(this.LoginForm.value, this.LoginForm.valid);
    this.submitted = true;
    if (this.LoginForm.invalid) {
      return;
    }
    const email = this.LoginForm.value.EmailAddress;
    const pswd = this.LoginForm.value.Password;
    console.log('Email:', email, 'Password:', pswd);
    this.service.getUserByEmailAndPassword(email, pswd).subscribe(
      user => {
        console.log('API Response:', user);
    
        if (user) {
          console.log('Login successful:', user);
          this.toastr.success('Login Successful');
          this.router.navigate(['/add-student']);
          this.service.login();
        } else {
          console.log('Invalid credentials');
          this.toastr.error('Invalid Credentials');
        }
      },
      error => {
        console.error('API Error:', error);
        this.toastr.error('Error occurred while logging in');
      }
    );
  }

}
