/*
 * @Author: LJH
 * @Date: 2023-07-26 10:23:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-26 10:46:35
 */
export function changeTimeStamp(timeStamp: string = '',timeType:string ='yy-mm-ss hh:MM:ss') {
  const date = timeStamp?new Date(timeStamp):new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const dateString = `${year}-${month}-${day}`;
  const timeString = `${hours}:${minutes}:${seconds}`;

  return timeType=='yy-mm-ss'?`${dateString}`:`${dateString} ${timeString}`;
}
