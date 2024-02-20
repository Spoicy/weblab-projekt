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

  ContactForm!: FormGroup;
  isSubmit = true;
  submitMessage = "";

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.ContactForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      ring: [''],
      descTechnology: ['', Validators.required],
      descClassification: ['']
    });
  }

  onSubmit() {
    if (this.ContactForm.valid) {
      const formData = this.ContactForm.value;
      console.log(formData.kyc_update);

      axios
        .post('http://localhost:8000/technology/add', formData)
        .then(response => {
          this.submitMessage = "Tech saved successfully!";
          this.ContactForm.reset();
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
