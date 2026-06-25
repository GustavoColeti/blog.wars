// === BANCO DE DADOS DE ENIGMAS PARA ENTRAR NA SALA SECRETA ===
const listaEnigmas = [
    { q: "Qual o primeiro nome do Mandaloriano?", a: "din" },
    { q: "Qual o metal raro e indestrutível usado nas armaduras mandalorianas?", a: "beskar" },
    { q: "Moff Gideon empunha qual sabre ancestral lendário?", a: "sombrio" },
    { q: "Qual o nome da criatura adotada por Din Djarin (Baby Yoda)?", a: "grogu" },
    { q: "Qual mestre Jedi treinou Luke Skywalker no planeta Dagobah?", a: "yoda" }
];

let enigmaSelecionado = null;

// Escolhe uma pergunta aleatória do Holocron ao iniciar a página
function carregarEnigmaAleatorio() {
    const indice = Math.floor(Math.random() * listaEnigmas.length);
    enigmaSelecionado = listaEnigmas[indice];
    document.getElementById('texto-pergunta-aleatoria').innerText = `"${enigmaSelecionado.q}"`;
}
carregarEnigmaAleatorio();

// === SISTEMA DE VALIDAÇÃO DO DESAFIO ===
function verificarDesafio() {
    const respostaUser = document.getElementById('resposta-input').value.trim().toLowerCase();
    const erroEl = document.getElementById('mensagem-erro');
    const salaSecretaHub = document.getElementById('sala-secreta');

    if (respostaUser.includes(enigmaSelecionado.a)) {
        erroEl.style.color = "#4ade80";
        erroEl.innerText = "✓ Código aceito! Painel central liberado abaixo.";
        salaSecretaHub.classList.remove('no-display');
        setTimeout(() => {
            salaSecretaHub.scrollIntoView({ behavior: 'smooth' });
        }, 400);
    } else {
        erroEl.style.color = "#f87171";
        erroEl.innerText = "Acesso Negado! Resposta incorreta para este registro de dados.";
    }
}

// === ALTERNADOR DE SUB-JOGOS NO HUB ===
function alternarSubJogo(tipo) {
    document.getElementById('sub-jogo-flappy').classList.add('no-display');
    document.getElementById('sub-jogo-quiz').classList.add('no-display');

    if (tipo === 'flappy') {
        document.getElementById('sub-jogo-flappy').classList.remove('no-display');
        inicializarJogoFlappy();
    } else if (tipo === 'quiz') {
        document.getElementById('sub-jogo-quiz').classList.remove('no-display');
        iniciarNovoQuiz10();
    }
}

// === JOGO 1: ENGINE DO FLAPPY SHIP ===
let canvas, ctx, nave, obstaculos, frame, scoreFlappy, loopId, jogandoFlappy = false;

function inicializarJogoFlappy() {
    canvas = document.getElementById('canvasJogo');
    ctx = canvas.getContext('2d');
    
    // Remove listeners antigos para evitar travamento acumulado
    window.removeEventListener('keydown', empuxoNave);
    canvas.removeEventListener('click', empuxoNave);

    window.addEventListener('keydown', empuxoNave);
    canvas.addEventListener('click', empuxoNave);
    
    reiniciarJogoFlappy();
}

function empuxoNave(e) {
    if ((e.code === 'Space' || e.type === 'click') && jogandoFlappy) {
        nave.velocidade = -5.8;
        if(e.code === 'Space') e.preventDefault();
    }
}

function reiniciarJogoFlappy() {
    document.getElementById('tela-gameover').classList.add('no-display');
    nave = { x: 120, y: 170, largura: 32, altura: 22, gravidade: 0.32, velocidade: 0 };
    obstaculos = [];
    frame = 0;
    scoreFlappy = 0;
    document.getElementById('score').innerText = scoreFlappy;
    jogandoFlappy = true;

    if (loopId) cancelAnimationFrame(loopId);
    loopFlappy();
}

