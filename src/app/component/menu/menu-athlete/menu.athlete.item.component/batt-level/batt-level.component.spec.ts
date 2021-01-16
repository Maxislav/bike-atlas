import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattLevelComponent } from './batt-level.component';

describe('BattLevelComponent', () => {
  let component: BattLevelComponent;
  let fixture: ComponentFixture<BattLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
