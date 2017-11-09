import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';

import { Bet } from '../../models/bet';

@Component({
  selector: 'app-bet-form',
  templateUrl: './bet-form.component.html',
  styleUrls: ['./bet-form.component.css']
})
export class BetFormComponent implements OnInit {

  prediction: number;
  private rate: number;
  private time: string;
  private hours: number;
  private coins: number; // number of coins to bet
  private balance: number; // number of coins in account
  private bets: Bet[];


  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.getWalletBalance();
    this.updateBitcoinRate();
    this.time = new Date().toLocaleTimeString();
    this.hours = new Date().getHours();
    this.coins = 5;

    this.bets = this.dataService.getBets();

    setInterval(() => this.updateBitcoinRate(), 5 * 60 * 1000);
  }

  private getWalletBalance() {
    this.dataService.getWalletBalance()
      .subscribe(data => {
        this.balance = data['balance'];
      }, err => console.error(err));
  }

  private updateBitcoinRate() {
    this.time = new Date().toLocaleTimeString();

    this.dataService.getRate()
      .subscribe(
      data => this.rate = data['bpi']['INR']['rate_float'],
      err => console.error(err)
      );
  }

  makePrediction(prediction: number) {
    this.prediction = prediction;
    this.dataService.placeBet(this.prediction)
      .subscribe(data => {

        this.bets = this.dataService.addBet(this.prediction, this.coins); // update my bets
        this.getWalletBalance(); // update my wallet balance
      }, err => console.error(err));
  }

}
