import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { graphqlProvider } from './graphql/graphql.provider';
import { AuthStateService } from './auth_state/authState.service';
import { BrowserStorageServiceService } from './browser-storage/BrowserStorageService.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    graphqlProvider,
  ],
};
