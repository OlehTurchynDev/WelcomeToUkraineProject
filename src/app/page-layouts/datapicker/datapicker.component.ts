import { Component, ViewChild, ElementRef, HostListener, OnDestroy, Input } from '@angular/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-datapicker',
  templateUrl: './datapicker.component.html',
  styleUrls: ['./datapicker.component.css']
})

export class DatepickerComponent implements OnDestroy {

  isCalendarOpen: boolean = false; // Флаг для відкриття/закриття календаря
  selectedDate: Date = new Date(); // Обраний день (за замовчуванням - сьогоднішній)
  formattedDate: any = new Date().toDateString(); // Форматована дата для відображення
  isEditing: boolean = false; // Додаємо змінну для відстеження режиму редагування


  scrollContainer: Element | Window | null = null;
  calendarScrollListener: EventListener | null = null; // Слухач подій для скролу

  @Input() lang: string = 'en'; // Default language is English
  @Input() dateFormat: string = 'EEE MMM dd yyyy';
  
  // Масив місяців
  monthsEn: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthsUk: string[] = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
  
  // Use the appropriate array based on the 'lang' parameter
 get months(){
  const monthLang = this.lang === 'uk' ? this.monthsUk : this.monthsEn;
  return monthLang;
 }   // Масив років (від 2000 до 2049 Включно)

 
  years: number[] = Array.from({length: 50}, (_, index) => index + 2000);


  isMonthDropdownOpen: boolean = true;
  isYearDropdownOpen: boolean = true;
  selectedDateMonth: number = this.selectedDate.getMonth(); // Значення початкового місяця
  selectedDateYear: number = this.selectedDate.getFullYear(); // Значення початкового року


  constructor(private datePipe: DatePipe, private elementRef: ElementRef) {
    this.formattedDate = this.datePipe.transform(this.selectedDate, 'EEE MMM dd yyyy ') || ''; // Форматуємо дату для відображення
    this.unregisterScrollEvent();
    console.log(this.dateFormat)
  }


  ngOnChanges() {
    this.updateInputValue();
  }
  @ViewChild('calendarContainer', { static: false }) calendarContainer!: ElementRef;

  ngOnDestroy() {
    this.unregisterScrollEvent();
  }


  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      const inputElement = document.querySelector('.date-edit') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }
  }

editDate() {
  this.isEditing = true; // Увімкнути режим редагування
  this.registerKeydownEvent(); // Реєструємо подію натискання клавіш
}

// Обробка натискання клавіш під час редагування
onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === 'Escape') {
    this.isEditing = false; // Вимкнути режим редагування при натисканні Enter або Escape
    this.unregisterKeydownEvent(); // Скасовуємо реєстрацію події натискання клавіш
  }
}

// Реєстрація події натискання клавіш
registerKeydownEvent() {
  document.addEventListener('keydown', this.onKeydown.bind(this));
}

// Відміна реєстрації події натискання клавіш
unregisterKeydownEvent() {
  document.removeEventListener('keydown', this.onKeydown.bind(this));
}
// Методи для відкриття / закриття дропдаунів
toggleMonthDropdown(event: Event) {
  event.stopPropagation(); // Зупинити подальше поширення події кліку
  this.isMonthDropdownOpen = !this.isMonthDropdownOpen;
}


toggleYearDropdown(event: Event) {
  event.stopPropagation(); // Зупинити подальше поширення події кліку
  this.isYearDropdownOpen = !this.isYearDropdownOpen;
}

// Методи для обробки зміни місяця і року
onMonthChange() {
  this.selectedDate = new Date(this.selectedDateYear, this.selectedDateMonth, 1);
  this.formatDate();
  this.calculateFirstDayOfCalendar();
  this.selectedDateMonth = this.selectedDate.getMonth();
}

