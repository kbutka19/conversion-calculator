import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const titleElement: HTMLElement = fixture.nativeElement.querySelector('.page-title');
    expect(titleElement.textContent?.trim()).toBe('Unit Converter');
  });

  it('should display the correct image source', () => {
    const testImageSrc = '/assets/icons/logo-256x256.png';
    fixture.detectChanges();

    const imageElement: HTMLImageElement = fixture.nativeElement.querySelector('.logo-image');
    expect(imageElement.src).toContain(testImageSrc);
  });

  it('should display an image with an alt attribute', () => {
    const imageElement: HTMLImageElement = fixture.nativeElement.querySelector('.logo-image');
    expect(imageElement.alt).toBe('Logo Image');
  });

});
