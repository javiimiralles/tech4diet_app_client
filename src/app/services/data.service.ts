import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private fileSource = new BehaviorSubject<File | null>(null);
  currentFile = this.fileSource.asObservable();

  constructor() { }

  changeFile(file: File) {
    this.fileSource.next(file);
  }
}
