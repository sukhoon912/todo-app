// DOM 요소 가져오기
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const pendingEmpty = document.getElementById('pending-empty');
const completedEmpty = document.getElementById('completed-empty');

// 로컬 스토리지에서 Todo 목록 불러오기
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 페이지 로드 시 저장된 Todo 목록 표시
function loadTodos() {
    // 목록 초기화
    pendingList.innerHTML = '';
    completedList.innerHTML = '';
    
    // 예정된 항목과 완료된 항목 분리
    const pendingTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);
    
    // 예정된 항목 표시
    if (pendingTodos.length === 0) {
        pendingEmpty.classList.remove('hidden');
    } else {
        pendingEmpty.classList.add('hidden');
        pendingTodos.forEach(todo => {
            const index = todos.findIndex(t => t === todo);
            createTodoItem(todo, index, pendingList);
        });
    }
    
    // 완료된 항목 표시
    if (completedTodos.length === 0) {
        completedEmpty.classList.remove('hidden');
    } else {
        completedEmpty.classList.add('hidden');
        completedTodos.forEach(todo => {
            const index = todos.findIndex(t => t === todo);
            createTodoItem(todo, index, completedList);
        });
    }
}

// Todo 항목 생성 함수
function createTodoItem(todo, index, listElement) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'todo-content';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(index));
    
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '🗑️';
    deleteButton.setAttribute('aria-label', '삭제');
    deleteButton.addEventListener('click', () => deleteTodo(index));
    
    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(textSpan);
    li.appendChild(contentDiv);
    li.appendChild(deleteButton);
    
    listElement.appendChild(li);
}

// Todo 추가 함수
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        return;
    }
    
    const newTodo = {
        text: text,
        completed: false
    };
    
    todos.push(newTodo);
    saveTodos();
    loadTodos();
    
    // 입력 필드 초기화
    todoInput.value = '';
    todoInput.focus();
}

// Todo 완료 상태 토글 함수
function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    loadTodos();
}

// Todo 삭제 함수
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    loadTodos();
}

// 로컬 스토리지에 저장하는 함수
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 이벤트 리스너 등록
addButton.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// 페이지 로드 시 Todo 목록 불러오기
loadTodos();
