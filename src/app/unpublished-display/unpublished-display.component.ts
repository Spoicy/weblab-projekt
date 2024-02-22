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
    this.getUnpublished();
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
    this.getUnpublished();
    setTimeout(() => {
      this.selectedTech = {};
      this.selectedId = 0;
      console.log('closing');
    }, 50)
  }
  
  getUnpublished() {
    axios
      .get(`http://localhost:8000/technology/unpublished`)
      .then(response => {
        this.unpublished = response.data;
        console.log(response.data);
      });
  }
}
