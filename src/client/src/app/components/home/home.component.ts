import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  get id():string{
    return uuidv4();
  }

  getInviteLink(data:string){
    navigator.clipboard.writeText(data);
  }
}
