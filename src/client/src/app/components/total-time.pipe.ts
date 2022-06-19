import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totalTime'
})
export class TotalTimePipe implements PipeTransform {

  transform(value: number, ): string {
    const senconds=value/1000;
    const minutes=senconds/60;
    let str=[];
    
    if(minutes>=1){
      str.push(`${Math.round(minutes)}min`);
    }
    str.push(`${Math.round(senconds%60)}sec`);


    return str.join(' ');
  }

}
