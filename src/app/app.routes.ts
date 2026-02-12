import { Routes } from '@angular/router';
import { MainComponent } from './chatbot/ui/main/main';

export const routes: Routes = [ { path: '', loadComponent:()=> MainComponent }];