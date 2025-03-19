let mesAtual = new Date().getMonth(); // Mês atual (0 = Janeiro)
let anoAtual = new Date().getFullYear(); // Ano atual

// Função para criar o calendário
function criarCalendario(mes, ano) {
  const diasDoMes = new Date(ano, mes + 1, 0).getDate(); // Número de dias no mês
  const primeiroDia = new Date(ano, mes, 1).getDay(); // Dia da semana do primeiro dia do mês

  // Exibir mês e ano no topo
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  document.getElementById("month-year").textContent = `${meses[mes]} ${ano}`;

  let calendarioHTML = "<table><tr>";
  
  // Adicionando os dias da semana
  const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  diasDaSemana.forEach(dia => {
    calendarioHTML += `<th>${dia}</th>`;
  });
  calendarioHTML += "</tr><tr>";

  // Criando o calendário vazio com células em branco no início
  for (let i = 0; i < primeiroDia; i++) {
    calendarioHTML += "<td></td>";
  }

  // Adicionando os dias do mês
  for (let dia = 1; dia <= diasDoMes; dia++) {
    if ((primeiroDia + dia - 1) % 7 === 0 && dia !== 1) {
      calendarioHTML += "</tr><tr>";
    }

    calendarioHTML += `<td class="day" data-dia="${dia}" onclick="mostrarDetalhesTarefas(${dia})">${dia}</td>`;
  }

  calendarioHTML += "</tr></table>";
  document.getElementById("calendar").innerHTML = calendarioHTML;

  // Adicionando as tarefas ao calendário
  carregarTarefas(mes, ano);
}

// Função para carregar as tarefas da API de calendário
function carregarTarefas(mes, ano) {
  fetch("http://localhost:3000/tarefas")
    .then(response => response.json())
    .then(tarefas => {
      // Limpar as tarefas anteriores
      const diasComTarefas = document.querySelectorAll(".day");
      diasComTarefas.forEach(dia => {
        dia.innerHTML = dia.innerHTML.replace(/<div class="task">.*?<\/div>/g, ""); // Remove tarefas antigas
      });

      // Adiciona as tarefas aos dias corretos
      tarefas.forEach(tarefa => {
        const [anoTarefa, mesTarefa, diaTarefa] = tarefa.data.split('-'); // Data no formato YYYY-MM-DD
        if (parseInt(mesTarefa) - 1 === mes && parseInt(anoTarefa) === ano) { // Verifica se a tarefa corresponde ao mês e ano
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

// Função para mudar o mês
function mudarMes(incremento) {
  mesAtual += incremento;

  // Se for dezembro (mes 11), vai para janeiro do próximo ano
  if (mesAtual > 11) {
    mesAtual = 0;
    anoAtual++;
  }

  // Se for janeiro (mes 0), vai para dezembro do ano anterior
  if (mesAtual < 0) {
    mesAtual = 11;
    anoAtual--;
  }

  // Recria o calendário com o novo mês
  criarCalendario(mesAtual, anoAtual);
}

// Função para mostrar as tarefas detalhadas de um dia
function mostrarDetalhesTarefas(dia) {
  const tarefasDoDia = [];
  
  // Buscar todas as tarefas carregadas
  fetch("http://localhost:3000/tarefas")
    .then(response => response.json())
    .then(tarefas => {
      // Filtra as tarefas do dia clicado
      tarefas.forEach(tarefa => {
        const [anoTarefa, mesTarefa, diaTarefa] = tarefa.data.split('-');
        if (parseInt(diaTarefa) === dia && parseInt(mesTarefa) - 1 === mesAtual && parseInt(anoTarefa) === anoAtual) {
          tarefasDoDia.push(tarefa);
        }
      });

      // Exibir as tarefas detalhadas
      const listaTarefas = document.getElementById("task-list");
      listaTarefas.innerHTML = ''; // Limpar a lista antes de adicionar as novas tarefas

      if (tarefasDoDia.length > 0) {
        tarefasDoDia.forEach(tarefa => {
          const li = document.createElement("li");
          li.innerHTML = `<span>${tarefa.nome}</span><br><small>${tarefa.data}</small>`;
          listaTarefas.appendChild(li);
        });
      } else {
        listaTarefas.innerHTML = '<li>Não há tarefas para este dia.</li>';
      }

      // Exibir a seção de detalhes
      document.getElementById("task-details").style.display = 'block';
    })
    .catch(error => console.error('Erro ao carregar tarefas do dia:', error));
}

// Inicializa o calendário para o mês atual
criarCalendario(mesAtual, anoAtual);
