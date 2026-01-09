import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,tap } from 'rxjs';
interface AuthResponse {
  token: string;
  role: string;
  username?: string;
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // This URL must match your Spring Boot controller's @RequestMapping
  private baseUrl = 'http://localhost:8080/api/auth'; 

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

 login(loginData: any): Observable<AuthResponse> {
    // You must add <AuthResponse> right after .post
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, loginData).pipe(
      tap((res: AuthResponse) => {
        if (res && res.token) {
          localStorage.setItem('authToken', res.token);
          localStorage.setItem('userRole', res.role); 
        }
      })
    );
  }

  // Helpful method to check if a user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Method to clear data on logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  }
}
