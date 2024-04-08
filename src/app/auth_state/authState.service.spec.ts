/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthStateService } from './authState.service';

describe('Service: AuthState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthStateService],
    });
  });

  it('should ...', inject([AuthStateService], (service: AuthStateService) => {
    expect(service).toBeTruthy();
  }));
});
