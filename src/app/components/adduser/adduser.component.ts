
import { NgModule, Sanitizer} from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from "@angular/router";
import { Component, ElementRef, ViewChild, OnInit, Input} from '@angular/core';
import { Plugins, CameraResultType, CameraSource, Capacitor, PhotosAlbumType } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';   

import * as firebase from 'firebase'; 
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
//import { getMaxListeners } from 'cluster'; 
import {ɵunwrapSafeValue as unwrapSafeValue} from "@angular/core";
import { map } from 'rxjs/operators';
const { Camera } = Plugins; 

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss'],
})
export class AdduserComponent implements OnInit { 
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>; 
  @ViewChild('initPP') initPP: ElementRef; 
  photo: SafeResourceUrl;
  isDesktop: boolean;    
  getimagetest;
  email = ""; 
  name = "";
  constructor( 
    private platform: Platform,
    private sanitizer: DomSanitizer, 
    private fireService : FirebaseService,
    

    ) {}

  getUser(){ 
    var user = firebase.auth().currentUser.uid; 
    console.log(this.photo);   
    
    this.fireService.create_record({uid: user,name: "John", email: "johndoe@gmail.com", profilePicture: unwrapSafeValue(this.photo) },"Users");  



    console.log(this.fireService.read_record().subscribe(testUsers => {
      console.log('Observable:',testUsers);  
      this.getimagetest = testUsers[0].profilePicture; 
      console.log(this.getimagetest); 
      this.initPP.nativeElement.style.image = " {{getimagetest}}";

      //var testUsers = testUsers;  
      //console.log(testUsers.values()); 
    }
      ) );  

  } 

    //return user;

  ngOnInit() {    
    if ((this.platform.is('mobile') && this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.isDesktop = true;  
    } 
    this.getUser();
  } 

  async getPicture(type: string) {
    if (!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')) {
      this.filePickerRef.nativeElement.click();
      return;
    }

    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
  }//end getPicture

  onFileChoose(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)) {
      console.log('File format not supported');
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString();
    };
    reader.readAsDataURL(file);  

    this.initPP.nativeElement.style.image = " {{photo}}";

    }//end onFileChoose

}