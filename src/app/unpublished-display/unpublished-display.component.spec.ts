import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpublishedDisplayComponent } from './unpublished-display.component';

describe('UnpublishedDisplayComponent', () => {
  let component: UnpublishedDisplayComponent;
  let fixture: ComponentFixture<UnpublishedDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnpublishedDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnpublishedDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
