import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss'],
})
export class UploadFormComponent  implements OnInit {

  @Input() labelText: string;

  fileName: string;

  constructor(private dataService: DataService) { }

  ngOnInit() {}

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let file: File | null = null;
    if(element.files) {
      file = element.files[0];
      this.fileName = file.name;
    }
    this.dataService.changeFile(file);
  }

}
