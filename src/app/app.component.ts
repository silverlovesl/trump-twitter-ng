import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzMenuItemDirective } from 'ng-zorro-antd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  collapsed: boolean = false;

  constructor(public router: Router) {}

  handleMenuClick(event: any) {
    this.router.navigate([event.hostElement.nativeElement.getAttribute('key')]);
  }
}
