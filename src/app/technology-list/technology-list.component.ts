import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-technology-list',
  templateUrl: './technology-list.component.html',
  styleUrl: './technology-list.component.scss'
})
export class TechnologyListComponent {
  technologies!: any;
  selectedId: number = 0;
  currentState: string = '';
  selectedTech!: Object;

  ngOnInit() {
    this.getAllTechnologies();
  }

  openUpdateEdit(id: number) {
    this.getSpecificTechnology(id);
    this.currentState = 'update';
  }

  openPublishEdit(id: number) {
    this.getSpecificTechnology(id);
    this.currentState = 'publish';
  }

  closeEdit() {
    this.selectedTech = {};
    this.selectedId = 0;
    this.currentState = '';
  }

  getSpecificTechnology(id: number) {
    for (let item of this.technologies) {
      if (item.id === id) {
        this.selectedTech = item;
        this.selectedId = id;
        break;
      }
    }
  }

  getAllTechnologies() {
    axios
      .get(`http://localhost:8000/technology/all`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
      })
      .then(response => {
        this.technologies = response.data;
      });
  }

  getCategoryName(name: string) {
    switch (name) {
      case 'tools':
        return 'Tools';
      case 'techniques':
        return 'Techniques';
      case 'langsframeworks':
        return 'Languages & Frameworks';
      case 'platforms':
        return 'Platforms';
      default:
        return name;
    }
  }
}
