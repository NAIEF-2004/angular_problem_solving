import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the courses and adds a valid course from the form', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h2')?.textContent).toContain('نظام إدارة الدورات');
    expect(compiled.querySelectorAll('.card')).toHaveLength(2);

    const titleInput = compiled.querySelector<HTMLInputElement>('#course-title');
    const priceInput = compiled.querySelector<HTMLInputElement>('#course-price');
    const form = compiled.querySelector('form');
    expect(titleInput).not.toBeNull();
    expect(priceInput).not.toBeNull();
    expect(form).not.toBeNull();
    titleInput!.value = 'Angular';
    priceInput!.value = '80';
    form!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.card')).toHaveLength(3);
    expect(compiled.textContent).toContain('Angular');
    expect(titleInput!.value).toBe('');
    expect(priceInput!.value).toBe('');
  });

  it('shows an error and does not add a course with invalid details', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const titleInput = compiled.querySelector<HTMLInputElement>('#course-title')!;
    const priceInput = compiled.querySelector<HTMLInputElement>('#course-price')!;
    const form = compiled.querySelector('form')!;
    titleInput.value = 'Angular';
    priceInput.value = '0';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.card')).toHaveLength(2);
    expect(compiled.querySelector('[role="alert"]')?.textContent).toContain('سعر أكبر من صفر');
  });

  it('allows changing availability and deleting an unavailable course', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const firstCard = compiled.querySelector<HTMLElement>('.card');

    const buttons = firstCard!.querySelectorAll<HTMLButtonElement>('.buttons button');
    buttons[0].click();
    fixture.detectChanges();
    expect(firstCard!.querySelector('.unavailable')?.textContent).toContain('غير متوفر');

    firstCard!.querySelectorAll<HTMLButtonElement>('.buttons button')[1].click();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.card')).toHaveLength(1);
    expect(compiled.textContent).not.toContain('loarn c#');
  });
});
