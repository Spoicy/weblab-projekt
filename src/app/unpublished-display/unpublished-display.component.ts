import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-unpublished-display',
  templateUrl: './unpublished-display.component.html',
  styleUrl: './unpublished-display.component.scss'
})
export class UnpublishedDisplayComponent {
  unpublished!: any;
  selectedId: number = 0;
  selectedTech!: Object;

  ngOnInit() {
    axios
      .get(`http://localhost:8000/technology/unpublished`)
      .then(response => {
        this.unpublished = response.data;
        console.log(response.data);
      });
  }

  openPublishEdit(id: number) {
    for (let item of this.unpublished) {
      if (item.id === id) {
        this.selectedTech = item;
        this.selectedId = id;
        break;
      }
    }
  }

  closePublishEdit() {
    this.selectedTech = 0;
    this.selectedTech = {};
  }
}