function loopFlappy() {
    if (!jogandoFlappy) return;
    
    // Limpar tela
    ctx.fillStyle = '#06060f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar estrelas fixas de fundo
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 15; i++) {
        ctx.fillRect((i * 65) % canvas.width, (i * 37) % canvas.height, 2, 2);
    }

    // Física da nave
    nave.velocidade += nave.gravidade;
    nave.y += nave.velocidade;

    if (nave.y + nave.altura > canvas.height || nave.y < 0) derrubarNave();

    // Renderizar nave (formato triangular de caça estelar)
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(nave.x + nave.largura, nave.y + nave.altura / 2);
    ctx.lineTo(nave.x, nave.y);
    ctx.lineTo(nave.x + 6, nave.y + nave.altura / 2);
    ctx.lineTo(nave.x, nave.y + nave.altura);
    ctx.closePath();
    ctx.fill();

    // Geração de barreiras
    if (frame % 100 === 0) {
        let gap = 130;
        let altMin = 30;
        let altMax = canvas.height - gap - altMin;
        let topoAlt = Math.floor(Math.random() * (altMax - altMin + 1)) + altMin;
        obstaculos.push({ x: canvas.width, topo: topoAlt, base: canvas.height - (topoAlt + gap), largura: 25, passou: false });
    }

    // Movimentação e colisão das barreiras
    for (let i = obstaculos.length - 1; i >= 0; i--) {
        let obs = obstaculos[i];
        obs.x -= 3.2;

        // Desenhar barreiras (Estilo feixes lasers de perigo)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(obs.x, 0, obs.largura, obs.topo);
        ctx.fillRect(obs.x, canvas.height - obs.base, obs.largura, obs.base);

        // Checar colisões
        if (nave.x < obs.x + obs.largura && nave.x + nave.largura > obs.x && 
           (nave.y < obs.topo || nave.y + nave.altura > canvas.height - obs.base)) {
            derrubarNave();
        }

        // Computar ponto
        if (!obs.passou && obs.x + obs.largura < nave.x) {
            obs.passou = true;
            scoreFlappy++;
            document.getElementById('score').innerText = scoreFlappy;
        }

        if (obs.x + obs.largura < 0) obstaculos.splice(i, 1);
    }

    frame++;
    loopId = requestAnimationFrame(loopFlappy);
}

function derrubarNave() {
    jogandoFlappy = false;
    document.getElementById('pontos-finais').innerText = scoreFlappy;
    document.getElementById('tela-gameover').classList.remove('no-display');
}


// === JOGO 2: ENGINE DO QUIZ COMPLETO DE 10 PERGUNTAS ===
const bancoQuestoesQuiz = [
    { p: "1. Quem construiu C-3PO?", o: ["Luke Skywalker", "Anakin Skywalker", "Obi-Wan Kenobi", "Lando Calrissian"], c: 1 },
    { p: "2. Qual a cor do sabre de luz de Mace Windu?", o: ["Azul", "Verde", "Roxo", "Amarelo"], c: 2 },
    { p: "3. Qual espécie comercial comprou e escravizou Anakin em Tatooine?", o: ["Toydariano (Watto)", "Jawa", "Ewok", "Tusken Raider"], c: 0 },
    { p: "4. Quem foi o mestre de Obi-Wan Kenobi?", o: ["Yoda", "Qui-Gon Jinn", "Count Dooku", "Mace Windu"], c: 1 },
    { p: "5. Em qual planeta a Estrela da Morte foi destruída pela primeira vez?", o: ["Endor", "Yavin 4", "Hoth", "Coruscant"], c: 1 },
    { p: "6. Qual personagem disse a frase: 'I am your father'?", o: ["Darth Sidious", "Darth Vader", "Obi-Wan", "Count Dooku"], c: 1 },
    { p: "7. Quem é a irmã gêmea de Luke Skywalker?", o: ["Padmé Amidala", "Rey", "Leia Organa", "Ahsoka Tano"], c: 2 },
    { p: "8. Que criatura habita o lixão da Estrela da Morte no Episódio IV?", o: ["Rancor", "Dianoga", "Sarlacc", "Wampa"], c: 1 },
    { p: "9. Qual o planeta natal de Han Solo?", o: ["Corellia", "Bespin", "Kashyyyk", "Alderaan"], c: 0 },
    { p: "10. Quantos membros compõem a regra de dois dos Sith por vez?", o: ["Dois", "Dez", "Centenas", "Apenas Um"], c: 0 }
];

let indiceQuestaoAtual = 0;
let acertosQuiz = 0;

function iniciarNovoQuiz10() {
    indiceQuestaoAtual = 0;
    acertosQuiz = 0;
    document.getElementById('bloco-pergunta-quiz').classList.remove('no-display');
    document.getElementById('bloco-resultado-quiz').classList.add('no-display');
    renderizarQuestaoQuiz();
}

