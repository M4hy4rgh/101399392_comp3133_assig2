/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BrowserStorageServiceService } from './BrowserStorageService.service';

describe('Service: BrowserStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrowserStorageServiceService]
    });
  });

  it('should ...', inject([BrowserStorageServiceService], (service: BrowserStorageServiceService) => {
    expect(service).toBeTruthy();
  }));
});
