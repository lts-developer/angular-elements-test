import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lts-widget',
  template: `
    <p>
      widget works!
    </p>
  `,
  styles: [
  ]
})
export class WidgetComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
