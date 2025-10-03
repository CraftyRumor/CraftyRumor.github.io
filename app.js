// Converte HH:MM para segundos
function toSeconds(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 3600 + m * 60;
}

// Converte segundos para HH:MM (com sinal)
function formatTime(segundos) {
  const sinal = segundos < 0 ? "-" : "";
  segundos = Math.abs(segundos);
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  return `${sinal}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Carregar registros do localStorage
function getRegistros() {
  return JSON.parse(localStorage.getItem("registros")) || [];
}

// Salvar registros no localStorage
function saveRegistros(registros) {
  localStorage.setItem("registros", JSON.stringify(registros));
}

// Atualizar saldo na tela
function atualizarSaldo() {
  const registros = getRegistros();
  const totalSegundos = registros.reduce((acc, r) => acc + r.saldo, 0);
  document.getElementById("saldoDisplay").textContent =
    "Saldo atual: " + formatTime(totalSegundos);
}

// Captura data atual no formato YYYY-MM-DD
function getDataHoje() {
  const hoje = new Date();
  return hoje.toISOString().split("T")[0];
}

// Listener do formulário
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // evita recarregar a página

    const entrada = document.getElementById("entrada").value;
    const saida = document.getElementById("saida").value;
    const data = getDataHoje(); // pega automaticamente a data de hoje

    if (!entrada || !saida) {
      alert("Preencha os horários corretamente.");
      return;
    }

    let registros = getRegistros();

    // Verifica se já existe registro na mesma data
    if (registros.some((r) => r.data === data)) {
      alert("Já existe um registro para hoje.");
      return;
    }

    // Calcula saldo considerando 8h de trabalho e 1h de intervalo
    const segundosEntrada = toSeconds(entrada);
    const segundosSaida = toSeconds(saida);
    const jornada = 8 * 3600;
    const intervalo = 1 * 3600;

    const saldo = (segundosSaida - segundosEntrada - intervalo) - jornada;

    registros.push({ data, entrada, saida, saldo });
    saveRegistros(registros);

    atualizarSaldo();

    form.reset();
  });

  // Mostra saldo acumulado ao abrir a página
  atualizarSaldo();
});
