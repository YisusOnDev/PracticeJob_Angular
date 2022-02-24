import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppService } from 'src/app/_services/app.service';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BuyPremiumComponent } from './_components/buypremium/buypremium.component';
import { CompleteProfileComponent } from './_components/complete-profile/complete-profile.component';
import { ConfirmAccountComponent } from './_components/confirm-account/confirm-account.component';
import { HomeComponent } from './_components/home/home.component';
import { LoginComponent } from './_components/login/login.component';
import { NavigationComponent } from './_components/navigation/navigation.component';
import { PaymentFailureComponent } from './_components/paymentfailure/paymentfailure.component';
import { PaymentSuccessComponent } from './_components/paymentsuccess/paymentsuccess.component';
import { ProfileComponent } from './_components/profile/profile.component';
import { UserListingComponent } from './_components/user-listing/user-listing.component';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { getSpanishPaginatorIntl } from './_helpers/mat-paginator-es';
import { ContactStudentModal } from './_modals/contact-student/contact-student.modal';
import { EditOfferModal } from './_modals/edit-offer/edit-offer.modal';
import { NewOfferModal } from './_modals/new-offer/new-offer.modal';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CompleteProfileComponent,
    HomeComponent,
    NavigationComponent,
    ProfileComponent,
    ConfirmAccountComponent,
    EditOfferModal,
    NewOfferModal,
    ContactStudentModal,
    BuyPremiumComponent,
    PaymentSuccessComponent,
    PaymentFailureComponent,
    UserListingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ScrollingModule,
    ToastrModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl()},
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
