// Tela do SemestreSafe.
// Usa só as funções de regras.js e salva no localStorage (chave "semestresafe:disciplinas").
import { validarDisciplina, validarNota, validarFaltas, calcularFrequencia, calcularNotaNecessaria } from './regras.js';

// Mostra no rodapé o commit publicado (o pipeline gera versao.txt na entrega).
// Fica antes de tudo para funcionar mesmo que a lista falhe ao desenhar.
fetch('versao.txt')
  .then((r) => (r.ok ? r.text() : null))
  .then((v) => { if (v) document.getElementById('versao').textContent = v.trim(); })
  .catch(() => {});

const CHAVE = 'semestresafe:disciplinas';

// ---------- localStorage ----------

/** true se um item salvo passa pelas próprias regras (evita que um dado ruim trave a tela). */
function itemValido(d) {
  return d !== null && typeof d === 'object'
    && validarDisciplina(d).length === 0
    && validarFaltas(d.faltas, d.cargaHoraria);
}

/**
 * Lê a lista salva. Se não houver nada (ou o conteúdo estiver corrompido), começa vazia.
 * Itens inválidos (editados à mão, de versão antiga etc.) são descartados, e uma P1 inválida vira null.
 */
function carregar() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE));
    if (!Array.isArray(dados)) return [];
    return dados
      .filter(itemValido)
      .map((d) => ({ ...d, p1: validarNota(d.p1) ? d.p1 : null }));
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

/** Formata número no padrão brasileiro (83.3 → "83,3"). */
const fmt = (n) => n.toLocaleString('pt-BR');

/** Formata quantidade de aulas no singular ou plural. */
const fmtAulas = (n) => `${n} ${n === 1 ? 'aula' : 'aulas'}`;

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

/** Texto e classe do resultado do simulador, a partir do retorno de calcularNotaNecessaria. */
function descreverResultado(resultado) {
  if (resultado === 'Aprovado') return { texto: 'Aprovado: qualquer nota na P2 já garante a média.', classe: 'ok' };
  if (resultado === 'Reprovado') return { texto: 'Reprovado: nem 10 na P2 alcança a média.', classe: 'erro' };
  return { texto: `Você precisa de ${fmt(resultado)} na P2.`, classe: 'alerta' };
}

/**
 * Valida a P1 digitada; se for válida, salva e redesenha. Campo vazio apaga a P1 salva.
 * Nota inválida só mostra o erro no próprio item (a P1 salva antes continua valendo).
 */
function calcularP2(id, campo, saida) {
  const d = disciplinas.find((x) => x.id === id);
  // badInput: o navegador recusou o texto (ex.: "1e"), então value vem vazio mas o campo não está vazio.
  if (campo.value.trim() === '' && !campo.validity.badInput) {
    d.p1 = null;
    salvar();
    renderizar();
    return;
  }
  const p1 = Number(campo.value);
  if (!validarNota(p1)) {
    saida.className = 'resultado erro';
    saida.textContent = 'Informe uma nota entre 0 e 10.';
    return;
  }
  d.p1 = p1;
  salvar();
  renderizar();
}

/** Tira a disciplina da lista, salva e redesenha. */
function remover(id) {
  disciplinas = disciplinas.filter((x) => x.id !== id);
  salvar();
  renderizar();
}

