import { Component, ViewChild, ElementRef, HostListener, OnDestroy  } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-datapicker',
  templateUrl: './datapicker.component.html',
  styleUrls: ['./datapicker.component.css']
})
export class DatepickerComponent implements OnDestroy {

  isCalendarOpen: boolean = false; // Чи відкритий календар 
  
    public selectedDate: Date = new Date();// Вибрана дана (За замовчуванням на даний момент)
  formattedDate:any = new Date().toDateString(); // Дата у потрібному для відображення форматі
  scrollContainer: Element | Window | null = null;
  private calendarScrollListener: EventListener | null = null; // Слухач подій, чи здійснюється скролл

  constructor(private datePipe: DatePipe, private elementRef: ElementRef) {
     this.formattedDate 
     this.unregisterScrollEvent();
     console.log(this.selectedDate)
  }
  @ViewChild('calendarContainer', { static: false }) calendarContainer!: ElementRef;

  ngOnDestroy() {
    this.unregisterScrollEvent();
  }

// Закриття календаря на скролл
  closeCalendarOnScroll() {
    this.isCalendarOpen = false;
    this.unregisterScrollEvent();
  }
  registerScrollEvent() {
    if (this.isCalendarOpen) {
      this.calendarScrollListener = this.closeCalendarOnScroll.bind(this);
      this.scrollContainer?.addEventListener('scroll', this.calendarScrollListener, true);
    }
  }
  unregisterScrollEvent() {
    if (this.calendarScrollListener && this.scrollContainer) {
      this.scrollContainer.removeEventListener('scroll', this.calendarScrollListener, true);
      this.scrollContainer = null;
    }
  }
  toggleCalendar() {
    this.isCalendarOpen = !this.isCalendarOpen;
    this.scrollContainer = this.isCalendarOpen ? window : this.calendarContainer.nativeElement;
    this.registerScrollEvent();
  }

  // Дія на вибір дати у календарі
   selectDate(date: Date) {
     this.selectedDate = date;
     this.formatDate();
     this.isCalendarOpen = false;
   }
   //Отримання формату дати
   formatDate() {
     this.formattedDate = this.datePipe.transform(this.selectedDate, 'EEE MMM dd yyyy ') || '';
   }
   // Отримання днів тижня англійською
   get weekdays() {
     return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri ', 'Sat', 'Sun'];
   }
   // Отримання всіх днів тижня
   get calendarDays() {
    return this.calculateFirstDayOfCalendar();
  }
  //Отримання назви поточного місяця
  getMonthName() {
    return this.selectedDate.toLocaleString('en-EN', { month: 'long' });
  }

  //Отримання попереднього місяця для відмальовування у пустих комірках поточного місяця
  getPreviousMonthDate(date: Date ):any {
    if (!date) {
      return '';
    }
    const currentDate = new Date();
    if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
      return date.getDate().toString();
    } else {
      return this.datePipe.transform(date, 'dd');
    }
  }

  previousMonth() {
    const currentMonth = this.selectedDate.getMonth();
    this.selectedDate = new Date(this.selectedDate.getFullYear(), currentMonth - 1, 1);
    this.formatDate();
  }
  
  nextMonth() {
    const currentMonth = this.selectedDate.getMonth();
    this.selectedDate = new Date(this.selectedDate.getFullYear(), currentMonth + 1, 1);
    this.formatDate();
    this.calculateFirstDayOfCalendar();
  }
  
  getPreviousMonth() {
    const currentMonth = this.selectedDate.getMonth();
    this.selectedDate = new Date(this.selectedDate.getFullYear(), currentMonth - 1, 1);
    this.formatDate();
    this.calculateFirstDayOfCalendar();
  }
  
  getNextMonth() {
    const currentMonth = this.selectedDate.getMonth();
    this.selectedDate = new Date(this.selectedDate.getFullYear(), currentMonth + 1, 1);
    this.formatDate();
    this.calculateFirstDayOfCalendar();
  }

  calculateFirstDayOfCalendar() {
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const firstWeekday = firstDayOfMonth.getDay();
  
    const prevMonth = new Date(year, month - 1, 1);
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    const startDay = lastDayOfPrevMonth - firstWeekday + 1;
  
    const calendarDays = [];
    let currentDay = startDay;
  
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (currentDay >= 1 && currentDay <= lastDayOfPrevMonth) {
          const day = new Date(year, month - 1, currentDay);
          week.push(day);
        } else {
          const day = new Date(year, month, currentDay - lastDayOfPrevMonth);
          week.push(day);
        }
        currentDay++;
      }
      calendarDays.push(week);
    }
  
    return calendarDays;
  }

 isDateSelected(date: Date) {
   return date.toDateString() === this.selectedDate.toDateString();
 }

 isDateToday(date: Date) {
   const today = new Date();
   return date.toDateString() === today.toDateString();
 }

 
   @HostListener('document:click', ['$event'])
   onClick(event: MouseEvent) {
     const targetElement = event.target as HTMLElement;
     const calendarElement = this.elementRef.nativeElement.querySelector('.calendar');
     const inputElement = this.elementRef.nativeElement.querySelector('input');

     if (calendarElement && calendarElement.contains(targetElement)) {
       // Якщо клік відбувся на елементі, який представляє календар, то нічого не робимо
       return;
     }

   if (inputElement && inputElement.contains(targetElement)) {
       // Якщо клік відбувся на елементі input, то тільки відкриваємо меню
       this.isCalendarOpen = true;
     } else {
       // Інакше, закриваємо меню
       this.isCalendarOpen = false;     
      }
   }
 }

