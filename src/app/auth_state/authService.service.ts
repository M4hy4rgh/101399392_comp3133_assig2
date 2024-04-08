import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { LOGIN, SIGNUP } from '../graphql/graphql.queries';
import { Router } from '@angular/router';
import { BrowserStorageServiceService } from '../browser-storage/BrowserStorageService.service';
import { gql } from 'apollo-angular';

@Injectable({
    providedIn: 'root',
})
export class AuthServiceService {
    error: any;

    constructor(
        private router: Router,
        private apollo: Apollo,
        private storage: BrowserStorageServiceService
    ) { }

    login(username: string, password: string): Observable<any> {
        return this.apollo
            .query({
                query: LOGIN,
                variables: {
                    username: username,
                    password: password,
                },
            })
            .pipe(
                tap(({ data, error }: any) => {
                    if (error) {
                        this.error = error;
                    } else {
                        console.log(data);
                        const expiration = new Date();
                        expiration.setHours(expiration.getHours() + 1);

                        this.storage.setItem('token', data.login.token);
                        this.storage.setItem('token_expiration', expiration.toISOString());

                        this.router.navigate(['/employee-list']);
                    }
                })
            );
    }

    logout() {
        this.storage.removeItem('token');
        this.storage.removeItem('token_expiration');
        this.router.navigate(['/login']);
    }

    async register(email: string, username: string, password: string): Promise<Observable<{ error: any, res: boolean }>> {
        const variables = {
            user: {
                email: email,
                username: username,
                password: password,
            },
        };

        // return this.apollo
        //     .mutate({
        //         mutation: SIGNUP,
        //         variables: variables,
        //     })
        //     .subscribe({
        //         next: (data) => {
        //             console.log(data);
        //             // this.router.navigate(['/login']);
        //         },
        //         error: (error) => {
        //             console.log('there was an error sending the query! --->', error);
        //             this.error = error;
        //             return {
        //                 error: error,
        //                 res: false
        //             }
        //         },
        //         complete: () => {
        //             this.router.navigate(['/login']);
        //             return {
        //                 error: null,
        //                 res: true
        //             }
        //         }
        //     });

        return new Observable(observer => {
            this.apollo
                .mutate({
                    mutation: SIGNUP,
                    variables: variables,
                })
                .subscribe({
                    next: (data) => {
                        console.log(data);
                        observer.next({ error: null, res: true }); // Emit success
                    },
                    error: (error) => {
                        console.log('there was an error sending the query! --->', error);
                        observer.next({ error: error, res: false }); // Emit error
                    },
                    complete: () => {
                        this.router.navigate(['/login']);
                        observer.complete();
                    }
                });
        });
    
            

        /** 
                return new Observable(observer => {
                    this.apollo
                    .mutate({
                        mutation: SIGNUP,
                        variables: variables,
                    })
                    .subscribe({
                        next: (data) => {
                        console.log(data);
                            observer.next(data);
                            this.router.navigate(['/login']);
                        },
                        error: (error) => {
                        console.log('there was an error sending the query! --->', error);
                        this.error = error;
                        observer.error(error);
                        },
                        complete: () => {
                        this.router.navigate(['/login']);
                        observer.complete();
                        }
                    });
                });
                }
            */

            /**
            // .subscribe((data) => {
            //     console.log(data);
            //     this.router.navigate(['/login']);
            // }
            // );
        
        
            // .pipe(
            //     tap(({ data, error }: any) => {
            //         if (error) {
            //             this.error = error;
            //             console.log('error is: ', error);
            //         } else {
            //             console.log('data is: ', data);
            //             this.router.navigate(['/login']);

            //             // const expiration = new Date();
            //             // expiration.setHours(expiration.getHours() + 1);

            //             // this.storage.setItem('token', data.register.token);
            //             // this.storage.setItem('token_expiration', expiration.toISOString());

            //             // this.router.navigate(['/employee-list']);
            //         }
            //     })
            // );
            */
    }
}