function criarItem(d) {
  const freq = calcularFrequencia(d.cargaHoraria, d.faltas);
  const classe = CLASSE_STATUS[freq.status];

  const item = criar('li', `disciplina ${classe}`);
  item.dataset.id = d.id;

  const topo = criar('div', 'topo');
  const titulo = criar('div');
  titulo.append(
    criar('h3', '', d.nome),
    criar('p', 'info', `${fmt(d.cargaHoraria)} h · média mínima ${fmt(d.mediaMinima)}`),
  );
  const acoes = criar('div', 'acoes');
  const botaoRemover = criar('button', 'perigo', 'Remover');
  botaoRemover.type = 'button';
  botaoRemover.dataset.acao = 'remover';
  botaoRemover.setAttribute('aria-label', `Remover a disciplina ${d.nome}`);
  botaoRemover.addEventListener('click', () => remover(d.id));
  acoes.append(criar('span', `status ${classe}`, freq.status), botaoRemover);
  topo.append(titulo, acoes);

  // Faltas
  const linhaFaltas = criar('div', 'linha');
  const menos = criar('button', 'secundario', '−1 falta');
  menos.type = 'button';
  menos.dataset.acao = 'menos';
  menos.setAttribute('aria-label', `Tirar 1 falta de ${d.nome}`);
  menos.disabled = !validarFaltas(d.faltas - 1, d.cargaHoraria);
  menos.addEventListener('click', () => alterarFaltas(d.id, -1));
  const mais = criar('button', 'secundario', '+1 falta');
  mais.type = 'button';
  mais.dataset.acao = 'mais';
  mais.setAttribute('aria-label', `Adicionar 1 falta em ${d.nome}`);
  mais.disabled = !validarFaltas(d.faltas + 1, d.cargaHoraria);
  mais.addEventListener('click', () => alterarFaltas(d.id, +1));
  linhaFaltas.append(criar('span', 'faltas', `Faltas: ${fmtAulas(d.faltas)}`), menos, mais);

  // Frequência
  const linhaFreq = criar('div', 'linha');
  linhaFreq.append(
    criar('span', '', `Presença: ${fmt(freq.percentualPresenca)}%`),
    criar('span', '', `· Ainda pode faltar: ${fmtAulas(freq.faltasRestantes)}`),
  );

  // Simulador da P2 (o resultado vem da P1 salva, então sobrevive ao recarregar a página)
  const linhaNota = criar('div', 'linha');
  const rotulo = criar('label', 'inline', 'Nota P1');
  const campoP1 = document.createElement('input');
  campoP1.type = 'number';
  campoP1.min = '0';
  campoP1.max = '10';
  campoP1.step = '0.1';
  campoP1.placeholder = '0 a 10';
  campoP1.dataset.acao = 'p1';
  if (d.p1 !== null) campoP1.value = d.p1;
  rotulo.append(campoP1);
  const calcular = criar('button', '', 'Calcular');
  calcular.type = 'button';
  calcular.dataset.acao = 'calcular';
  calcular.setAttribute('aria-label', `Calcular a nota da P2 de ${d.nome}`);
  const saida = criar('span', 'resultado');
  calcular.addEventListener('click', () => calcularP2(d.id, campoP1, saida));
  campoP1.addEventListener('keydown', (e) => { if (e.key === 'Enter') calcularP2(d.id, campoP1, saida); });
  if (d.p1 !== null) {
    try {
      const { texto, classe } = descreverResultado(calcularNotaNecessaria(d.mediaMinima, d.p1));
      saida.className = `resultado ${classe}`;
      saida.textContent = texto;
    } catch {
      saida.className = 'resultado erro';
      saida.textContent = 'Nota inválida.';
    }
  }
  linhaNota.append(rotulo, calcular, saida);

  item.append(topo, linhaFaltas, linhaFreq, linhaNota);

  // Com reprovação por falta, a nota da P2 não muda a situação: avisa para não dar falsa esperança.
  if (freq.status === 'Reprovado por falta' && d.p1 !== null) {
    item.append(criar('p', 'aviso', 'Atenção: reprovado por falta, a nota não muda a situação.'));
  }
  return item;
}

/**
 * Devolve o foco ao mesmo controle depois de redesenhar (quem usa teclado não volta para o topo).
 * Se o controle ficou desativado, foca o botão oposto de faltas; se o item foi removido, volta ao formulário.
 */
function restaurarFoco({ id, acao }) {
  const item = lista.querySelector(`[data-id="${id}"]`);
  if (!item) {
    campoNome.focus();
    return;
  }
  // Se o botão ficou desativado (ex.: +1 no limite), vai para o par dele, nunca para "Remover".
  const par = { mais: 'menos', menos: 'mais' }[acao];
  const alvo = item.querySelector(`[data-acao="${acao}"]:not(:disabled)`)
    ?? item.querySelector(`[data-acao="${par}"]:not(:disabled)`);
  alvo?.focus();
}

/** Redesenha a lista inteira a partir do array `disciplinas`. */
function renderizar() {
  const ativo = document.activeElement;
  const foco = lista.contains(ativo)
    ? { id: ativo.closest('.disciplina').dataset.id, acao: ativo.dataset.acao }
    : null;

  lista.replaceChildren(...disciplinas.map(criarItem));
  vazio.hidden = disciplinas.length > 0;

  if (foco) restaurarFoco(foco);
}

renderizar();