function renderizarQuestaoQuiz() {
    const dadosQuestao = bancoQuestoesQuiz[indiceQuestaoAtual];
    document.getElementById('quiz-pergunta-texto').innerText = dadosQuestao.p;
    
    const containerOpcoes = document.getElementById('quiz-opcoes-container');
    containerOpcoes.innerHTML = "";

    dadosQuestao.o.forEach((opcao, idx) => {
        const btn = document.createElement('button');
        btn.className = "btn-opcao-quiz";
        btn.innerText = opcao;
        btn.onclick = () => processarRespostaQuiz(idx);
        containerOpcoes.appendChild(btn);
    });
}

function processarRespostaQuiz(opcaoSelecionada) {
    if (opcaoSelecionada === bancoQuestoesQuiz[indiceQuestaoAtual].c) {
        acertosQuiz++;
    }

    indiceQuestaoAtual++;

    if (indiceQuestaoAtual < bancoQuestoesQuiz.length) {
        renderizarQuestaoQuiz();
    } else {
        exibirResultadoQuiz();
    }
}

function exibirResultadoQuiz() {
    document.getElementById('bloco-pergunta-quiz').classList.add('no-display');
    document.getElementById('bloco-resultado-quiz').classList.remove('no-display');
    document.getElementById('quiz-resultado-texto').innerText = `Varredura de dados concluída. Você acertou ${acertosQuiz} de 10 perguntas!`;
}


// === SISTEMA DE VOTAÇÃO COERCITIVO (MUDANÇA BLOQUEADA) ===
let bancoVotosficticio = { jedi: 2405, vader: 1894, mando: 3211 };
let votoUsuarioEfetivado = null;

function atualizarPlacarVisualVotos() {
    document.getElementById('votos-jedi').innerText = `Votos: ${bancoVotosficticio.jedi} pessoas`;
    document.getElementById('votos-vader').innerText = `Votos: ${bancoVotosficticio.vader} pessoas`;
    document.getElementById('votos-mando').innerText = `Votos: ${bancoVotosficticio.mando} pessoas`;
}
atualizarPlacarVisualVotos();

function votarFaccao(escolha) {
    const boxAlerta = document.getElementById('alerta-voto');
    boxAlerta.className = "alerta-sistema";

    if (votoUsuarioEfetivado !== null && votoUsuarioEfetivado !== escolha) {
        boxAlerta.innerText = "🚨 ALERTA DE TRAIÇÃO! Tentando mudar de lado na guerra civil galáctica? Seu voto original está trancado!";
        boxAlerta.classList.add('alerta-traira');
        boxAlerta.style.display = 'block';
        return;
    }

    if (votoUsuarioEfetivado === escolha) {
        boxAlerta.innerText = "Sua lealdade já está registrada e protegida neste lado!";
        boxAlerta.classList.add('alerta-sucesso');
        boxAlerta.style.display = 'block';
        return;
    }

    votoUsuarioEfetivado = escolha;
    bancoVotosficticio[escolha] += 1;
    atualizarPlacarVisualVotos();

    boxAlerta.innerText = "✓ Escolha processada com sucesso! Seus dados foram salvos na base planetária.";
    boxAlerta.classList.add('alerta-sucesso');
    boxAlerta.style.display = 'block';

    acionarHolograma(escolha);
}

function acionarHolograma(lado) {
    const overlay = document.getElementById('tela-animacao');
    const txt = document.getElementById('texto-animacao');

    if (lado === 'jedi') {
        txt.innerText = "Yoda diz: 'Que a Força esteja com você. Treinado você será!'";
    } else if (lado === 'vader') {
        txt.innerText = "Darth Vader diz: 'Você não conhece o poder do Lado Sombrio. Junte-se a mim!'";
    } else if (lado === 'mando') {
        txt.innerText = "Mandaloriano diz: 'This is the Way. Este é o único Caminho.'";
    }
    overlay.style.display = 'flex';
}

function fecharAnimacao() { document.getElementById('tela-animacao').style.display = 'none'; }


