import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-paymentfailure',
  templateUrl: './paymentfailure.component.html',
  styleUrls: ['./paymentfailure.component.css']
})
export class PaymentFailureComponent implements OnInit {

  constructor(private router: Router, private notificationService: NotificationService) { }

  ngOnInit() {
    /// Return to home cause payment failed but show a message with the information
    this.router.navigate(['home']);
    this.notificationService.showError('No hemos podido verificar tu pago, por favor vuelva a intentarlo.', 'Error de pago')
  }
}
