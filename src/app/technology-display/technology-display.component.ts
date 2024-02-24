import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-technology-display',
  templateUrl: './technology-display.component.html',
  styleUrl: './technology-display.component.scss'
})
export class TechnologyDisplayComponent {
  technologies!: any;

  ngOnInit() {
    axios
      .get(`http://localhost:8000/technology`)
      .then(response => {
        this.technologies = response.data;
        console.log(response.data);
      });
  }
}
