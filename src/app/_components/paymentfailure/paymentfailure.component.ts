import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/auth.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { PremiumService } from '../../_services/premium.service';

@Component({
  selector: 'app-paymentfailure',
  templateUrl: './paymentfailure.component.html',
  styleUrls: ['./paymentfailure.component.css']
})
export class PaymentFailureComponent implements OnInit {

  constructor(private router: Router, private notificationService: NotificationService) { }

  ngOnInit() {
    alert("Payment failure")
    this.router.navigate(['home']);
    this.notificationService.showError('No hemos podido verificar tu pago, por favor vuelva a intentarlo.', 'Error de pago')
  }
}
