import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, Alert, Tabs } from 'ionic-angular';



import { FeasyUser, FeasyList, FeasyItem, Candidate, StripForFirebase, Payment, copyObject } from '../../classes/Feasy';
import { Globals } from '../../classes/Globals';

import { PaymentSummaryPage } from '../../pages/33_payment_summary/33_payment_summary';



@Component({
  selector: 'page-payment',
  templateUrl: '32_payment.html'
})

export class PaymentPage {

  /* Segment pre-selection */
  paymentMethod: string = "cash";

  private list_key: string;
  private ChosenCandidate: FeasyUser = new FeasyUser("", "", "");
  private list: FeasyList = new FeasyList("");
  private candidate: Candidate = new Candidate();

  /* Calculations */
  private reward: number = 0;
  private listExpense: number;
  private listExpenseAndReward: number = 0;
  private feasyCommission: number = 0;
  private cashCommission: number = 0;
  private creditCardCommission: number = 0;
  private PayPalCommission: number = 0;
  private totalPaymentCash: number = 0;
  private totalPaymentCreditCard: number = 0;
  private totalPaymentPayPal: number = 0;

  constructor(public navCtrl: NavController, public globals: Globals, public navParams: NavParams,  public alertCtrl: AlertController) {
    this.list_key = navParams.get('list_key');
    if (this.list_key == undefined || this.list_key == null) {
      console.warn("PublicatedListWithShopperPage null list_key. Going back.")
      navCtrl.pop();
    } else {
      this.list = globals.GetPublishedListByKey(this.list_key);
      this.candidate = globals.getAcceptedCandidateFromList(this.list_key);
      if (this.candidate == null) {
        console.warn("PublicatedListWithShopperPage list should have an accepted candidate but non found. Going back.")
        navCtrl.pop();
      } else {
        globals.af.object("/users/" + this.candidate.uid).$ref.once("value", (snapshot: firebase.database.DataSnapshot) => {
          Object.assign(this.ChosenCandidate, snapshot.val());
          this.ChosenCandidate.SetImageOrDefault();
        });
      }
    }

    /* Calculations*/
    this.reward = Number(this.list.Reward);

    if (isNaN(this.listExpense) == true){
      this.listExpenseAndReward = this.reward;
      this.feasyCommission = 0.02*(this.reward);
      this.creditCardCommission = 0.1*(this.reward);
      this.PayPalCommission = 0.05 + 0.05*(this.reward);
      this.totalPaymentCash = this.reward - -this.cashCommission - -this.feasyCommission;
      this.totalPaymentCreditCard = this.reward - -this.creditCardCommission - -this.feasyCommission;
      this.totalPaymentPayPal = this.reward - -this.PayPalCommission - -this.feasyCommission;
    } else {
      this.listExpenseAndReward = this.listExpense - -this.reward;
      this.feasyCommission = 0.02*(this.listExpenseAndReward);
      this.creditCardCommission = 0.1*(this.listExpenseAndReward);
      this.PayPalCommission = 0.05 + 0.05*(this.listExpenseAndReward);
      this.totalPaymentCash = this.listExpenseAndReward - -this.cashCommission - -this.feasyCommission;
      this.totalPaymentCreditCard = this.listExpenseAndReward - -this.creditCardCommission - -this.feasyCommission;
      this.totalPaymentPayPal = this.listExpenseAndReward - -this.PayPalCommission - -this.feasyCommission;
    }
  }

  performPayment(): void {

    if (this.listExpense == null || this.listExpense == 0) {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: "Inserire il valore della spesa da retribuire allo shopper",
        buttons: ['Ok']
      });
      alert.present();
    } else {
      console.log("TERMINATING LIST");
      //this.navCtrl.push(PaymentPage);

      this.list.Reward = this.reward;
      this.list.ListExpense = this.listExpense;
      this.list.FeasyCommission = this.feasyCommission;
      
      if (this.paymentMethod == "cash")  {
        this.list.PaymentMethod = "Cash";
        this.list.PaymentMethodCommission = this.cashCommission;
      } else if (this.paymentMethod == "cdc"){
        this.list.PaymentMethod = "Credit Card";
        this.list.PaymentMethodCommission = this.creditCardCommission;
      } else if (this.paymentMethod == "pp"){
        this.list.PaymentMethod = "PayPal";
        this.list.PaymentMethodCommission = this.PayPalCommission;
      }

      this.list.TerminatedDate = (new Date()).toUTCString();

      this.globals.PublishedLists_db.update(this.list_key, StripForFirebase(this.list)).then(() => {
        console.log("List terminated!");
        this.globals.DeleteFromArrayByKey(this.globals.PublishedLists, this.list_key);
        let alert: Alert = this.alertCtrl.create({
          title: 'Info',
          subTitle: "Lista terminata",
          buttons: ['Ok']
        });
        alert.onDidDismiss(() => {
          this.navCtrl.popToRoot();
        });
        alert.present();
      }).catch((err: Error) => {
        console.warn("Cannot push list to published lists: " + err.message);
        this.ShowGenericError();
      });
    }
  }

  ShowGenericError() {
    let alert = this.alertCtrl.create({
      title: 'Info',
      subTitle: "C'è stato un errore durante la terminazione della lista. Ritentare nuovamente.",
      buttons: ['Ok']
    });
    alert.present();
  }

  updateVariables(): void {

    if (isNaN(this.listExpense) == true){
      this.listExpenseAndReward = this.reward;
      this.feasyCommission = 0.02*(this.reward);
      this.creditCardCommission = 0.1*(this.reward);
      this.PayPalCommission = 0.05 + 0.05*(this.reward);
      this.totalPaymentCash = this.reward - -this.cashCommission - -this.feasyCommission;
      this.totalPaymentCreditCard = this.reward - -this.creditCardCommission - -this.feasyCommission;
      this.totalPaymentPayPal = this.reward - -this.PayPalCommission - -this.feasyCommission;
    } else {
      this.listExpenseAndReward = this.listExpense - -this.reward;
      this.feasyCommission = 0.02*(this.listExpenseAndReward);
      this.creditCardCommission = 0.1*(this.listExpenseAndReward);
      this.PayPalCommission = 0.05 + 0.05*(this.listExpenseAndReward);
      this.totalPaymentCash = this.listExpenseAndReward - -this.cashCommission - -this.feasyCommission;
      this.totalPaymentCreditCard = this.listExpenseAndReward - -this.creditCardCommission - -this.feasyCommission;
      this.totalPaymentPayPal = this.listExpenseAndReward - -this.PayPalCommission - -this.feasyCommission;
    }
  }

}
