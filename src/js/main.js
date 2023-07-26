
// Import our custom CSS
import '../scss/styles.scss'
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import { Todo } from './todo';
import { DBService } from './db-services'




import { Manager } from './manager';

let manager;

DBService.getAllTodos().then(todos => {
    manager = new Manager(todos);
    render();
})







function render(){
    
    const todoContainer=document.getElementById('todo-container'); 
    todoContainer.innerHTML= '';

    for (let i = 0; i < manager.todoArray.length; i++) {

        const todo = manager.todoArray[i];

        const div=document.createElement('div');
        div.classList.add('card');

        if(!todo.isCompleted){
            div.style.borderColor='#2f6b2fd8';
        }

        
        const titleStrong=document.createElement('strong');
        const titleNode=document.createTextNode(todo.title);
        titleStrong.appendChild(titleNode);
        div.appendChild(titleStrong);
        
        const dateSpan=document.createElement('span');
        const dateNode=document.createTextNode(todo.creationDate.toISOString());

        dateSpan.appendChild(dateNode);

        const topDiv = document.createElement("div");
        topDiv.appendChild(titleStrong);
        topDiv.appendChild(dateSpan);
        

        div.appendChild(topDiv);

        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty-div');
        div.appendChild(emptyDiv);
        

        const completeBtn = document.createElement('button');
        const completeNode = document.createTextNode( todo.isCompleted ? 'da completare' : 'completato');
        completeBtn.classList.add("btn");
        completeBtn.classList.add("btn-success");
        completeBtn.addEventListener('click', () => {

            const modifiedTodo = {...todo};

            if (modifiedTodo.isCompleted === true) {
                modifiedTodo.isCompleted = false;
            } else {
                modifiedTodo.isCompleted = true;
            }

            DBService.updateTodo(modifiedTodo).then(res => {
                manager.changeCompleteStatus(i);
                render();
            })
 
        });

        

        completeBtn.appendChild(completeNode);
        // div.appendChild(completeBtn);


        const deleteBtn = document.createElement('button');
        const deleteNode = document.createTextNode('cancella');
        deleteBtn.classList.add("btn");
        deleteBtn.classList.add("btn-danger");
        deleteBtn.addEventListener('click', () => {

            DBService.deleteTodo(todo.id).then(() => {
                manager.deleteTodo(i);
                render();
            });
            
            
        });

        const bottomDiv = document.createElement('div');
        bottomDiv.classList.add("bottom-div")
        bottomDiv.appendChild(completeBtn);
        bottomDiv.appendChild(deleteBtn);

        div.appendChild(bottomDiv);

        deleteBtn.appendChild(deleteNode);
        //div.appendChild(deleteBtn);


        todoContainer.appendChild(div);
    }
    
    const toDoForm = document.querySelector("form").addEventListener('submit', (event) => {
        sendData(event)

        
    })


    const addtoDo = document.getElementById('add-todo-btn').addEventListener("click", () => {
        manager.addTodo()
    })
}


const btnOrderByTitle = document.getElementById('btnOrderByTitle');
btnOrderByTitle.addEventListener('click', () => {    console.log('cc')
                                                    manager.orderTodosByTitle();
                                                    render();
                                                });



const btnOrderByDate = document.getElementById('btnOrderByDate');
btnOrderByDate.addEventListener('click', () => {    console.log('cc')
                                                    manager.orderTodosByDate();
                                                    render();
                                                });




const btnOrderByCompletion = document.getElementById('btnOrderByCompletion');
btnOrderByCompletion.addEventListener('click', () => {    console.log('cc')
manager.orderTodosByCompletion();
render();
});





function orderByDate(){
    manager.orderTodosByDate();
    render();
}







function sendData(event){
    event.preventDefault();
    const form = document.forms['create'];


    const formData = new FormData(form);

    const newTodo = {
        title: formData.get('title'),
    
        
        isCompleted: false,

        creationDate: new Date(),
        
    }


    console.log(newTodo);

    DBService.createTodo(newTodo)
    .then(todo => window.location = './index.html')
    .catch(error => alert(error.message));




}
