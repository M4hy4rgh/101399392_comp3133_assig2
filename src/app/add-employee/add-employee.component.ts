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
import { ADD_EMPLOYEE , GET_ALL_EMPLOYEES} from '../graphql/graphql.queries';

@Component({
    selector: 'app-add-employee',
    standalone: true,
    imports: [RouterModule, ReactiveFormsModule, FormsModule, CurrencyPipe],
    templateUrl: './add-employee.component.html',
    styleUrl: './add-employee.component.css',
})
export class AddEmployeeComponent implements OnInit {
    loading: boolean = false;
    error: any;
    employee_form = new FormGroup({
        first_name: new FormControl('', [Validators.required]),
        last_name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        gender: new FormControl('', [Validators.required]),
        salary: new FormControl('', [Validators.required,
            Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
        ]),
    });

    @ViewChild('modalDialog') modalDialog!: ElementRef<HTMLDialogElement>;


    constructor(
        private router: Router,
        private apollo: Apollo,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit(): void {

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
        this.apollo
            .mutate({
                mutation: ADD_EMPLOYEE,
                variables: {
                    employee: {
                        first_name: employee.first_name,
                        last_name: employee.last_name,
                        email: employee.email,
                        gender: employee.gender,
                        salary: employee.salary,
                    }
                },
                refetchQueries: [{
                    query: GET_ALL_EMPLOYEES
                }]
            })
            .subscribe({
                next: (data) => {
                    console.log(data);
                    setTimeout(() => {
                        this.error = '';
                    }, 2000);
                    this.loading = false;
                },
                error: (err) => {
                    console.log(err);
                    this.error = err;
                    if (err) {
                        if (err.message.includes('E11000')) {
                            this.error = 'User already exists';
                            setTimeout(() => {
                                this.error = '';
                            }, 2000);
                        } else {
                            this.error = err.message;
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
                    this.closeModal();
                },
            });

    }


    closeModal() {
        if (this.modalDialog) {
            this.modalDialog.nativeElement.close();
        }
    }

    back() {
        this.router.navigate(['/employees-list']);
    }

}
