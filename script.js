// === BANCO DE DADOS DE ENIGMAS PARA ENTRAR NA SALA SECRETA ===
const listaEnigmas = [
    { q: "Qual o primeiro nome do Mandaloriano?", a: "din" },
    { q: "Qual o metal raro e indestrutível usado nas armaduras mandalorianas?", a: "beskar" },
    { q: "Moff Gideon empunha qual sabre ancestral lendário?", a: "sombrio" },
    { q: "Qual o nome da criatura adotada por Din Djarin (Baby Yoda)?", a: "grogu" },
    { q: "Qual mestre Jedi treinou Luke Skywalker no planeta Dagobah?", a: "yoda" }
];

let enigmaSelecionado = null;

function carregarEnigmaAleatorio() {
    const indice = Math.floor(Math.random() * listaEnigmas.length);
    enigmaSelecionado = listaEnigmas[indice];
    document.getElementById('texto-pergunta-aleatoria').innerText = `"${enigmaSelecionado.q}"`;
}
carregarEnigmaAleatorio();

function verificarDesafio() {
    const respostaUser = document.getElementById('resposta-input').value.trim().toLowerCase();
    const erroEl = document.getElementById('mensagem-erro');
    const salaSecretaHub = document.getElementById('sala-secreta');

    if (respostaUser.includes(enigmaSelecionado.a)) {
        erroEl.style.color = "#00f2ff";
        erroEl.innerText = "✓ Assinatura aceita. Arquivos liberados abaixo.";
        salaSecretaHub.classList.remove('no-display');
        setTimeout(() => {
            salaSecretaHub.scrollIntoView({ behavior: 'smooth' });
        }, 400);
    } else {
        erroEl.style.color = "#ff0055";
        erroEl.innerText = "Falha crítica. Resposta incorreta nos registros públicos.";
    }
}

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

// === JOGO 1: ENGINE DO FLAPPY SHIP (CORRIGIDO) ===
let canvas, ctx, nave, obstaculos, frame, scoreFlappy, loopId, jogandoFlappy = false;

function inicializarJogoFlappy() {
    canvas = document.getElementById('canvasJogo');
    ctx = canvas.getContext('2d');
    
    // Evita duplicar eventos escutando a janela
    window.removeEventListener('keydown', empuxoNave);
    canvas.removeEventListener('click', empuxoNave);
    
    window.addEventListener('keydown', empuxoNave);
    canvas.addEventListener('click', empuxoNave);
    
    reiniciarJogoFlappy();
}

function empuxoNave(e) {
    if (!jogandoFlappy) return;
    if (e.code === 'Space' || e.type === 'click') {
        nave.velocidade = -5.5; // Faz a nave subir
        if(e.code === 'Space') e.preventDefault();
    }
}

function reiniciarJogoFlappy() {
    document.getElementById('tela-gameover').classList.add('no-display');
    
    // CORREÇÃO: "velocidade" ajustada corretamente com a letra "e" no final
    nave = { x: 120, y: 170, largura: 30, altura: 20, gravidade: 0.3, velocidade: 0 };
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

    // Fundo do espaço
    ctx.fillStyle = '#030305';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estrelas de fundo
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for (let i = 0; i < 20; i++) {
        ctx.fillRect((i * 45) % canvas.width, (i * 29) % canvas.height, 1.5, 1.5);
    }

    // Aplica física de gravidade à nave
    nave.velocidade += nave.gravidade;
    nave.y += nave.velocidade;

    // CORREÇÃO: Mata o jogador se ele bater no teto ou no chão e para o loop imediatamente
    if (nave.y + nave.altura > canvas.height || nave.y < 0) {
        derrubarNave();
        return; 
    }

    // Desenha a nave (triângulo futurista)
    ctx.fillStyle = '#00f2ff';
    ctx.beginPath();
    ctx.moveTo(nave.x + nave.largura, nave.y + nave.altura / 2);
    ctx.lineTo(nave.x, nave.y);
    ctx.lineTo(nave.x + 5, nave.y + nave.altura / 2);
    ctx.lineTo(nave.x, nave.y + nave.altura);
    ctx.closePath();
    ctx.fill();

    // Geração de obstáculos (pedras espaciais)
    if (frame % 90 === 0) {
        let gap = 130;
        let altMin = 40;
        let altMax = canvas.height - gap - altMin;
        let topoAlt = Math.floor(Math.random() * (altMax - altMin + 1)) + altMin;
        obstaculos.push({ x: canvas.width, topo: topoAlt, base: canvas.height - (topoAlt + gap), largura: 35, passou: false });
    }

    // Gerencia e desenha os obstáculos
    for (let i = obstaculos.length - 1; i >= 0; i--) {
        let obs = obstaculos[i];
        obs.x -= 3.5; // Velocidade de movimento do obstáculo

        ctx.fillStyle = '#ff0055';
        // Obstáculo Superior
        ctx.fillRect(obs.x, 0, obs.largura, obs.topo);
        // Obstáculo Inferior
        ctx.fillRect(obs.x, canvas.height - obs.base, obs.largura, obs.base);

        // CORREÇÃO: Caixa de colisão precisa precisa e fatal
        if (nave.x < obs.x + obs.largura && 
            nave.x + nave.largura > obs.x &&
            (nave.y < obs.topo || nave.y + nave.altura > canvas.height - obs.base)) {
            derrubarNave();
            return; // Interrompe o loop de renderização na hora
        }

        // Marca pontuação ao passar com sucesso
        if (!obs.passou && obs.x + obs.largura < nave.x) {
            obs.passou = true;
            scoreFlappy++;
            document.getElementById('score').innerText = scoreFlappy;
        }

        // Remove obstáculos fora da tela
        if (obs.x + obs.largura < 0) obstaculos.splice(i, 1);
    }

    frame++;
    loopId = requestAnimationFrame(loopFlappy);
}

