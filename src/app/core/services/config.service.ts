import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly environment = environment;

  get apiBaseUrl(): string {
    return this.environment.apiBaseUrl;
  }

  get apiTimeout(): number {
    return this.environment.apiTimeout || 30000;
  }

  get enableMockApi(): boolean {
    return this.environment.enableMockApi || false;
  }

  get isProduction(): boolean {
    return this.environment.production;
  }
}
