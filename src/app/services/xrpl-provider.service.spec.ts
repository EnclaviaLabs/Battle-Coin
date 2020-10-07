import { TestBed } from '@angular/core/testing';

import { XrplProviderService } from './xrpl-provider.service';

describe('XrplProviderService', () => {
  let service: XrplProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XrplProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
