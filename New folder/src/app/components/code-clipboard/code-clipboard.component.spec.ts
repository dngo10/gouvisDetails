import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeClipboardComponent } from './code-clipboard.component';

describe('CodeClipboardComponent', () => {
  let component: CodeClipboardComponent;
  let fixture: ComponentFixture<CodeClipboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeClipboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeClipboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
