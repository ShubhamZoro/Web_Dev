document.addEventListener("DOMContentLoaded",()=>{
    const storedTasks=JSON.parse(localStorage.getItem('tasks'));
    if(storedTasks){
        storedTasks.forEach((task)=>tasks.push(task))
        updateTaskList()
        updateStats()
    }
});
let tasks=[];

const saveTasks=()=>{
    localStorage.setItem('tasks',JSON.stringify(tasks));
}
const addTask=()=>{
    const taskInput=document.getElementById('taskInput');
    const text=taskInput.value.trim();
    if(text){
        tasks.push({
            text:text,completed:false
        });
    }
    updateTaskList();
    updateStats();
    saveTasks();
    

};

const toggleTaskComplete=(index)=>{
    tasks[index].completed=!tasks[index].completed;
    
    updateTaskList();
    updateStats();
    saveTasks();
};

const deleteTask=(index)=>{
tasks.splice(index,1);
updateTaskList();
updateStats();
saveTasks();
}

const editTask=(index)=>{
    const taskInput=document.getElementById("taskInput");
    taskInput.value=tasks[index].text;
    tasks.splice(index,1);
    updateTaskList();
    updateStats();
    saveTasks();
}

const updateStats=()=>{
    const completeTasks=tasks.filter((task)=>task.completed).length;
    const totalTasks=tasks.length;
    const progress=(completeTasks/totalTasks)*100;
    const progressbar=document.getElementById("progress");
    progressbar.style.width=`${progress}%`;
    document.getElementById("numbers").innerText=`${completeTasks}/${totalTasks}`;
}

const updateTaskList=()=>{
const taskList=document.getElementById('task-list');
taskList.innerHTML=''
for(let i=0;i<tasks.length;i++){
    const listItem=document.createElement("li");
    listItem.innerHTML=`
    <div class="taskItem">
        <div class="task ${tasks[i].completed?'completed':''}">
            <input type="checkbox" class="checkbox"/ ${tasks[i].completed ? "checked":""}>
            <p>${tasks[i].text}</p>
        </div>
        <div class="icons">
            <img src="edit.png" onClick="editTask(${i})">
            <img src="bin.png" onClick="deleteTask(${i})">
        <div>
    </div>

    `;
    listItem.addEventListener('change',()=> toggleTaskComplete(i));
    
    taskList.appendChild(listItem)
}

}


document.getElementById('newTask').addEventListener("click",function(e){
    e.preventDefault();
    addTask();
})