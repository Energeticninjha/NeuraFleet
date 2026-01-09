import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Add this
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router'; // Add this
import { AuthService } from '../../services/auth';
import {  ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], // Add them here
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  submitted = false;
  errorMessage: string = '';
  loginData = {
    username: '',
    password: '',
    role: 'ADMIN' // Default role
  };
  // onLogin() {
  //   this.submitted = true;
  //   if (!this.loginData.username || !this.loginData.password) {
  //     return;
  //   }
  //   console.log('Attempting login with:', this.loginData);
  // }
  constructor(private authService: AuthService, private router: Router,private cdr: ChangeDetectorRef) {}

login() {
  this.submitted = true;
  this.errorMessage = '';
  if (!this.loginData.username || !this.loginData.password) return;

  // Create a clean payload without the 'role'
  const cleanPayload = {
    username: this.loginData.username,
    password: this.loginData.password
  };

  this.authService.login(cleanPayload).subscribe({
    next: (response) => {
      localStorage.setItem('authToken', response.token); 
      localStorage.setItem('userRole', response.role); 
      this.router.navigate(['/dashboard']);
    },
      error: (err) => {
  if (err.status === 404) {
    this.errorMessage = "User not found. Please register.";
  } else if (err.status === 401) {
    this.errorMessage = "Invalid Password.";
  } else if (err.status === 403) {
    this.errorMessage = "Forbidden: Check credentials or backend roles.";
  } else {
    this.errorMessage = "Connection error. Is the backend running?";
  }
  this.cdr.detectChanges();
}
    });
  }
}