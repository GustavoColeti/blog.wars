<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hub Star Wars & Flappy Ship</title>
    <style>
        /* --- ESTILIZAÇÃO GERAL E DO JOGO --- */
        body {
            background-color: #0b0b12;
            color: #ffffff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            overflow-x: hidden;
        }

        h1, h2, h3 {
            color: #00f2ff;
            text-shadow: 0 0 10px rgba(0, 242, 255, 0.5);
        }

        .container {
            width: 90%;
            max-width: 800px;
            background: #12121f;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
            border: 1px solid #1f1f38;
            text-align: center;
            margin-bottom: 20px;
        }

        /* Classes de Controle de Exibição */
        .no-display {
            display: none !important;
        }

        /* Inputs e Botões */
        input[type="text"] {
            background: #1c1c30;
            border: 1px solid #00f2ff;
            color: #fff;
            padding: 10px;
            border-radius: 6px;
            font-size: 16px;
            width: 70%;
            margin-bottom: 10px;
            outline: none;
        }

        button {
            background: #ff0055;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            transition: 0.3s;
            margin: 5px;
        }

        button:hover {
            background: #ff3377;
            box-shadow: 0 0 10px #ff0055;
        }

        .btn-abas {
            background: #1c1c30;
            border: 1px solid #1f1f38;
        }
        .btn-abas:hover {
            background: #00f2ff;
            color: #000;
            box-shadow: 0 0 10px #00f2ff;
        }

        /* Area do Canvas do Jogo */
        #canvasJogo {
            border: 2px solid #ff0055;
            border-radius: 8px;
            background-color: #030305;
            display: block;
            margin: 20px auto;
            max-width: 100%;
            cursor: pointer;
        }

        /* Placar e Game Over */
        .painel-jogo {
            position: relative;
            width: 400px;
            margin: 0 auto;
        }

        .score-container {
            font-size: 20px;
            margin-bottom: 10px;
            color: #00f2ff;
        }

        #tela-gameover {
            background: rgba(255, 0, 85, 0.2);
            border: 1px solid #ff0055;
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
        }

        /* Layout do Quiz */
        .btn-opcao-quiz {
            display: block;
            width: 100%;
            background: #1c1c30;
            border: 1px solid #1f1f38;
            margin: 8px 0;
            text-align: left;
            padding: 12px;
        }
        .btn-opcao-quiz:hover {
            background: #00f2ff;
            color: #000;
        }

        /* Sistema de Votação */
        .container-votos {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
        }
        .card-voto {
            background: #1c1c30;
            padding: 15px;
            border-radius: 8px;
            width: 28%;
            border: 1px solid #1f1f38;
        }
        .alerta-sistema {
            margin-top: 15px;
            padding: 10px;
            border-radius: 6px;
            display: none;
        }
        .alerta-sucesso { background: rgba(0, 242, 255, 0.2); border: 1px solid #00f2ff; color: #00f2ff; }
        .alerta-traira { background: rgba(255, 0, 85, 0.2); border: 1px solid #ff0055; color: #ff0055; }

        /* Holograma Modal Overlay */
        #tela-animacao {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 100;
        }
        .caixa-holograma {
            background: #0b0b12;
            border: 2px solid #00f2ff;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 0 30px #00f2ff;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>🔒 Terminal de Segurança da Orla Exterior</h2>
        <p>Responda corretamente para liberar os submódulos da sala secreta:</p>
        <p id="texto-pergunta-aleatoria" style="font-style: italic; font-size: 18px; color: #ffff00;"></p>
        
        <input type="text" id="resposta-input" placeholder="Digite sua resposta aqui...">
        <br>
        <button onclick="verificarDesafio()">Verificar Assinatura</button>
        <p id="mensagem-erro" style="font-weight: bold; margin-top: 10px;"></p>
    </div>

    <div id="sala-secreta" class="container no-display">
        <h2>🛸 Sala Secreta Liberada</h2>
        <p>Escolha um dos sistemas operacionais galácticos abaixo para iniciar:</p>
        
        <button class="btn-abas" onclick="alternarSubJogo('flappy')">Navegar no Cinturão (Flappy Ship)</button>
        <button class="btn-abas" onclick="alternarSubJogo('quiz')">Testar Conhecimento (Quiz 10)</button>

        <hr style="border: 0; border-top: 1px solid #1f1f38; margin: 20px 0;">

        <div id="sub-jogo-flappy" class="no-display">
            <h3>Métrica de Voo: <span id="score">0</span> parsecs</h3>
            <div class="painel-jogo">
                <canvas id="canvasJogo" width="400" height="400"></canvas>
                
                <div id="tela-gameover" class="no-display">
                    <h3 style="color: #ff0055; margin: 0 0 10px 0;">💥 NAVE DESTRUÍDA!</h3>
                    <p>Sua distância de voo: <span id="pontos-finais">0</span> parsecs</p>
                    <button onclick="reiniciarJogoFlappy()">Reiniciar Propulsores</button>
                </div>
            </div>
            <p style="font-size: 13px; color: #888;">Dica: Clique no painel ou pressione a barra de [Espaço] para dar empuxo e subir.</p>
        </div>

        <div id="sub-jogo-quiz" class="no-display">
            <h3>Banco de Dados de Holocron</h3>
            <div id="bloco-pergunta-quiz">
                <p id="quiz-pergunta-texto" style="font-size: 18px; font-weight: bold;"></p>
                <div id="quiz-opcoes-container"></div>
            </div>
            <div id="bloco-resultado-quiz" class="no-display">
                <p id="quiz-resultado-texto"></p>
                <button onclick="iniciarNovoQuiz10()">Reiniciar Varredura</button>
            </div>
        </div>

        <hr style="border: 0; border-top: 1px solid #1f1f38; margin: 20px 0;">

        <h3>🗳️ Registro de Alinhamento Galáctico</h3>
        <p>Declare o seu apoio a um dos lados da galáxia:</p>
        <div class="container-votos">
            <div class="card-voto">
                <h4>Ordem Jedi</h4>
                <p id="votos-jedi">Registros: 0</p>
                <button onclick="votarFaccao('jedi')">Apoiar</button>
            </div>
            <div class="card-voto">
                <h4>Império</h4>
                <p id="votos-vader">Registros: 0</p>
                <button onclick="votarFaccao('vader')">Apoiar</button>
            </div>
            <div class="card-voto">
                <h4>Mandalorianos</h4>
                <p id="votos-mando">Registros: 0</p>
                <button onclick="votarFaccao('mando')">Apoiar</button>
            </div>
        </div>
        <div id="alerta-voto" class="alerta-sistema"></div>
    </div>

    <div id="tela-animacao">
        <div class="caixa-holograma">
            <h3 style="color: #00f2ff; margin-top:0;">📡 TRANSMISSÃO HOLOGRÁFICA INCOMING...</h3>
            <p id="texto-animacao" style="font-size: 18px; line-height: 1.5; color: #a5f3fc;"></p>
            <button onclick="fecharAnimacao()">Fechar Canal</button>
        </div>
    </div>

    <script>
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

        // === JOGO 1: ENGINE DO FLAPPY SHIP ===
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
            
            // Atributos de dimensionamento da nave condizentes com a renderização
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

            // Mata o jogador se ele bater no teto ou no chão e para o loop imediatamente
            if (nave.y + nave.altura > canvas.height || nave.y < 0) {
                derrubarNave();
                return; 
            }

            // ==========================================
            // RENDERIZADOR PIXEL-ART DA NAVE ESPACIAL
            // ==========================================
            ctx.save();
            ctx.translate(nave.x, nave.y);
            
            // Efeito dinâmico de rotação baseado na aceleração/queda
            let angulo = Math.min(Math.max(nave.velocidade * 0.05, -0.3), 0.5);
            ctx.rotate(angulo);

            // Chassi Base da Nave (Gris / Prata Mandalorian)
            ctx.fillStyle = '#8e9bb0';
            ctx.fillRect(0, 4, 24, 12);
            ctx.fillStyle = '#b3c2d4';
            ctx.fillRect(4, 6, 16, 8);

            // Vidro Frontal da Cabine (Azul Elétrico Neon)
            ctx.fillStyle = '#00f2ff';
            ctx.fillRect(16, 6, 6, 4);

            // Estrutura das Estabilizadoras (Asas Superiores e Inferiores)
            ctx.fillStyle = '#5a677d';
            ctx.fillRect(4, 0, 6, 4);   // Asa Superior
            ctx.fillRect(4, 16, 6, 4);  // Asa Inferior

            // Propulsor de Fogo Traseiro Animado alternando frames
            if (frame % 2 === 0) {
                ctx.fillStyle = '#ff5500';
                ctx.fillRect(-8, 7, 8, 6);
                ctx.fillStyle = '#ffcc00';
                ctx.fillRect(-5, 9, 5, 2);
            } else {
                ctx.fillStyle = '#ffaa00';
                ctx.fillRect(-6, 7, 6, 6);
                ctx.fillStyle = '#ffff00';
                ctx.fillRect(-3, 9, 3, 2);
            }

            ctx.restore();
            // ==========================================

            // Geração de obstáculos (paredras espaciais)
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
                obs.x -= 3.5; // Velocidade de rolagem lateral

                ctx.fillStyle = '#ff0055';
                // Obstáculo Superior
                ctx.fillRect(obs.x, 0, obs.largura, obs.topo);
                // Obstáculo Inferior
                ctx.fillRect(obs.x, canvas.height - obs.base, obs.largura, obs.base);

                // Caixa de colisão precisa e fatal
                if (nave.x < obs.x + obs.largura && 
                    nave.x + nave.largura > obs.x &&
                    (nave.y < obs.topo || nave.y + nave.altura > canvas.height - obs.base)) {
                    derrubarNave();
                    return; 
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
                txt.innerText = '"Que a Força esteja com você. O conhecimento deve ser compartilhado, nunca guardado." — Mestre Yoda';
            } else if (lado === 'vader') {
                txt.innerText = '"Você não conhece o real poder do Lado Sombrio. Junte-se a nós ou enfrente a destruição." — Darth Vader';
            } else if (lado === 'mando') {
                txt.innerText = '"Armaduras protegem o corpo, mas a honra protege o clã. Este é o Caminho." — Din Djarin';
            }
            overlay.style.display = 'flex';
        }

        function fecharAnimacao() { 
            document.getElementById('tela-animacao').style.display = 'none'; 
        }
    </script>
</body>
</html>
