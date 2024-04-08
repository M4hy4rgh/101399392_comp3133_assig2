import { Component, OnInit, Inject, PLATFORM_ID, Input } from '@angular/core';
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
import { Employee_model } from '../model/employee_model';
import { GET_EMPLOYEE_BY_ID } from '../graphql/graphql.queries';
import { CommonModule, Location } from '@angular/common';

@Component({
    selector: 'app-employee-detail',
    standalone: true,
    imports: [ RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
    templateUrl: './employee-detail.component.html',
    styleUrl: './employee-detail.component.css',
})
export class EmployeeDetailComponent implements OnInit {
    #data: Employee_model = {} as Employee_model;
    error: any;
    loading: boolean = false;

    ngOnInit(): void {
        // const currentNavigation = this.router.getCurrentNavigation();
        const _id = this.router.url.split('/')[2];
        console.log('EmployeeDetailComponent -> constructor -> id', _id);
        this.getEmployeeById(_id);
    }

    constructor(
        private router: Router,
        private apollo: Apollo,
        @Inject(PLATFORM_ID) private platformId: Object,
        private authService: AuthServiceService,
        private _location: Location
    ) {}

    async getEmployeeById(_id: string) {
        // console.log('EmployeeDetailComponent -> getEmployeeById');
        this.loading = true;
        this.apollo
            .watchQuery({
                query: GET_EMPLOYEE_BY_ID,
                variables: {
                    _id: _id,
                },
            })
            .valueChanges.subscribe({
                next: (res: any) => {
                    // console.log(
                    //     'EmployeeDetailComponent -> getEmployeeById -> next -> res',
                    //     res
                    // );
                    if (res.errors) {
                        this.error = res.errors;
                        console.log(
                            'EmployeeDetailComponent -> getEmployeeById -> next -> res.errors',
                            this.error
                        );
                        this.loading = false;
                    }

                    if (res.data) {
                        this.#data = res.data.getEmployeeById;
                        console.log(
                            'EmployeeDetailComponent -> getEmployeeById -> next -> res.data',
                            this.#data
                        );
                        setTimeout(() => {
                            this.loading = false;
                        }, 1000);
                    }
                },
                error: (error) => {
                    console.log(
                        'EmployeeDetailComponent -> getEmployeeById -> error -> err',
                        error
                    );
                    this.error = error;
                    this.loading = false;
                },
                complete: () => {
                    console.log('EmployeeDetailComponent -> getEmployeeById -> complete');
                },
            });
    }

    backAction() {
        this._location.back();
    }
    
    get data() {
        return this.#data;
    }
    
    set data(value: Employee_model) {
        this.#data = value;
    }
}
