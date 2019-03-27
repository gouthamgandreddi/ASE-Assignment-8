import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  token;
  userData;
  constructor(private http:HttpClient) { }


  login(uname:string,password:string){
    console.log(uname,password,'- at service');
    const logindata = new FormData();
    logindata.append('uname',uname);
    logindata.append('password',password);
    const userLoginInfo = {
        'uname':uname,
        'password':password
    }
    console.log('login data after form - ',logindata);
    return this.http.post<{message:string,username:any}>('http://localhost:3000/api/posts/login',userLoginInfo)
        .pipe(map((res)=>{
          console.log('data after login from db with JWT token - ',res);
          localStorage.setItem('token',res.message);
          localStorage.setItem('username',res.username);
          return 'success';
        }))
  }

  public getUserInfo(){
      this.token = localStorage.getItem('token')
    console.log(this.token,'token value in button ');
    console.log(      this.http.post<{message:string,userinfo:any}>('http://localhost:3000/api/posts/userinfo',this.token));
    return this.http.post<{message:string,userinfo:any}>('http://localhost:3000/api/posts/userinfo',this.token
        ,{headers:{
            'Authorization': `Bearer ${this.token}`
          }})
        .pipe(map(res =>{
          console.log(res,' - res in server');
          console.log(res.userinfo,'-sdfgh');
          this.userData = res.userinfo;
          return res.userinfo;
        }))
  }

  getHeaders(){
    var  headers = new HttpHeaders();
    headers.append('Authorization',`Bearer ${this.token}`);
    console.log(headers.append('Authorization',`Bearer ${this.token}`));
    console.log(headers,'headers');
    return headers;
  }
}
