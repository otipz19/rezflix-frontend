import {ApiModule, Configuration} from "../../api";
import {importProvidersFrom} from "@angular/core";
import {environment} from '../../../environments/environment';

export class ApiConfig extends Configuration {
  constructor() {
    super({
      basePath: environment.basePath,
    });
  }
}

export const apiConfigProvider = importProvidersFrom(
  ApiModule.forRoot(() => new ApiConfig())
)
