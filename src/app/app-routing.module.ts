import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ClockComponent } from './clock/clock.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'clock', component: ClockComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
