const BASE_URL = "http://localhost:4000/todos";

// ============================================
// DOM 요소
// ============================================
const todoListEl = document.getElementById("todo-list");
const todoFormEl = document.getElementById("todo-form");
const todoInputEl = document.getElementById("todo-input");

// ============================================
// 아래 4개의 함수를 완성하세요.
//
// - getTodos: 할 일 목록을 불러와서 화면에 그립니다.
// - addTodo: 새 할 일을 추가하고 목록을 새로고침합니다.
// - toggleTodo: 완료 상태를 토글하고 목록을 새로고침합니다.
// - deleteTodo: 할 일을 삭제하고 목록을 새로고침합니다.
//
// 화면 그리기(DOM 조작)도 직접 구현해야 합니다.
// index.html의 구조와 style.css의 클래스명을 참고하세요.
//
// HTML 구조 참고:
//   <li class="todo-item completed">
//     <span class="title">제목</span>
//     <button class="btn-toggle">완료됨</button>
//     <button class="btn-delete">삭제</button>
//   </li>
//
// - completed인 항목은 li에 "completed" 클래스 추가
// - 토글 버튼 텍스트: completed면 "완료됨", 아니면 "미완료"
// ============================================

// ============================================
//           LEVEL 2 : 완료
// ============================================

function renderTodos(todos) {
  todoListEl.innerHTML = "";

  todos.forEach((entry) => {
    const todo = document.createElement("li");
    const todoTitle = document.createElement("span");
    const toggleBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    todo.classList.add("todo-item");
    todoTitle.classList.add("title");
    toggleBtn.classList.add("btn-toggle");
    deleteBtn.classList.add("btn-delete");

    todoTitle.textContent = entry.title;
    deleteBtn.textContent = "삭제";

    // 토글 버튼 completed 상태에 따라 텍스트 변경
    if (entry.completed) {
      todo.classList.add("completed");
      toggleBtn.textContent = "완료됨";
    } else {
      toggleBtn.textContent = "미완료";
    }
    // 토글 버튼 이벤트 리스너
    toggleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      toggleTodo(entry.id, entry.completed);
    });

    // 삭제 버튼 이벤트 리스너
    deleteBtn.addEventListener("click", function (e) {
      e.preventDefault();
      deleteTodo(entry.id);
    });

    todo.appendChild(todoTitle);
    todo.appendChild(toggleBtn);
    todo.appendChild(deleteBtn);

    todoListEl.appendChild(todo);
  });
}

async function getTodos() {
  // 서버에 할 일 목록을 요청
  const response = await fetch(BASE_URL);
  const todos = await response.json();

  // 할 일 목록 화면에 출력
  renderTodos(todos);
}

async function addTodo(title) {
  // 새로운 할 일 객체 생성
  const newTodo = {
    // id : json-server에서 자율적으로 id를 생성해서 부여해줌.
    title,
    completed: false,
  };
  // DB에 POST로 newTodo 객체 생성 요청
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  });

  getTodos();
}

async function toggleTodo(id, completed) {
  // completed 상태 변경(토글)
  const toggle = {
    completed: !completed,
  };

  // PATCH로 completed 수정 요청
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toggle),
  });

  getTodos();
}

async function deleteTodo(id) {
  // DELETE로 DB에 id로 저장된 정보 삭제 요청
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  getTodos();
}

// ============================================
// 이벤트 연결 (이미 완성됨 — 수정할 필요 없음)
// ============================================
todoFormEl.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = todoInputEl.value.trim();
  if (title) {
    addTodo(title);
    todoInputEl.value = "";
  }
});

// 페이지 로드 시 할 일 목록 불러오기
getTodos();
