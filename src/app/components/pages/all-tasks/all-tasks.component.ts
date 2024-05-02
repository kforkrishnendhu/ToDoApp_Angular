import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { CommonModule, DatePipe } from '@angular/common';
import { PageTitleComponent } from '../../page-title/page-title.component';
import { TaskListComponent } from '../../task-list/task-list.component';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [FormsModule,DatePipe,PageTitleComponent,TaskListComponent,CommonModule],
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.scss'
})
export class AllTasksComponent {
newTask="";
isDuplicateTask:boolean=false;
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
  if(this.taskList.some((task)=>task.title.toLowerCase()===this.newTask.toLocaleLowerCase())){
    this.isDuplicateTask=true;
    return;
  }
    this.isDuplicateTask=false;
    this.httpService.addTask(this.newTask).subscribe(()=>{
    this.newTask="";
    this.getAllTasks();
  })
}

getAllTasks(){
  this.httpService.getAllTasks().subscribe((result:any)=>{
    this.initialTaskList=this.taskList=result;
    this.sortTasks();
  })
}

sortTasks(){
  this.taskList = this.taskList.sort((a, b) => {
    if (a.important && !b.important) {
      return -1; // Important tasks come before non-important tasks
    } else if (!a.important && b.important) {
      return 1; // Non-important tasks come after important tasks
    } else {
      // If both tasks are either important or non-important, sort by completion status
      if (a.completed && !b.completed) {
        return 1; // Completed tasks go below
      } else if (!a.completed && b.completed) {
        return -1; // Incomplete tasks go above
      } else {
        return 0; // Tasks are equal in terms of importance and completion status
      }
    }
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

onDelete(task:any){
  this.httpService.deleteTask(task).subscribe(()=>{
    this.getAllTasks();
  })
  }

}
