import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { Subject } from 'rxjs';
import { CreditCardPaymentFacade } from '../store/facade';
import { currentDate } from '../store/reducer';
import { PaymentService } from '../services/payment.service';
import { DataConst } from '../constants/common-data.constants';
@Component({
    selector: 'app-card-payment',
    templateUrl: './card-payment.component.html',
    styleUrls: ['./card-payment.component.scss']
})
export class CardPaymentComponent implements OnInit, OnDestroy {
    unsubscribe$ = new Subject();

    paymentForm: FormGroup;
    errorMessage =  DataConst;
    errorMsg: string;
    currentDate = new Date();
    currentMonth = currentDate.getMonth() + 1;
    currentYear = currentDate.getFullYear();

    constructor(private formBuilder: FormBuilder, private facade: CreditCardPaymentFacade) { }

    // tslint:disable-next-line:typedef
    ngOnInit() {
        // tslint:disable-next-line:no-unused-expression
        this.errorMsg = this.errorMessage.FORM_ERROR;
        this.buildForm();
    }


    // tslint:disable-next-line:typedef
    buildForm() {
        this.paymentForm = this.formBuilder.group({
            amount: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
            nameOnCard: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[A-Za-z][A-Za-z -]*$')]],
            // tslint:disable-next-line:max-line-length
            cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.min(1111111111111111), Validators.max(9999999999999999)]],
            // tslint:disable-next-line:max-line-length
            expirationMonth: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.min(this.currentMonth), Validators.max(12)]],
            // tslint:disable-next-line:max-line-length
            expirationYear: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.min(this.currentYear), Validators.max(9999)]],
            // tslint:disable-next-line:max-line-length
            cardCVVNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.min(111), Validators.max(999)]]
        });
    }

    // convenience getter for easy access to form fields
    // tslint:disable-next-line:typedef
    get formControls() { return this.paymentForm.controls; }

    // tslint:disable-next-line:typedef
    onSubmit() {
        this.submitForm();
    }

    // tslint:disable-next-line:typedef
    submitForm() {
        if (this.paymentForm.status === 'VALID') {
            const expiryDate = new Date(this.paymentForm.get('expirationYear').value, this.paymentForm.get('expirationMonth').value, 1);
            const paymentFormData = {
                creditCardNumber: this.paymentForm.get('cardNumber').value.toString(),
                cardHolder: this.paymentForm.get('nameOnCard').value,
                expirationDate: expiryDate,
                securityCode: this.paymentForm.get('cardCVVNumber').value,
                amount: +this.paymentForm.get('amount').value,
            };

            this.facade.makePayment(paymentFormData);
        } else {
            // tslint:disable-next-line:no-unused-expression
            this.errorMsg = this.errorMessage.FORM_VALIDATION;
        }
    }

    // tslint:disable-next-line:typedef
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

}
