import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '../auth';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-signin',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export class Signin implements OnInit {
  signInForm: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
  });

  constructor(private _auth: Auth, private _router: Router) {}

  ngOnInit(): void {
    this._auth.loggedInUser$.subscribe((loggedInUser) => {
      console.log(loggedInUser);
      if (loggedInUser) {
        this._router.navigate(['dashbaord']);
      }
    });
  }

  public signIn(): void {
    if (this.signInForm.valid) {
      const formData = this.signInForm.value;

      if (formData.email && formData.password) {
        this._auth
          .signIn({ email: formData.email, password: formData.password })
          .pipe(
            tap((res) => {
              if (res.token) {
                localStorage.setItem('token', res.token);

                this._auth.getLoggedInUser$(true);
              }
            })
          )
          .subscribe();
      }
    }
  }
}
