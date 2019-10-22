import { Component, OnInit, Input, HostListener, Injectable, ChangeDetectorRef } from '@angular/core';
import { ThemePalette } from '@angular/material';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
//import jsonData from  '../../../assets/Json/Data.json';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

@Injectable()
export class HeaderComponent implements OnInit {

  isProcessing : boolean = true;
  istextSearchFocus : boolean = false;
  index: number = 0;

  value = '';
  oldValue = '';

  jsonStr;

  displayedColumns : string[] = ['ID', 'description'];
  dataSource: DataDwg[] ;
  images: string[] = [""];

  DataDwgArray:[DataDwg] = [new DataDwg()];

  currentChoice: currentChoosenDwg;

  constructor(private http: HttpClient,
    private changeDetectorRefs: ChangeDetectorRef
    ) {

    this.currentChoice = new currentChoosenDwg();
    this.currentChoice.cadName = "";
    this.currentChoice.description = "";

    //this.jsonStr = JSON.stringify(jsonData);
    //this.DataDwgArray = JSON.parse(temp);
    
    var data1 : any;
    this.getConfig(this.value).subscribe((data:[DataDwg]) => {
      this.isProcessing = true;
      this.DataDwgArray = data;
      this.dataSource = this.DataDwgArray;
      this.getRecordIndex(0);
      this.isProcessing = false;
    });

    
 
  }

  searchFocusFunction(){
    this.istextSearchFocus = true;
  }

  searchUnFocusFunction(){
    this.istextSearchFocus = false;
  }


  getConfig(value: string){
    this.value = value;
    return this.http.get("http://140.82.55.90/api/gouvisdetails/" + encodeURI(value));
    
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent){
    if(this.currentChoice.chosenItem == -1) return;

    if(event.keyCode == KEY_CODE.LEFT_ARROW && !this.istextSearchFocus){
      
      if(this.currentChoice.chosenItem == 0) return;
      
      if(this.dataSource.length == 0){
        return;
      }

      this.getRecordIndex(this.currentChoice.chosenItem -1);
    }

    if(event.keyCode == KEY_CODE.RIGHT_ARROW && !this.istextSearchFocus){
      if(this.currentChoice.chosenItem == this.dataSource.length - 1){
        return;
      }

      if(this.dataSource.length == 0){
        return;
      }

      this.getRecordIndex(this.currentChoice.chosenItem + 1);
    }

    if(event.keyCode == KEY_CODE.ENTER && this.value != this.oldValue){
      this.scrollTopTable();
      this.isProcessing = true;
      //console.log(this.value);
      this.getConfig(this.value).subscribe((data:[DataDwg]) => {
        this.jsonStr =  JSON.stringify(data); 
        this.DataDwgArray = JSON.parse(this.jsonStr);
        this.dataSource = this.DataDwgArray;
        this.oldValue = this.value;
        this.getRecordIndex(0);
        this.isProcessing = false;
        
      });
    }
  
  }

  @Input()
  color: ThemePalette ;

  ngOnInit() {
  }

  getRecord(ID : string){
    this.currentChoice.imageSource = "assets/PreViewPictures/" +ID.substr(0, ID.length-4).replace(' ', '%20') + ".jpg";
    this.currentChoice.chosenItem = this.DataDwgArray.findIndex((getDwgData) => {
      return getDwgData.fileName == ID;
    });
    this.currentChoice.cadName = this.DataDwgArray[this.currentChoice.chosenItem].cadName;
    this.currentChoice.description = this.DataDwgArray[this.currentChoice.chosenItem].name;
    this.currentChoice.link = "I:/library/details/" + ID;
    this.currentChoice.scale = this.DataDwgArray[this.currentChoice.chosenItem].scale;
    this.currentChoice.fileName = this.DataDwgArray[this.currentChoice.chosenItem].fileName;
    this.updataImagePreview();
    this.getCommand(this.currentChoice);
  }


  getRecordIndex(choice: number){
    let data: DataDwg = this.dataSource[choice];
    this.currentChoice.cadName = data.cadName;
    this.currentChoice.chosenItem = choice;
    this.currentChoice.description = data.name;
    this.currentChoice.imageSource = "../../assets/PreViewPictures/" +data.fileName.substr(0, data.fileName.length-4).replace(' ', '%20') + ".jpg";
    this.currentChoice.link = "I:/library/details/" + data.fileName;
    this.currentChoice.scale = data.scale;
    this.currentChoice.fileName = data.fileName;
    this.updataImagePreview();
    this.getCommand(this.currentChoice);
  }


  getOrderSummary(): Observable<any>{
    var jsonData = this.http.get('../../assets/Json/Data.json');
    return jsonData;
  }

  getCommand(currentChoice: currentChoosenDwg):void{
    currentChoice.command = "";
    currentChoice.command += "(command \"-ATTACH\" \"" +  currentChoice.link + "\" \"A\" pause \"" + currentChoice.scale + "\" \"\" \"\")\n";

  }

  updataImagePreview():void{
    this.images.pop();
    this.images.push(this.currentChoice.imageSource);
  }

  clearInput(){
    this.value = '';
  }

  updateDatabase(){
    let item: postItem = new postItem();
    item.fileName = this.currentChoice.fileName;
    item.tag = this.value.toLocaleLowerCase().trim();
    this.addHero(item).subscribe();
  }

  scrollTopTable(){
      var matTable= document.getElementById('tableCroll');
      matTable.scrollTop = 0;

  }

  addHero (item: postItem) {
    return this.http.post<postItem>("http://140.82.55.90/api/gouvisdetails/", item, httpOptions).pipe();

  } 

}

class postItem{
  fileName: string;
  tag: string;
}

class DataDwg{
  cadName: string;
  fileName: string;
  name: string;
  scale: string;
  textString: string;
}


class currentChoosenDwg{
  cadName: string;
  description: string;
  link: string;
  chosenItem : number = -1;
  imageSource: string;
  command: string;
  scale : string;
  fileName: string;
}

export interface FileCad{
  ID: string;
  description: string;
}

export enum KEY_CODE{
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  ENTER = 13
}

export interface Config {
  DataDwgArray:[DataDwg];
}
