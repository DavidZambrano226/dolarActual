import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../../config/config';


@Injectable()
export class TrmProvider {

  constructor(public http: HttpClient) {
    console.log('Hello TrmProvider Provider');
  }

  llamado(){
    
    const url = URL_API;

    return new Promise( (resolve, reject) =>{
      this.http.get(url).subscribe( res =>{
        resolve(res);
            
      }, (err)=>{
        reject(err);
      })
    })
    
  }

}
