import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BuyPremiumComponent } from './_components/buypremium/buypremium.component';
import { CompleteProfileComponent } from './_components/complete-profile/complete-profile.component';
import { ConfirmAccountComponent } from './_components/confirm-account/confirm-account.component';
import { HomeComponent } from './_components/home/home.component';
import { LoginComponent } from './_components/login/login.component';
import { PaymentFailureComponent } from './_components/paymentfailure/paymentfailure.component';
import { PaymentSuccessComponent } from './_components/paymentsuccess/paymentsuccess.component';
import { ProfileComponent } from './_components/profile/profile.component';
import { UserListingComponent } from './_components/user-listing/user-listing.component';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  { path: 'index', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'confirmaccount', component: ConfirmAccountComponent, canActivate: [AuthGuard] },
  { path: 'completeprofile', component: CompleteProfileComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'gopremium', component: BuyPremiumComponent, canActivate: [AuthGuard] },
  { path: 'userlisting', component: UserListingComponent, canActivate: [AuthGuard] },
  { path: 'paymentSuccess', component: PaymentSuccessComponent, canActivate: [AuthGuard] },
  { path: 'paymentFailure', component: PaymentFailureComponent, canActivate: [AuthGuard] },

  // Otherwise redirect any 404 to /
  { path: '**', redirectTo: 'index', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
