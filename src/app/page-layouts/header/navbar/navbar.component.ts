import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showLoginForm: boolean = false;
  showRegistrationForm: boolean = false; // Додайте змінну для відображення форми реєстрації

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
    this.showRegistrationForm = false; // Закрийте форму реєстрації, коли відкривається форма логінації
  }

  toggleRegistrationForm() {
    this.showRegistrationForm = !this.showRegistrationForm;
    this.showLoginForm = false; // Закрийте форму логінації, коли відкривається форма реєстрації
  }
}