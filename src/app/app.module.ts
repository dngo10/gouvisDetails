import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import { MatTableModule } from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import { HttpClientModule } from '@angular/common/http';
import { ImageViewerModule } from "ngx-image-viewer";
import {MatInputModule} from '@angular/material/input';
import { ClipboardModule } from 'ngx-clipboard';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
//import { ImageViewerModule } from 'ng2-image-viewer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    BrowserAnimationsModule, 
    MatTableModule,
    CdkTableModule,
    HttpClientModule,
    ImageViewerModule.forRoot(),
    ClipboardModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatPaginatorModule
  ],

  exports:[
    MatButtonModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    CdkTableModule,
    MatIconModule 
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
