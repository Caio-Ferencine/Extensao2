const input = document.querySelector(".input-tarefa");
const btnAdd = document.querySelector(".BT-Adiciona");
const ul = document.querySelector("ul");
const progress = document.querySelector("progress");

const btnTodas = document.querySelector(".filtros button:nth-child(1)");
const btnConcluidas = document.querySelector(".filtros button:nth-child(2)");
const btnPendentes = document.querySelector(".filtros button:nth-child(3)");
const btnLimpar = document.querySelector(".filtros button:nth-child(4)");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

// Função para salvar no localStorage
function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Função para renderizar as tarefas
function renderTarefas(filtro = "todas") {
  ul.innerHTML = "";

  let tarefasFiltradas = tarefas;
  if (filtro === "concluidas") {
    tarefasFiltradas = tarefas.filter(t => t.concluida);
  } else if (filtro === "pendentes") {
    tarefasFiltradas = tarefas.filter(t => !t.concluida);
  }

  tarefasFiltradas.forEach((tarefa, index) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.padding = "0vw 3vw 0vw 3vw"
    li.style.alignItems = "center";
    li.style.marginBottom = "8px";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluida;
    checkbox.addEventListener("change", () => {
      tarefa.concluida = checkbox.checked;
      salvarTarefas();
      atualizarProgresso();
      renderTarefas(filtro);
    });

    // Texto da tarefa
    const span = document.createElement("span");
    span.textContent = tarefa.texto;
    if (tarefa.concluida) {
      span.style.textDecoration = "line-through";
      span.style.color = "gray";
    }

    // Botão editar
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Editar";
    btnEdit.style.marginLeft = "10px";
    btnEdit.addEventListener("click", () => {
      const novoTexto = prompt("Edite a tarefa:", tarefa.texto);
      if (novoTexto !== null && novoTexto.trim() !== "") {
        tarefa.texto = novoTexto;
        salvarTarefas();
        renderTarefas(filtro);
      }
    });

    // Botão excluir
    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Excluir";
    btnDelete.style.marginLeft = "5px";
    btnDelete.addEventListener("click", () => {
      tarefas.splice(index, 1);
      salvarTarefas();
      atualizarProgresso();
      renderTarefas(filtro);
    });

    // Montar a li
    const div = document.createElement("div");
    div.appendChild(checkbox);
    div.appendChild(span);

    const divBtns = document.createElement("div");
    divBtns.appendChild(btnEdit);
    divBtns.appendChild(btnDelete);

    li.appendChild(div);
    li.appendChild(divBtns);

    ul.appendChild(li);
  });

  atualizarProgresso();
}

// Atualiza a barra de progresso
function atualizarProgresso() {
  const bar = document.getElementById("progress-bar");
  const text = document.getElementById("progress-text");

  if (tarefas.length === 0) {
    bar.style.width = "0%";
    text.textContent = "0%";
  } else {
    const concluidas = tarefas.filter(t => t.concluida).length;
    const porcentagem = Math.round((concluidas / tarefas.length) * 100);

    bar.style.width = porcentagem + "%";
    text.textContent = porcentagem + "%";
  }
}

// Adicionar tarefa
btnAdd.addEventListener("click", () => {
  const texto = input.value.trim();
  if (texto !== "") {
    tarefas.push({ texto, concluida: false });
    salvarTarefas();
    input.value = "";
    renderTarefas();
  }
});

// Enter também adiciona tarefa
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    btnAdd.click();
  }
});

// Filtros
btnTodas.addEventListener("click", () => renderTarefas("todas"));
btnConcluidas.addEventListener("click", () => renderTarefas("concluidas"));
btnPendentes.addEventListener("click", () => renderTarefas("pendentes"));
btnLimpar.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja limpar todas as tarefas?")) {
    tarefas = [];
    salvarTarefas();
    renderTarefas();
  }
});

// Inicia com as tarefas salvas
renderTarefas();