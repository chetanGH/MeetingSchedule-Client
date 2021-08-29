import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment.prod';
import { HttpCallService } from './http-call.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private http:HttpCallService){}
  title = 'Start Schedule Meetings!';
  meetingType:number = 1 //1-> basic, 2-> advance
  today = moment().format('YYYY-MM-DD');
  meetObject:any = {
    RoomId: "R5",
    participants: "P1,P2",
    event_date: moment.utc().format('YYYY-MM-DD'),
    from: moment().format('hh:mm'),
    to: moment().format('hh:mm')
  }
  ngOnInit():void{
    console.log(this.meetObject);
  }

  changeTimeEvent(event:any,type:number){
    console.log(event.target.value);
    if(type == 1){

      this.formatDate(this.meetObject.event_date,event.target.value,this.meetObject.to)
    }else{
      this.formatDate(this.meetObject.event_date,this.meetObject.from,event.target.value)
    }
  }

  private formatDate(date:any,from:any,to:any){
     let finalDate = moment.utc(date);
     let from_hr = from.split(':')[0];
     let from_min = from.split(':')[1];
     let to_hr = to.split(':')[0];
     let to_min = to.split(':')[1];
     let from_time = moment.utc(date).add('h',from_hr).add('m',from_min);
     let to_time = moment.utc(date).add('h',to_hr).add('m',to_min);
     return {finalDate, from_time, to_time};
  }

  setMeetingType(input:number){
    this.meetingType = input;
  }

  formateInput(event:any){
    if(this.meetObject.participants.length > 0){
      this.meetObject.participants = this.meetObject.participants.toUpperCase(); 
    }
  }

  formSubmit(item:any){
    // console.log(item)
    let { finalDate, from_time, to_time} = this.formatDate(item.event_date,item.from,item.to);
    let diff = moment(from_time).diff(to_time, 'minutes');
    
    if(diff < 0){
      let payload = {
        "RoomId":item.RoomId,
        "event_date":finalDate,
        'from':from_time,
        'to':to_time,
        'participants':item.participants
      }
      if(this.meetingType == 1){
        this.http.post(`${environment.domain}/api/basicMeeting`,payload).subscribe((res:any)=>{
          if(res['success'] == true){
            alert(res['message'])
          }else{
            alert(res['message'])
          }
        },err=>{
          alert(err.message)
        })
      }else{
        this.http.post(`${environment.domain}/api/createAdvancedMeeting`,payload).subscribe((res:any)=>{
          if(res['success'] == true){
            alert(res['message'])
          }else{
            alert(res['message'])
          }
        },err=>{
          alert(err.message)
        })
      }

    }else{
      alert('To Time should be grater than From Time')
    }
  }
}
