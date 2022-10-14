import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterLinkWithHref} from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
}
