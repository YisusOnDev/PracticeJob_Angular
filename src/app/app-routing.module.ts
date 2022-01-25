import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CompleteProfileComponent } from './_components/complete-profile/complete-profile.component';
import { ConfirmAccountComponent } from './_components/confirm-account/confirm-account.component';
import { HomeComponent } from './_components/home/home.component';
import { LoginComponent } from './_components/login/login.component';
import { ProfileComponent } from './_components/profile/profile.component';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'confirmaccount', component: ConfirmAccountComponent, canActivate: [AuthGuard] },
  { path: 'completeprofile', component: CompleteProfileComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  // Otherwise redirect any 404 to /
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
