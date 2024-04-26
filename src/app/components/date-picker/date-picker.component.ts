import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent  implements OnInit {

  @ViewChild(IonModal) calendarModal: IonModal;

  @Input() mode: 'day' | 'period' = 'day';
  @Input() startDate: Date;
  @Output() dateChange = new EventEmitter<any>();
  endDate: Date;
  formatedDate: string = '';

  constructor(
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {}

  ngOnInit() {
    if(this.mode === 'day') {
      this.startDate = this.startDate != null ? this.startDate : new Date();
      this.endDate = null;
      this.formatedDate = this.formatSimpleDate();
    } else {
      const today = new Date();
      this.startDate = new Date(today.getFullYear(), today.getMonth(), 1, 1);
      this.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      this.formatedDate = this.formatMonthDate();
    }

    this._locale = 'es';
    this._adapter.setLocale(this._locale);
  }

  changeDate(offset: number) {
    if(this.mode === 'day') {
      this.startDate.setDate(this.startDate.getDate() + offset);
      this.formatedDate = this.formatSimpleDate();
    } else {
      this.startDate.setMonth(this.startDate.getMonth() + offset);
      this.endDate.setMonth(this.endDate.getMonth() + offset + 1);
      this.startDate.setDate(1);
      this.endDate.setDate(0);
      this.formatedDate = this.formatMonthDate();
    }

    const dates = { startDate: this.startDate, endDate: this.endDate };
    this.dateChange.emit(dates);
  }

  // ======== Formateo de fechas ===========
  formatSimpleDate(): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.startDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (this.startDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else if (this.startDate.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return this.startDate.toLocaleDateString('en-GB').replace(/\//g, '/');
    }
  }

  formatMonthDate() {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const mes = meses[this.startDate.getMonth()];
    const year = this.startDate.getFullYear();

    return `${mes} ${year}`;
  }

  formatComplexDate() {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };

    const formattedStartDate = this.startDate.toLocaleDateString('es-ES', options).replace('.', '');
    const formattedEndDate = this.endDate.toLocaleDateString('es-ES', options).replace('.', '');

    return `Del ${formattedStartDate} al ${formattedEndDate}`;
  }

  // ======== Logica del modal ===========
  closeModal() {
    this.calendarModal.dismiss();
  }

onModalDateChange(event: any) {
    this.startDate = new Date(event.detail.value);
    this.formatedDate = this.formatSimpleDate();
    const dates = { startDate: this.startDate, endDate: this.endDate };
    this.dateChange.emit(dates);
    this.calendarModal.dismiss();
  }

  confirmPeriodModal() {
    this.formatedDate = this.formatComplexDate();
    this.endDate.setDate(this.endDate.getDate() + 1);
    const dates = { startDate: this.startDate, endDate: this.endDate };
    this.dateChange.emit(dates);
    this.calendarModal.dismiss();
  }

}
