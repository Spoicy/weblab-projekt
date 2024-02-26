import { Component, EventEmitter, Input, Output, StateKey } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-publish-form',
  templateUrl: './publish-form.component.html',
  styleUrl: './publish-form.component.scss'
})
export class PublishFormComponent {
  @Input() tech!: any;
  @Output() closeFormEvent = new EventEmitter<string>();
  @Output() updateRefreshEvent = new EventEmitter<string>();
  PublishForm!: FormGroup;
  isSubmit = true;
  submitMessage = "";

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.PublishForm = this.formBuilder.group({
      ring: [this.tech.ring, Validators.required],
      descClassification: [this.tech.desc_classification, Validators.required]
    });
  }

  onSubmit() {
    if (this.PublishForm.valid) {
      const formData = this.PublishForm.value;
      formData.id = this.tech.id;
      console.log(formData);
      axios
        .put('http://localhost:8000/technology/publish', formData, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('id_token')
          }
        })
        .then(response => {
          this.submitMessage = "";
          this.updateRefreshEvent.emit('update');
          setTimeout(() => { return; }, 100)
          this.closeFormEvent.emit("publish");
          console.log('emited');
        })
        .catch(error => {
          console.log(error);
          this.submitMessage = "Tech failed to be published";
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