onYearChange() {
  this.selectedDate = new Date(this.selectedDateYear, this.selectedDateMonth, 1);
  this.formatDate();
  this.calculateFirstDayOfCalendar();
}


  // Закриття календаря під час скролу
  closeCalendarOnScroll() {
    this.isCalendarOpen = false;
    this.unregisterScrollEvent();
  }

  // Реєстрація слухача подій для скролу
  registerScrollEvent() {
    if (this.isCalendarOpen) {
      this.calendarScrollListener = this.closeCalendarOnScroll.bind(this);
      this.scrollContainer?.addEventListener('scroll', this.calendarScrollListener, true);
    }
  }

  // Відміна реєстрації слухача подій для скролу
  unregisterScrollEvent() {
    if (this.calendarScrollListener && this.scrollContainer) {
      this.scrollContainer.removeEventListener('scroll', this.calendarScrollListener, true);
      this.scrollContainer = null;
    }
  }

  // Перемикання стану відкриття/закриття календаря
  toggleCalendar() {
    this.isCalendarOpen = !this.isCalendarOpen;
    this.scrollContainer = this.isCalendarOpen ? window : this.calendarContainer.nativeElement;
    this.registerScrollEvent();
  }

  // Дія при виборі дати в календарі
  selectDate(date: Date) {
    this.selectedDate = date;
    this.formatDate();
    this.formattedDate = this.datePipe.transform(date, 'EEE MMM dd yyyy ') || '';
    this.isCalendarOpen = false;
  }

  // Форматування дати
  formatDate() {
    this.formattedDate = this.datePipe.transform(this.selectedDate, 'EEE MMM dd yyyy ') || '';
  }
  // Method to format the selected date based on the chosen language and date format
  formatSelectedDate(): string {
    const monthNames = this.lang === 'uk' ? this.monthsUk : this.monthsEn;
    return this.datePipe.transform(this.selectedDate, this.dateFormat + ` (${monthNames[this.selectedDate.getMonth()]})`) || '';
  }
  updateInputValue() {
    this.formattedDate = this.formatSelectedDate();
  }

  // Отримання днів тижня англійською
  get weekdays() {
    const weekdaysLang = this.lang === 'en'? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
    return weekdaysLang;
  }

  // Отримання всіх днів місяця
  get calendarDays() {
    return this.calculateFirstDayOfCalendar();
  }

  // Отримання назви поточного місяця
  getMonthName() {
    
    const monthNames = this.lang === 'uk' ? this.monthsUk : this.monthsEn;
  return monthNames[this.selectedDate.getMonth()];
  }

  // Отримання дати попереднього місяця для відображення у пустих комірках поточного місяця
  getPreviousMonthDate(date: Date): any {
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

  // Отримання попереднього місяця для відображення у пустих комірках поточного місяця
  getPreviousMonth() {
    const currentMonth = this.selectedDate.getMonth();
    this.selectedDate = new Date(this.selectedDate.getFullYear(), currentMonth - 1, 1);
    this.formatDate();
    this.calculateFirstDayOfCalendar();
  }

  // Отримання наступного місяця для відображення у пустих комірках поточного місяця
  getNextMonth() {
    const currentMonth = this.selectedDate.getMonth();
    this.selectedDate = new Date(this.selectedDate.getFullYear(), currentMonth + 1, 1);
    this.formatDate();
    this.calculateFirstDayOfCalendar();
  }

  // Обчислення кількості днів у заданому місяці та році
daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

  // Розрахунок днів місяця для відображення у календарі
  calculateFirstDayOfCalendar() {
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const firstWeekday = firstDayOfMonth.getDay();
  
    const startDay = firstWeekday === 0 ? -5 : 2 - firstWeekday;
  
    const calendarDays = [];
    let currentDay = startDay;
  
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        const day = new Date(year, month, currentDay);
        const dayData = {
          date: day,
          isCurrentMonth: currentDay >= 1 && currentDay <= this.daysInMonth(year, month),
        };
        week.push(dayData);
        currentDay++;
      }
      calendarDays.push(week);
    }
  
    return calendarDays;
  }
  

  // Перевірка, чи дата вибрана
  isDateSelected(date: Date) {
    return date.toDateString() === this.selectedDate.toDateString();
  }

  // Перевірка, чи дата сьогоднішня
  isDateToday(date: Date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  // Обробка кліку поза календарем
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const calendarElement = this.elementRef.nativeElement.querySelector('.calendar');
    const inputElement = this.elementRef.nativeElement.querySelector('input');

    if (calendarElement && calendarElement.contains(targetElement)) {
      // Клік відбувся на елементі календаря, нічого не робимо
      return;
    }

    if (inputElement && inputElement.contains(targetElement)) {
      // Клік відбувся на елементі input, відкриваємо календар
      this.isCalendarOpen = true;
    } else {
      // Клік відбувся поза календарем та input, закриваємо календар
      this.isCalendarOpen = false;
    }
  }
}