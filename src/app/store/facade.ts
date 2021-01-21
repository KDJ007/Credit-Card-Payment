import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreditCardState } from '../models/credit-card.interface';
import { load, payWithCard, payWithCardSuccess } from './actions'
import { CreditCardQuery } from './selectors';

@Injectable()
export class CreditCardPaymentFacade {
    readonly data$: Observable<CreditCardState>;

    constructor(private store: Store) {
        this.data$ = this.store.pipe(select(CreditCardQuery.getCreditCardState));
    }

    // tslint:disable-next-line:typedef
    getCreditCardData() {
        this.store.dispatch(load());
    }

    // tslint:disable-next-line:typedef
    makePayment(paymentData: CreditCardState) {
        this.store.dispatch(payWithCard({ paymentData }));
    }

    // tslint:disable-next-line:typedef
    storeCard(creditCardData) {
        this.store.dispatch(payWithCardSuccess(creditCardData));
    }
}
