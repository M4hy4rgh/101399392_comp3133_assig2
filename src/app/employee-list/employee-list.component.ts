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
import { Employee_model } from '../model/employee_model';
import { GET_ALL_EMPLOYEES, DELETE_EMPLOYEE } from '../graphql/graphql.queries';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    imports: [RouterOutlet, RouterModule, ReactiveFormsModule, FormsModule],
    templateUrl: './employee-list.component.html',
    styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent implements OnInit {
    #data: Employee_model[] = [];
    error: any;
    loading: boolean = false;
    anyCheckboxChecked: boolean = false;

    ngOnInit(): void {
        this.getAllEmployees();
    }

    constructor(
        private router: Router,
        private apollo: Apollo,
        @Inject(PLATFORM_ID) private platformId: Object,
        private authService: AuthServiceService
    ) { }

    async getAllEmployees() {
        // console.log("getAllEmployees");
        this.loading = true;
        this.apollo
            .watchQuery({
                query: GET_ALL_EMPLOYEES,
            })
            .valueChanges.subscribe({
                next: (res: any) => {
                    // console.log("getAllEmployees -> ", res);
                    if (res.errors) {
                        this.error = res.errors;
                        console.log('getAllEmployees -> ', this.error);
                        this.loading = false;
                    }

                    if (res.data) {
                        this.#data = res.data.getAllEmployees;
                        console.log('getAllEmployees -----> ', this.#data);
                        // this.loading = false;
                        setTimeout(() => {
                            this.loading = false;
                        }, 1500);
                    }
                },
                error: (error) => {
                    console.log('getAllEmployees -> ', error);
                    this.error = error;
                    this.loading = false;
                },
                complete: () => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 1500);
                },
            });
    }

    /**
       *   console.log("deleteEmployee -> ", res);
              if (res.errors) {
                  this.error = res.errors;
                  console.log("deleteEmployee -> ", this.error);
                  this.loading = false;
              }
  
              if (res.data) {
                  this.#data = res.data.deleteEmployee;
                  console.log("deleteEmployee -> ", this.#data);
                  this.loading = false;
              }
       */

    async deleteEmployee(_id: string) {
        console.log('deleteEmployee -> ', _id);
        this.apollo
            .mutate({
                mutation: DELETE_EMPLOYEE,
                variables: {
                    _id: _id,
                },
                refetchQueries: [
                    {
                        query: GET_ALL_EMPLOYEES,
                    },
                ],
            })
            .subscribe({
                next: (res: any) => {
                    console.log('deleteEmployee -> ', res);
                    if (res.errors) {
                        this.error = res.errors;
                        console.log('deleteEmployee -> ', this.error);
                        setTimeout(() => {
                            this.loading = false;
                        }, 1200);
                    }

                    if (res.data) {
                        this.#data = res.data.deleteEmployee;
                        console.log('deleteEmployee -> ', this.#data);
                        setTimeout(() => {
                            this.loading = false;
                        }, 1200);
                    }
                },
                error: (error) => {
                    console.log('deleteEmployee -> ', error);
                    this.error = error;
                    setTimeout(() => {
                        this.loading = false;
                    }, 1200);
                },
                complete: () => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 1200);
                },
            });
    }

    deleteSelectedItems() {
        const checkboxes = document.querySelectorAll(
            '.checkbox:checked'
        ) as NodeListOf<HTMLInputElement>;
        checkboxes.forEach((checkbox) => {
            const id = checkbox.value;
            this.loading = true;
            this.deleteEmployee(id);
            this.anyCheckboxChecked = false;
        });
    }

    selectAllCheckbox(event: Event) {
        const checkboxes = document.querySelectorAll(
            '.checkbox'
        ) as NodeListOf<HTMLInputElement>;
        if (checkboxes.length > 0) {
            let anyChecked = false;
            checkboxes.forEach((checkbox) => {
                checkbox.checked = (event.target as HTMLInputElement).checked;
                if (checkbox.checked) {
                    anyChecked = true;
                }
            });
            this.anyCheckboxChecked = anyChecked;
        } else {
            console.error('No checkboxes found');
            this.anyCheckboxChecked = false;
        }
    }

    selectCheckbox(event: Event, id: string) {
        console.log('selectCheckbox -> ', id);
        const checkboxes = document.querySelectorAll(
            '.checkbox'
        ) as NodeListOf<HTMLInputElement>;
        if (checkboxes.length > 0) {
            let allChecked = true;
            checkboxes.forEach((checkbox) => {
                if (!checkbox.checked) {
                    allChecked = false;
                }
            });
            (document.querySelector('.selectAll') as HTMLInputElement).checked =
                allChecked;
            this.anyCheckboxChecked = Array.from(checkboxes).some(
                (checkbox) => checkbox.checked
            );
        } else {
            console.error('No checkboxes found');
        }
    }

    logout() {
        this.authService.logout();
    }

    get data() {
        return this.#data;
    }

    set data(data: Employee_model[]) {
        this.#data = data;
    }
}