function derrubarNave() {
    jogandoFlappy = false;
    if (loopId) cancelAnimationFrame(loopId);
    document.getElementById('pontos-finais').innerText = scoreFlappy;
    document.getElementById('tela-gameover').classList.remove('no-display');
}

// === JOGO 2: QUIZ SAGA COMPLETE ===
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
    document.getElementById('quiz-resultado-texto').innerText = `Varredura de dados concluída. Desempenho operacional estável: ${acertosQuiz} acertos de 10 possíveis.`;
}

// === SISTEMA DE LEALDADE DE VOTOS ===
let bancoVotosficticio = { jedi: 4092, vader: 5821, mando: 6104 };
let votoUsuarioEfetivado = null;

function atualizarPlacarVisualVotos() {
    document.getElementById('votos-jedi').innerText = `Registros: ${bancoVotosficticio.jedi} assinaturas`;
    document.getElementById('votos-vader').innerText = `Registros: ${bancoVotosficticio.vader} assinaturas`;
    document.getElementById('votos-mando').innerText = `Registros: ${bancoVotosficticio.mando} assinaturas`;
}
atualizarPlacarVisualVotos();

function votarFaccao(escolha) {
    const boxAlerta = document.getElementById('alerta-voto');
    boxAlerta.className = "alerta-sistema";

    if (votoUsuarioEfetivado !== null && votoUsuarioEfetivado !== escolha) {
        boxAlerta.innerText = "🚨 DETECTADO DESVIO DE CONDUTA! Sua lealdade inicial já foi selada na inteligência da Orla Exterior.";
        boxAlerta.classList.add('alerta-traira');
        boxAlerta.style.display = 'block';
        return;
    }

    if (votoUsuarioEfetivado === escolha) {
        boxAlerta.innerText = "Sua assinatura biométrica já valida esta facção.";
        boxAlerta.classList.add('alerta-sucesso');
        boxAlerta.style.display = 'block';
        return;
    }

    votoUsuarioEfetivado = escolha;
    bancoVotosficticio[escolha] += 1;
    atualizarPlacarVisualVotos();

    boxAlerta.innerText = "✓ Transmissão de juramento criptografada e enviada para a central galáctica.";
    boxAlerta.classList.add('alerta-sucesso');
    boxAlerta.style.display = 'block';
    acionarHolograma(escolha);
}

function acionarHolograma(lado) {
    const overlay = document.getElementById('tela-animacao');
    const txt = document.getElementById('texto-animacao');

    if (lado === 'jedi') {
        txt.innerText = '""Que a Força esteja com você. O conhecimento deve ser compartilhado, nunca guardado."" — Mestre Yoda';
    } else if (lado === 'vader') {
        txt.innerText = '""Você não conhece o real poder do Lado Sombrio. Junte-se a nós ou enfrente a destruição."" — Darth Vader';
    } else if (lado === 'mando') {
        txt.innerText = '""Armaduras protegem o corpo, mas a honra protege o clã. Este é o Caminho."" — Din Djarin';
    }
    overlay.style.display = 'flex';
}

function fecharAnimacao() { document.getElementById('tela-animacao').style.display = 'none'; }
