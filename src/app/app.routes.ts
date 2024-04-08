import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { UpdateEmployeeComponent } from './update-employee/update-employee.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStateService } from '../app/auth_state/authState.service';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [AuthStateService]},
    { path: 'register', component: RegisterComponent, canActivate: [AuthStateService]},
    { path: 'employee-list', component: EmployeeListComponent, canActivate: [AuthStateService] },
    { path: 'employee-detail/:id', component: EmployeeDetailComponent, canActivate: [AuthStateService] },
    { path: 'add-employee', component: AddEmployeeComponent, canActivate: [AuthStateService] },
    { path: 'update-employee/:id', component: UpdateEmployeeComponent, canActivate: [AuthStateService] },
    { path: '**', redirectTo: 'login' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
