import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.scss'],
})
export class NumberPickerComponent  implements OnInit {

  timeout: any;
  interval: any;

  @Input() selectedNumber: number;
  @Input() max: number;
  @Input() min: number;
  @Input() step: number = 1;
  @Input() unidad: string = '';
  @Input() size: 'small' | 'large' = 'large';
  @Input() align: 'left' | 'center' | 'end' = 'center';
  @Input() dot: boolean = false;

  @Output() numberChange = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  increaseNumber() {
    if (this.selectedNumber < this.max && this.selectedNumber + this.step < this.max) {
      this.selectedNumber = this.selectedNumber + this.step;
    } else {
      this.selectedNumber = this.min;
    }
    this.numberChange.emit(this.selectedNumber);
  }

  decreaseNumber() {
    if (this.selectedNumber > this.min && this.selectedNumber - this.step > this.min) {
      this.selectedNumber = this.selectedNumber - this.step;
    } else {
      this.selectedNumber = this.max;
    }
    this.numberChange.emit(this.selectedNumber);
  }

  startIncreasing() {
    clearTimeout(this.timeout);
    clearInterval(this.interval);

    this.timeout = setTimeout(() => {
      this.interval = setInterval(() => {
        this.increaseNumber();
      }, 100);
    }, 300);
  }

  startDecreasing() {
    clearTimeout(this.timeout);
    clearInterval(this.interval);

    this.timeout = setTimeout(() => {
      this.interval = setInterval(() => {
        this.decreaseNumber();
      }, 100);
    }, 300);
  }

  resetTimers() {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  }

}
