import { Component, OnInit, Inject, PLATFORM_ID, Input, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, RouterOutlet, ActivatedRoute } from '@angular/router';
import {
    ReactiveFormsModule,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { Employee_model, Employee_Imput } from '../model/employee_model';
import { UPDATE_EMPLOYEE, GET_ALL_EMPLOYEES,GET_EMPLOYEE_BY_ID } from '../graphql/graphql.queries';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CurrencyPipe],
  templateUrl: './update-employee.component.html',
  styleUrl: './update-employee.component.css'
})
export class UpdateEmployeeComponent implements OnInit {
    #data: Employee_model = {} as Employee_model;
    loading: boolean = false;
    error: any;
    id: string = '';
    employee_form = new FormGroup({
        first_name: new FormControl('', [Validators.required]),
        last_name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        gender: new FormControl('', [Validators.required]),
        salary: new FormControl('', [Validators.required,
            Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
        ]),
    });

    constructor(
        private router: Router,
        private apollo: Apollo,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit(): void {
        const _id = this.router.url.split('/')[2];
        console.log('-> constructor -> id', _id);
        this.id = _id;
        this.getEmployeeById(_id);

    }

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
                        this.employee_form.patchValue({
                            first_name: this.#data.first_name,
                            last_name: this.#data.last_name,
                            email: this.#data.email,
                            gender: this.#data.gender,
                            salary: this.#data.salary.toString(),
                        });
    
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

    onsubmit() {
        // console.log(this.employee_form.value);
        const first_name = this.employee_form.value?.first_name ?? '';
        const last_name = this.employee_form.value?.last_name ?? '';
        const email = this.employee_form.value?.email ?? '';
        const gender = this.employee_form.value?.gender?.toLowerCase() ?? '';
        const salary = this.employee_form.value?.salary ?? '';


        const employee: Employee_Imput = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            gender: gender,
            salary: parseFloat(salary),
        };

        if (this.employee_form.invalid) {
            this.error = 'All fields are required';
            console.log("error ->", this.error);
            setTimeout(() => {
                this.error = '';
            }, 2000);
            return;
        }

        if (parseFloat(this.employee_form.value?.salary ?? '') < 0) {
            this.error = 'Salary must be greater than 0';
            console.log("error ->", this.error);
            setTimeout(() => {
                this.error = '';
            }, 2000);
            return;
        }

        this.loading = true;
        this.apollo.mutate({
            mutation: UPDATE_EMPLOYEE,
            variables: {
                _id: this.id,
                employee: employee
            },
            refetchQueries: [{
                query: GET_ALL_EMPLOYEES
            }]
        }).subscribe({
            next: (data) => {
                // this.loading = false;
                // this.router.navigate(['/employees-list']);
                console.log(data);
                setTimeout(() => {
                    this.error = '';
                }, 2000);
                this.loading = false;
            },
            error: (error) => {
                // this.loading = false;
                // this.error = error;
                // console.log("error ->", this.error);
                // setTimeout(() => {
                //     this.error = '';
                // }, 2000);
                console.log(error);
                    this.error = error;
                    if (error) {
                        if (error.message.includes('E11000')) {
                            this.error = 'User already exists';
                            setTimeout(() => {
                                this.error = '';
                            }, 2000);
                        } else {
                            this.error = error.message;
                            setTimeout(() => {
                                this.error = '';
                            }, 2000);
                        }
                        this.loading = false;
                    }
            },
            complete: () => {
                this.loading = false;

                this.router.navigate(['/employees-list']);
            },
        });



    }

    back() {
        this.router.navigate(['/employees-list']);
    }

    get data() {
        return this.#data;
    }

    set data(value: Employee_model) {
        this.#data = value;
    }
}