// === MODAL DE TEXTOS INTEGRADOS COMPLETO ===
const dbArtigosTextos = {
    djarin: {
        t: "1. Quem é o Mandaloriano? A Trajetória de Din Djarin",
        p: "<p>O protagonista da série, conhecido popularmente como 'O Mandaloriano', chama-se Din Djarin. Ele não nasceu no planeta Mandalore; na verdade, ele foi um 'enjeitado', uma criança órfã resgatada por guerreiros mandalorianos durante as Guerras Clônicas.</p><p>Criado sob as rígidas tradições de uma seita conhecida como a Tribo, ele se tornou um caçador de recompensas habilidoso e solitário, operando nas bordas externas da galáxia após a queda do Império Galáctico.</p><p>A trajetória de Din Djarin muda drasticamente quando ele aceita uma missão misteriosa que o leva a encontrar uma criatura da mesma espécie do mestre Yoda. Em vez de entregar o alvo para receber sua recompensa, o Mandaloriano decide quebrar o código da sua guilda para proteger a criança, iniciando uma jornada de transformação que o força a questionar suas próprias crenças e a assumir o papel de pai e protetor.</p>"
    },
    grogu: {
        t: "2. O Fenômeno Grogu: De 'Baby Yoda' a Aprendiz Mandaloriano",
        p: "<p>Batizado inicialmente pelo público como 'Baby Yoda', o personagem Grogu tornou-se um dos maiores fenômenos de cultura pop dos últimos anos. Ele pertence à mesma espécie misteriosa e rara do lendário Mestre Yoda e, apesar de sua aparência infantil e vulnerável, Grogu já viveu por mais de 50 anos e possui uma forte conexão com a Força, sendo capaz de mover objetos grandes e curar ferimentos graves.</p><p>Antes de encontrar Din Djarin, Grogu foi criado no Templo Jedi em Coruscant e precisou ser escondido após a Ordem 66. Ao longo de sua jornada na série, ele passa de um alvo indefeso a um aprendiz. Mesmo tendo a oportunidade de treinar com Luke Skywalker para se tornar um Jedi, Grogu escolhe retornar para os braços de seu protetor, sendo oficialmente adotado por Din Djarin e iniciando seu treinamento para seguir os costumes mandalorianos.</p>"
    },
    beskar: {
        t: "3. A Armadura de Beskar: O Design Visual da Série",
        p: "<p>Um dos elementos visuais mais marcantes e simbólicos de The Mandalorian é a armadura do protagonista, feita de Beskar. O Beskar é um metal extremamente raro e valioso, nativo do planeta Mandalore, conhecido por sua resistência lendária. Ele é capaz de suportar disparos de blasters e até mesmo resistir a golpes diretos de sabres de luz, o que torna os guerreiros mandalorianos oponentes temíveis.</p><p>No início da série, Din Djarin veste uma armadura remendada com peças de outros metals. Conforme ele cumpre missões perigosas, ele recebe placas de Beskar puro como pagamento, que são fundidas pela Armadora para criar seu traje prateado e reluzente. Além da proteção física, a evolução da armadura funciona como um indicador visual do status e das conquistas do personagem dentro da narrativa.</p>"
    },
    aliados: {
        t: "4. Aliados e Inimigos de Peso na Galáxia",
        p: "<p>A jornada do Mandaloriano é marcada por encontros com personagens que moldam o destino da galáxia. Entre os principais aliados está Bo-Katan Kryze, uma líder mandaloriana de linhagem real que busca unificar seu povo destruído e recuperar o trono de Mandalore. Outros aliados importantes incluem Greef Karga, o líder da guilda de caçadores de recompensa que se torna o magistrado de Nevarro, e a Armadora, que atua como a guia espiritual e técnica da seita de Din Djarin.</p><p>Do lado dos antagonistas, o principal perigo é representado por Moff Gideon, um ambicioso líder remanescente do Império Galáctico. Gideon lidera uma facção imperial secreta e busca capturar Grogu para realizar experimentos com seu sangue rico em 'Midi-chlorians'. Para consolidar seu poder, ele chega a empunhar o Sabre Sombrio (Darksaber), uma arma ancestral que simboliza o direito de governar o planeta Mandalore.</p>"
    }
};

function abrirArtigo(chave) {
    document.getElementById('modal-titulo').innerText = dbArtigosTextos[chave].t;
    document.getElementById('modal-texto').innerHTML = dbArtigosTextos[chave].p;
    document.getElementById('modal-artigo').style.display = 'flex';
}

function fecharArtigoModal() { document.getElementById('modal-artigo').style.display = 'none'; }

window.onclick = function(e) {
    const modal = document.getElementById('modal-artigo');
    if (e.target === modal) modal.style.display = 'none';
}