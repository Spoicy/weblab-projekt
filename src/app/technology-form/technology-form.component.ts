import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-technology-form',
  templateUrl: './technology-form.component.html',
  styleUrl: './technology-form.component.scss'
})
export class TechnologyFormComponent {
  title="Technology Form";

  AddForm!: FormGroup;
  isSubmit = true;
  submitMessage = "";

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.AddForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      ring: [''],
      descTechnology: ['', Validators.required],
      descClassification: ['']
    });
  }

  onSubmit() {
    if (this.AddForm.valid) {
      const formData = this.AddForm.value;

      axios
        .post('http://localhost:8000/technology/add', formData, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('id_token')
          }
        })
        .then(response => {
          this.submitMessage = "Tech saved successfully!";
          this.AddForm.reset();
        })
        .catch(error => {
          console.log(error);
          this.submitMessage = "Tech failed to send";
        })
        .finally(() => {
          this.isSubmit = true;
          setTimeout(() => {
            this.isSubmit = false;
          }, 5000);
        })
    }
  }
}
