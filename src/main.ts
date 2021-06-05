import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { hmrBootstrap } from 'hmr';
import { LicenseManager } from "@ag-grid-enterprise/core";
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

LicenseManager.setLicenseKey("CompanyName=Doxa Holdings International Pte. Ltd.,LicensedApplication=Doxa,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=2,LicensedProductionInstancesCount=0,AssetReference=AG-008521,ExpiryDate=20_June_2021_[v2]_MTYyNDE0MzYwMDAwMA==91188ec28e24aad2a6fbb822cb14cfae");

if (environment.production) {
  enableProdMode();
}

ModuleRegistry.registerModules([ClientSideRowModelModule]);
const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (environment.hmr) {
  if (module['hot']) {
    hmrBootstrap(module, bootstrap);
  }
  else {
    console.error('HMR is not enabled for webpack-dev-server!');
    console.log('Are you using the --hmr flag for ng serve?');
  }
}
else {
  bootstrap().catch(err => console.error(err));
}
