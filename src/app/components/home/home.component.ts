import { Component, OnInit, Input } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {FormControl} from '@angular/forms';
import {todoList} from './todos';
import {TodoserviceService} from './todoservice.service';

const waiting_key="WAITING_KEY";
const complete_key="COMPLETE_KEY";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers:[TodoserviceService]
})
export class HomeComponent implements OnInit {

  constructor( // Constructor function call when opened home page automatically
    private snackBar:MatSnackBar, // Angular material property
    private todoService:TodoserviceService // Todo service connect the local storage.
    ) { }

  ngOnInit() { // This function task is same as constructor but angular property.
   this.todo_list=this.getTodo(waiting_key); // Get all waiting todo from local storage.
   this.complete_todo=this.getTodo(complete_key); // Get all completed todo from local storage.
  }

  // VARIABLES
  todo_list:todoList[]=[]; // waiting todo array
  complete_todo:todoList[]=[]; // completed todo array
  newTodo:todoList=<todoList>{}; // todo object
  startDateForPicker=new Date(new Date().toString()); // Current time
  endDate=new FormControl(); //Date picker
  
  addTodo(todo,priority){ // ADD NEW TODO
    if(todo.value && priority.value && this.endDate.value != null){ // If this conditions are supplied       
      // this.newTodo blocks set object values 
      this.newTodo.todo=todo.value;
      this.newTodo.priority=priority.value;   
      this.newTodo.date=new Date().toLocaleString();
      this.newTodo.endDate=this.endDate.value.toLocaleDateString();

      this.todoService.addTodo(this.newTodo,waiting_key); // Add to local storage   
      this.snackBar.open("Todo is added!",'Close',{duration:2000});  // Open information box
      this.todo_list=this.getTodo(waiting_key); // Get all waiting todo (Refresh)

      todo.value='';  // CLEAR INPUT
      priority.value='';  // CLEAR INPUT
    }
    else{
      this.snackBar.open("Enter the input and select priority",'Close',{duration:2000}); // Open information box
    }
  }
  
  getTodo(key){ // GET TODO ALL WAITINGS
    return this.todoService.getTodos(key); // Get todo from local storage with my service 
  }

  priorityChange(todo){ // Change priority button function
    if(todo.priority=="low") // if current priority is low,set normal
        todo.priority="normal";
    else if(todo.priority=="normal") // if current priority is normal,set high
        todo.priority="high";
    else if(todo.priority="high") // if current priority is high,set low
        todo.priority="low";

    this.todoService.updateTodo(todo,waiting_key); // Update todo
    this.snackBar.open("Priority set: "+todo.priority.toUpperCase(),'Close',{duration:2000}); // Open information box
  }

  completeTodo(todo){ // Complete todo button function
    this.todoService.deleteTodo(todo,waiting_key); // Delete from waiting todos
    this.todoService.addTodo(todo,complete_key); // Add to completed todos
    this.snackBar.open("Todo is complete",'Close',{duration:2000}); // Open information box
    this.complete_todo=this.getTodo(complete_key); // Refresh completed todos
    this.todo_list=this.getTodo(waiting_key); // Refresh waiting todos

  }

  backToWaiting(todo){ // Back to waiting from completed todo function
    this.todoService.deleteTodo(todo,complete_key);
    this.todoService.addTodo(todo,waiting_key);
    this.snackBar.open("Todo taken back!",'Close',{duration:2000});
    this.complete_todo=this.getTodo(complete_key);
    this.todo_list=this.getTodo(waiting_key);
  }

  deleteComplete(todo){ // Delete from completed todos
    this.todoService.deleteTodo(todo,complete_key); // Delete with service
    this.complete_todo=this.getTodo(complete_key); // Refresh completed
    this.snackBar.open("Todo is deleted!",'Close',{duration:2000}); // Open information box
  }




}
