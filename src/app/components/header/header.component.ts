import { Component, OnInit, Input, HostListener, Injectable, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ThemePalette, TooltipPosition, MatPaginator, MatTableDataSource } from '@angular/material';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import { FormControl } from '@angular/forms';
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


  config = {  
    btnClass: 'default',
    zoomFactor: 0,
    containerBackgroundColor: '#ccc',
    wheelZoom: false,
    allowFullscreen: true,
    allowKeyboardNavigation: false,
    btnIcons: {
      zoomIn: 'fa fa-plus',
      zoomOut: 'fa fa-minus',
      rotateClockwise: 'fa fa-repeat',
      rotateCounterClockwise: 'fa fa-undo',
      next: 'fa fa-arrow-right',
      prev: 'fa fa-arrow-left',
      fullscreen: 'fa fa-arrows-alt'
    },
    btnShow: {
      zoomIn: false,
      zoomOut: false,
      rotateClockwise: false,
      rotateCounterClockwise: false,
      next: false,
      prev: false
    }
  }

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
  position1 = new FormControl(this.positionOptions[4]);

  isProcessing : boolean = true; 
  istextSearchFocus : boolean = false;
  index: number = 0;

  value = '';
  oldValue = '';

  jsonStr;

  //displayedColumns : string[] = ['thumbnail','ID', 'description', 'date'];
  displayedColumns : string[] = ['thumbnail','ID'];
  dataSource:  MatTableDataSource<DataDwg>  ;
  images: string[] = [""];

  DataDwgArray:[DataDwg] = [new DataDwg()];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  currentChoice: currentChoosenDwg;

  constructor(private http: HttpClient,
    private changeDetectorRefs: ChangeDetectorRef
    ) {

    this.currentChoice = new currentChoosenDwg();
    this.currentChoice.cadName = "";
    this.currentChoice.description = "";

    //this.jsonStr = JSON.stringify(jsonData);
    //this.DataDwgArray = JSON.parse(temp);
    

  }

  ngOnInit(): void {
    var data1 : any;
    this.getConfig(this.value).subscribe((data:[DataDwg]) => { //this.value
      this.isProcessing = true;
      this.DataDwgArray = data;
      this.dataSource = new MatTableDataSource(this.DataDwgArray);
      this.getRecordIndex(0);
      this.isProcessing = false;
      this.dataSource.paginator = this.paginator;
    });  
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
 
  }

  searchFocusFunction(){
    this.istextSearchFocus = true;
  }

  searchUnFocusFunction(){
    this.istextSearchFocus = false;
  }


  getConfig(value: string){
    this.value = value;
    return this.http.get("http://140.82.55.90:81/api/gouvisdetails/" + encodeURI(value));
    
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent){
    if(this.currentChoice.chosenItem == -1) return;

    if(event.keyCode == KEY_CODE.LEFT_ARROW && !this.istextSearchFocus){
      
      if(this.currentChoice.chosenItem == 0) return;
      
      if(this.dataSource.data.length == 0){
        return;
      }

      this.getRecordIndex(this.currentChoice.chosenItem -1);
    }

    if(event.keyCode == KEY_CODE.RIGHT_ARROW && !this.istextSearchFocus){
      if(this.currentChoice.chosenItem == this.dataSource.data.length - 1){
        return;
      }

      if(this.dataSource.data.length == 0){
        return;
      }

      this.getRecordIndex(this.currentChoice.chosenItem + 1);
      this.scrollTopTable(this.currentChoice.chosenItem*this.DataDwgArray.length*document.defaultView.innerHeight/20000);
    }

    if(event.keyCode == KEY_CODE.ENTER && this.value != this.oldValue){
      this.scrollTopTable(0);
      this.isProcessing = true;
      //console.log(this.value);
      this.getConfig(this.value).subscribe((data:[DataDwg]) => {
        this.jsonStr =  JSON.stringify(data); 
        this.DataDwgArray = JSON.parse(this.jsonStr);
        this.dataSource = new MatTableDataSource(this.DataDwgArray);
        this.oldValue = this.value;
        this.getRecordIndex(0);
        this.isProcessing = false;
        this.dataSource.paginator = this.paginator;
        this.paginator.length = this.dataSource.data.length;
        this.paginator.pageIndex = 0;
      });
    }
  
  }

  @Input()
  color: ThemePalette ;


  getRecord(ID : string){
    var temp = ID.split('\\');
    var temp1 = temp[temp.length-1];
    this.currentChoice.imageSource = "assets/PreViewPictures/" +temp1.substr(0, temp1.length-4).split('%20').join(' ') + ".jpg";
    this.currentChoice.chosenItem = this.DataDwgArray.findIndex((getDwgData) => {
      return getDwgData.fileName == ID;
    });
    this.currentChoice.cadName = this.DataDwgArray[this.currentChoice.chosenItem].cadName;
    this.currentChoice.description = this.DataDwgArray[this.currentChoice.chosenItem].name;
    this.currentChoice.scale = this.DataDwgArray[this.currentChoice.chosenItem].scale;
    this.currentChoice.fileName = this.DataDwgArray[this.currentChoice.chosenItem].fileName;
    this.updataImagePreview();
    this.getCommand(this.currentChoice);
  }


  getRecordIndex(choice: number){
    let data: DataDwg = this.dataSource.data[choice];
    this.currentChoice.cadName = data.cadName;
    this.currentChoice.chosenItem = choice;
    this.currentChoice.description = data.name;
    var temp = data.fileName.split('\\');
    var temp1 = temp[temp.length-1];
    this.currentChoice.imageSource = "assets/PreViewPictures/" +temp1.substr(0, temp1.length-4).split('%20').join(' ') + ".jpg";
    this.currentChoice.scale = data.scale;
    this.currentChoice.fileName = data.fileName;
    this.updataImagePreview();
    this.getCommand(this.currentChoice);
  }


  getOrderSummary(): Observable<any>{
    var jsonData = this.http.get('assets/Json/Data.json');
    return jsonData;
  }

  getCommand(currentChoice: currentChoosenDwg):void{
    currentChoice.command = "";
    currentChoice.command += "(command \"-ATTACH\" \"" +  currentChoice.fileName.split('\\').join('/') + "\" \"A\" pause \"" + currentChoice.scale + "\" \"\" \"\")\n";

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

  scrollTopTable(index: number){
      var matTable= document.getElementById('tableCroll');
      matTable.scrollTop = index;

  }

  addHero (item: postItem) {
    return this.http.post<postItem>("http://140.82.55.90:81/api/gouvisdetails/", item, httpOptions).pipe();

  }

  getDate(item: number): string{
    let numberstring: string = item.toString();
    let year = numberstring.substr(0, 4);
    let month = numberstring.substr(4, 2);
    let day = numberstring.substr(6, 2);
    return  month + "/" + day + "/" + year;

  }

  getThumnails(filePath: string):string{
    let str: string[] = filePath.split('\\');
    let fileName: string = str[str.length-1];
    let path:string = "assets/thumbnails/" +fileName.substr(0, fileName.length - 4) + ".png";
    return path;
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
  date: number;
}


class currentChoosenDwg{
  cadName: string;
  description: string;
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

