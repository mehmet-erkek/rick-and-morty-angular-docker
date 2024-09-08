import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CharListComponent } from "./components/char-list/char-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CharListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'rick-and-morty-angular';
  char = null
  episode = null
  location = null

  receiveData(data:any){
    this.char = data.charLength
    this.episode = data.episLength
    this.location = data.locaLength
  }
}
