import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '../auth';
import { SignUpDetails } from '../signup-detail';
import { Router } from '@angular/router';
import { EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup implements OnInit {
  public signupForm: FormGroup<{
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  public confirmPassword: FormControl<string | null> = new FormControl(
    '',
    Validators.required
  );

  constructor(private _auth: Auth, private _router: Router) {}

  ngOnInit() {
    this._auth.loggedInUser$.subscribe((loggedInUser) => {
      console.log(loggedInUser);
      if (loggedInUser) {
        this._router.navigate(['dashbaord']);
      }
    });
  }

  public onSignUp(): void {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
      const formValue = this.signupForm.value as SignUpDetails;
      this._auth
        .signUp({
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          email: formValue.email,
          password: formValue.password,
          role: 'user',
        })
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
