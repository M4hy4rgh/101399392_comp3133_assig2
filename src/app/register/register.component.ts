import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, RouterOutlet, ActivatedRoute } from '@angular/router';
import {
    ReactiveFormsModule,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth_state/authService.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [RouterOutlet, RouterModule, ReactiveFormsModule, FormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit{
    error: any;
    loading: boolean = false;

    registerForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email,
            Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')
        ]),
        username: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
        confirmPassword: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    });

    constructor(
        private router: Router,
        private apollo: Apollo,
        @Inject(PLATFORM_ID) private platformId: Object,
        private authService: AuthServiceService,
    ) { }

    ngOnInit(): void { }

    async onSubmit() {
        // console.log("form values -> ", this.registerForm.value);
        const email = this.registerForm.value?.email ?? '';
        const username = this.registerForm.value?.username ?? '';
        const password = this.registerForm.value?.password ?? '';
        const confirmPassword = this.registerForm.value?.confirmPassword ?? '';

        if (email === '' || username === '' || password === '') {
            this.error = 'All fields are required';
            console.log("error ->", this.error);
            setTimeout(() => {
                this.error = '';
            }, 2000);
            // alert(this.error);
            return;
        }

        if (password !== confirmPassword) {
            this.error = 'Passwords do not match';
            console.log("error ->", this.error);
            setTimeout(() => {
                this.error = '';
            }, 2000);
            // alert(this.error);
            return;
        }

        if (password.length < 6 || confirmPassword.length < 6) {
            this.error = 'Password must be at least 6 characters long';
            console.log("error ->", this.error);
            setTimeout(() => {
                this.error = '';
            }, 2000);
            // alert(this.error);
            return;
        }

        this.loading = true;
        (await this.authService.register(email, username, password))
            .subscribe({
                next: (data) => {
                    console.log(data);
                    // this.loading = false;
                    if (data.error) {
                        if (data.error.message.includes('E11000')) {
                            this.error = 'User already exists';
                            setTimeout(() => {
                                this.error = '';
                            }, 2000);
                        } else {
                            this.error = data.error.message;
                            setTimeout(() => {
                                this.error = '';
                            }, 2000);
                        }
                        this.loading = false;
                    } else {
                        this.loading = false;
                    }
                },
                error: (error) => {
                    console.log(error);
                    this.error = error;
                    this.loading = false;
                },
                complete: () => {
                    this.loading = false;
                }
            });
    }


    set err(error: any) {
        this.error = error;
    }

    get err() {
        return this.error;
    }

    get username() {
        return this.registerForm.get('username');
    }

}
