import { Injectable, Inject } from '@angular/core';
import {todoList} from './todos';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';


@Injectable({
  providedIn: 'root'
})
export class TodoserviceService {

  constructor(
    @Inject(LOCAL_STORAGE) private storage:StorageService
    ) { }

  addTodo(todo:todoList,key:string){ // ADD NEW TODO
    let item=this.storage.get(key)
    if(item){
      item.push(todo);
      this.storage.set(key,item);     
    }
    else{
      this.storage.set(key,[todo]);
    }
  }


  getTodos(key:string):todoList[]{ // GET ALL TODOS
    return this.storage.get(key);
  }

  updateTodo(todo,key:string){ // UPDATE TODO
    let get=this.storage.get(key);
    let temp:todoList[]=[];
    for(let i of get){
      if(i.todo == todo.todo && i.date==todo.date && i.endDate==todo.endDate){
        temp.push(todo);
      }
      else{
        temp.push(i);
      }
    }
    this.storage.set(key,temp);
  }

  deleteTodo(todo,key:string){
    let get=this.storage.get(key);
    let temp:todoList[]=[];
    for(let i of get){
      if(i.todo != todo.todo && i.date!=todo.date){
        temp.push(i);
      }
    }
    this.storage.set(key,temp);
  }

}
