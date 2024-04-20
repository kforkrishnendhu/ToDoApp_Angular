import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { DatePipe } from '@angular/common';
import { PageTitleComponent } from '../../page-title/page-title.component';
import { TaskListComponent } from '../../task-list/task-list.component';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [FormsModule,DatePipe,PageTitleComponent,TaskListComponent],
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.scss'
})
export class AllTasksComponent {
newTask="";
initialTaskList:any[]=[];
taskList:any[]=[];
httpService=inject(HttpService);
stateService=inject(StateService);

ngOnInit(){
  this.stateService.searchSubject.subscribe((value)=>{
    if(value){
      this.taskList=this.initialTaskList.filter(x=>x.title.toLowerCase().includes(value.toLowerCase()));
    }
    else{
      this.taskList=this.initialTaskList;
    }
  })
  this.getAllTasks();
}

addTask(){
  this.httpService.addTask(this.newTask).subscribe(()=>{
    this.newTask="";
    this.getAllTasks();
  })
}
getAllTasks(){
  // this.httpService.getAllTasks().subscribe((result:any)=>{
  //   this.initialTaskList=this.taskList=result;
  // })

  this.httpService.getAllTasks().subscribe((result: any) => {
    this.initialTaskList = this.taskList = result;
  
    // Sorting the tasks based on importance
    this.taskList.sort((a,b) => {
      return b.important - a.important;
    });
  });

}

onComplete(task:any){
task.completed=true;
this.httpService.updateTask(task).subscribe(()=>{
  this.getAllTasks();
})
}

onImportant(task:any){
task.important=true;
this.httpService.updateTask(task).subscribe(()=>{
  this.getAllTasks();
})
}

}
