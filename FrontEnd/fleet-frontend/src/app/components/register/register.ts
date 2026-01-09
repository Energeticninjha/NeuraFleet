import { Component , ChangeDetectorRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router'; // Add this import
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  submitted = false;
  successMessage: string | null = null;
  
  // 1. Define these properties here to fix the "does not exist" errors
  passwordStrength = 0; 
  strengthLabel = '';

  regData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER'
  };

  // 2. This is the strength calculation logic
  checkStrength() {
    let score = 0;
    const pwd = this.regData.password;

    if (!pwd) {
      this.passwordStrength = 0;
      this.strengthLabel = '';
      return;
    }

    if (pwd.length > 6) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25; 
    if (/[0-9]/.test(pwd)) score += 25; 
    if (/[!@#$%^&*]/.test(pwd)) score += 25; 

    this.passwordStrength = score;

    if (score <= 25) this.strengthLabel = 'Weak';
    else if (score <= 75) this.strengthLabel = 'Medium';
    else this.strengthLabel = 'Strong';
  }
constructor(private authService: AuthService, private router: Router,private cdr: ChangeDetectorRef) {}
  // 3. This is the registration submission logic (Notice it's outside checkStrength)
 onRegister() {
  this.submitted = true;
  this.successMessage = null;
  
  // 1. Validation check
  if (!this.regData.username || !this.regData.email || !this.regData.password) return;
  if (this.regData.password !== this.regData.confirmPassword) {
    //alert("Passwords do not match!");
    return;
  }

  // 2. CREATE A CLEAN OBJECT (This is the crucial step)
  // We exclude 'confirmPassword' so Java doesn't get confused
  const dataToSave = {
    username: this.regData.username,
    email: this.regData.email,
    password: this.regData.password,
    role: this.regData.role // Ensure this matches FLEET_MANAGER/CUSTOMER/etc.
  };

  this.authService.register(dataToSave).subscribe({
next: (res) => {
  //console.log('User registered in DB:', res);
  
  // 1. Set the message IMMEDIATELY
  this.successMessage = 'Registration Successful! Redirecting...'; 
  
  // 2. Turn off the "submitted" flag to clear red validation borders
  this.submitted = false;
  this.cdr.detectChanges();

  // 3. The Timer MUST be at least 3 seconds (3000ms)
  setTimeout(() => {
    this.router.navigate(['/login']);
  }, 3000); 
},
      error: (err) => {
       console.error('Registration failed:', err);
      }
    });
  }
}