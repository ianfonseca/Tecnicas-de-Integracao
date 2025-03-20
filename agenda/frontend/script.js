let mesAtual = new Date().getMonth(); // Mês atual (0 = Janeiro)
let anoAtual = new Date().getFullYear(); // Ano atual

function criarCalendario(mes, ano) {
  const diasDoMes = new Date(ano, mes + 1, 0).getDate(); // Número de dias no mês
  const primeiroDia = new Date(ano, mes, 1).getDay(); // Dia da semana do primeiro dia do mês

  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  document.getElementById("month-year").textContent = `${meses[mes]} ${ano}`;

  let calendarioHTML = "<table><tr>";
  
  const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  diasDaSemana.forEach(dia => {
    calendarioHTML += `<th>${dia}</th>`;
  });
  calendarioHTML += "</tr><tr>";

  for (let i = 0; i < primeiroDia; i++) {
    calendarioHTML += "<td></td>";
  }

  for (let dia = 1; dia <= diasDoMes; dia++) {
    if ((primeiroDia + dia - 1) % 7 === 0 && dia !== 1) {
      calendarioHTML += "</tr><tr>";
    }

    calendarioHTML += `<td class="day" data-dia="${dia}" onclick="mostrarDetalhesTarefas(${dia})">${dia}</td>`;
  }

  calendarioHTML += "</tr></table>";
  document.getElementById("calendar").innerHTML = calendarioHTML;


  carregarTarefas(mes, ano);
}


function carregarTarefas(mes, ano) {
  fetch("http://localhost:3000/tarefas")
    .then(response => response.json())
    .then(tarefas => {
      
      const diasComTarefas = document.querySelectorAll(".day");
      diasComTarefas.forEach(dia => {
        dia.innerHTML = dia.innerHTML.replace(/<div class="task">.*?<\/div>/g, ""); 
      });

  
      tarefas.forEach(tarefa => {
        const [anoTarefa, mesTarefa, diaTarefa] = tarefa.data.split('-'); 
        if (parseInt(mesTarefa) - 1 === mes && parseInt(anoTarefa) === ano) { 
          const elementoDia = document.querySelector(`.day[data-dia='${diaTarefa}']`);
          if (elementoDia) {
            const divTarefa = document.createElement("div");
            divTarefa.classList.add("task");
            divTarefa.innerText = tarefa.nome;
            elementoDia.appendChild(divTarefa);
          }
        }
      });
    })
    .catch(error => console.error('Erro ao carregar tarefas:', error));
}


function mudarMes(incremento) {
  mesAtual += incremento;

  
  if (mesAtual > 11) {
    mesAtual = 0;
    anoAtual++;
  }

  
  if (mesAtual < 0) {
    mesAtual = 11;
    anoAtual--;
  }

  
  criarCalendario(mesAtual, anoAtual);
}


function mostrarDetalhesTarefas(dia) {
  const tarefasDoDia = [];
  
  
  fetch("http://localhost:3000/tarefas")
    .then(response => response.json())
    .then(tarefas => {
      
      tarefas.forEach(tarefa => {
        const [anoTarefa, mesTarefa, diaTarefa] = tarefa.data.split('-');
        if (parseInt(diaTarefa) === dia && parseInt(mesTarefa) - 1 === mesAtual && parseInt(anoTarefa) === anoAtual) {
          tarefasDoDia.push(tarefa);
        }
      });

      const listaTarefas = document.getElementById("task-list");
      listaTarefas.innerHTML = ''; 

      if (tarefasDoDia.length > 0) {
        tarefasDoDia.forEach(tarefa => {
          const li = document.createElement("li");
          li.innerHTML = `<span>${tarefa.nome}</span><br><small>${tarefa.data}</small>`;
          listaTarefas.appendChild(li);
        });
      } else {
        listaTarefas.innerHTML = '<li>Não há tarefas para este dia.</li>';
      }

      
      document.getElementById("task-details").style.display = 'block';
    })
    .catch(error => console.error('Erro ao carregar tarefas do dia:', error));
}

criarCalendario(mesAtual, anoAtual);
