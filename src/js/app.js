// Tela do SemestreSafe.
// Usa só as funções de regras.js e salva no localStorage (chave "semestresafe:disciplinas").
import { validarDisciplina, validarNota, validarFaltas, calcularFrequencia, calcularNotaNecessaria } from './regras.js';

const CHAVE = 'semestresafe:disciplinas';

// ---------- localStorage ----------

/** Lê a lista salva. Se não houver nada (ou o conteúdo estiver corrompido), começa vazia. */
function carregar() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE));
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

/** Grava a lista inteira no localStorage. */
function salvar() {
  localStorage.setItem(CHAVE, JSON.stringify(disciplinas));
}

let disciplinas = carregar();

// ---------- Elementos da página ----------

const form = document.getElementById('form-disciplina');
const campoNome = document.getElementById('nome');
const campoCarga = document.getElementById('carga');
const campoMedia = document.getElementById('media');
const listaErros = document.getElementById('erros');
const lista = document.getElementById('lista');
const vazio = document.getElementById('vazio');

/** Converte o texto de um campo em número; campo vazio vira NaN (as regras tratam como inválido). */
function lerNumero(campo) {
  return campo.value.trim() === '' ? NaN : Number(campo.value);
}

/** Cria um elemento com classe e texto (sempre via textContent, nunca innerHTML). */
function criar(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

// ---------- Formulário ----------

function mostrarErros(erros) {
  listaErros.replaceChildren(...erros.map((msg) => criar('li', '', msg)));
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const dados = {
    nome: campoNome.value.trim(),
    cargaHoraria: lerNumero(campoCarga),
    mediaMinima: lerNumero(campoMedia),
  };

  const erros = validarDisciplina(dados);
  mostrarErros(erros);
  if (erros.length > 0) return;

  disciplinas.push({ id: Date.now(), ...dados, faltas: 0, p1: null });
  salvar();
  renderizar();

  form.reset(); // volta a média para o padrão 6
  campoNome.focus();
});

// ---------- Lista ----------

// Classe CSS de cada status devolvido por calcularFrequencia (verde, amarelo, vermelho).
const CLASSE_STATUS = {
  'Regular': 'regular',
  'No limite': 'limite',
  'Reprovado por falta': 'reprovado',
};

/** Soma (+1) ou subtrai (−1) uma falta, só salvando se validarFaltas aprovar. */
function alterarFaltas(id, delta) {
  const d = disciplinas.find((x) => x.id === id);
  const novas = d.faltas + delta;
  if (!validarFaltas(novas, d.cargaHoraria)) return;
  d.faltas = novas;
  salvar();
  renderizar();
}

function criarItem(d) {
  const freq = calcularFrequencia(d.cargaHoraria, d.faltas);
  const classe = CLASSE_STATUS[freq.status];

  const item = criar('li', `disciplina ${classe}`);

  const topo = criar('div', 'topo');
  const titulo = criar('div');
  titulo.append(
    criar('h3', '', d.nome),
    criar('p', 'info', `${d.cargaHoraria} h · média mínima ${d.mediaMinima}`),
  );
  topo.append(titulo, criar('span', `status ${classe}`, freq.status));

  // Faltas
  const linhaFaltas = criar('div', 'linha');
  const menos = criar('button', 'secundario', '−1 falta');
  menos.type = 'button';
  menos.disabled = !validarFaltas(d.faltas - 1, d.cargaHoraria);
  menos.addEventListener('click', () => alterarFaltas(d.id, -1));
  const mais = criar('button', 'secundario', '+1 falta');
  mais.type = 'button';
  mais.disabled = !validarFaltas(d.faltas + 1, d.cargaHoraria);
  mais.addEventListener('click', () => alterarFaltas(d.id, +1));
  linhaFaltas.append(criar('span', 'faltas', `Faltas: ${d.faltas} h`), menos, mais);

  // Frequência
  const linhaFreq = criar('div', 'linha');
  linhaFreq.append(
    criar('span', '', `Presença: ${freq.percentualPresenca}%`),
    criar('span', '', `· Ainda pode faltar: ${freq.faltasRestantes} h`),
  );

  item.append(topo, linhaFaltas, linhaFreq);
  return item;
}

/** Redesenha a lista inteira a partir do array `disciplinas`. */
function renderizar() {
  lista.replaceChildren(...disciplinas.map(criarItem));
  vazio.hidden = disciplinas.length > 0;
}

renderizar();

// Mostra no rodapé o commit publicado (o pipeline gera versao.txt na entrega).
fetch('versao.txt')
  .then((r) => (r.ok ? r.text() : null))
  .then((v) => { if (v) document.getElementById('versao').textContent = v.trim(); })
  .catch(() => {});
