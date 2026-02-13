import { Routes } from '@angular/router';
import { MainComponent } from './chatbot/ui/components/main/main';

export const routes: Routes = [ { path: '', loadComponent:()=> MainComponent }];