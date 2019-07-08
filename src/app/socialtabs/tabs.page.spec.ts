import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialTabsPage } from './tabs.page';

describe('SocialTabsPage', () => {
  let component: SocialTabsPage;
  let fixture: ComponentFixture<SocialTabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SocialTabsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
