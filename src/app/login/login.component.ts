import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {
    ReactiveFormsModule,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthServiceService } from '../auth_state/authService.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterOutlet, RouterModule, ReactiveFormsModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
    error: any;
    loading: boolean = false;

    loginForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    });

    constructor(
        private router: Router,
        private apollo: Apollo,
        @Inject(PLATFORM_ID) private platformId: Object,
        private authService: AuthServiceService
    ) { }

    ngOnInit(): void { }

    onSubmit() {
        console.log(this.loginForm.value);
        const username = this.loginForm.value?.username ?? '';
        const password = this.loginForm.value?.password ?? '';

        this.loading = true;
        this.authService.login(username, password)
            .subscribe(
                () => { },
                (error) => {
                    console.log('there was an error sending the query', error);
                    this.error = error;
                    setTimeout(() => {
                        this.error = null;
                    }, 3000);
                }
        );
        this.loading = false;
    }

    set err(error: any) {
        this.error = error;
    }

    get err() {
        return this.error;
    }

    get username() {
        return this.loginForm.get('username');
    }
}
