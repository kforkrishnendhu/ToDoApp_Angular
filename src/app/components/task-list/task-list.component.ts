import { CommonModule } from '@angular/common';
import { Component, Input, Output, input, output, EventEmitter } from '@angular/core';
// import { EventEmitter } from 'stream';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
 @Input() taskList:any[]=[];

 @Output() important=new EventEmitter<any>();
 @Output() complete=new EventEmitter<any>();
 @Output() delete=new EventEmitter<any>();

 markImportant(task:any){
  this.important.emit(task);
 }

 markComplete(task:any){
  this.complete.emit(task);
 }

 deleteTask(task:any){
  this.delete.emit(task);
 }

}
