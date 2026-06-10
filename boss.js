const boss = document.getElementById("annihilusBoss");
const hpContainer = document.getElementById("hpContainer");
const hpBar = document.getElementById("hpBar");
const hpText = document.getElementById("hpText");

const VIDA_MAX = 1900;
const DANO = 90;

let vida = VIDA_MAX;
let lutaIniciada = false;
let morto = false;
let movimento;

// Salva o estado original completo do CSS (inclusive se tiver 'right' ou 'bottom')
const estiloOriginal = {
    position: boss.style.position || "",
    left: boss.style.left || "",
    top: boss.style.top || "",
    right: boss.style.right || "",
    bottom: boss.style.bottom || ""
};

function moverBoss() {
    if (morto) return;

    const margem = 100;

    // Calcula a posição aleatória baseada no tamanho real da tela do jogador
    const x = Math.random() * (window.innerWidth - boss.offsetWidth - margem);
    const y = Math.random() * (window.innerHeight - boss.offsetHeight - margem);

    boss.style.left = x + "px";
    boss.style.top = y + "px";
}

function iniciarLuta() {
    hpContainer.style.display = "block";

    // 1. DESANCORA DO CANTO IMEDIATAMENTE:
    // Muda para absolute e desativa 'right' ou 'bottom' que possam estar prendendo ele no CSS
    boss.style.position = "absolute"; 
    boss.style.right = "auto";
    boss.style.bottom = "auto";

    // 2. FAZ ELE FUGIR NO MESMO MILISSEGUNDO:
    // Executa a função de mover na hora, sem esperar os 1.5 segundos do setInterval
    moverBoss(); 

    // 3. Mantém ele fugindo pelos cantos a cada 1.5 segundos
    movimento = setInterval(() => {
        moverBoss();
    }, 1500);
}

boss.addEventListener("click", () => {
    // Se já morreu, ignora cliques extras
    if (morto) return;

    // Se for o primeiro clique, ativa a fuga instantânea
    if (!lutaIniciada) {
        lutaIniciada = true;
        iniciarLuta();
    }

    // Sistema de dano
    vida -= DANO;
    if (vida < 0) vida = 0;

    hpBar.style.width = (vida / VIDA_MAX) * 100 + "%";
    hpText.textContent = `Annihilus - ${vida} / ${VIDA_MAX}`;

    // Quando o boss morre
    if (vida <= 0) {
        morto = true;
        clearInterval(movimento); // Para o motor de fuga
        
        hpText.textContent = "ANNIHILUS DERROTADO";

        // 4. VOLTA PRO CANTO ORIGINAL: Restaura exatamente os padrões do seu arquivo CSS
        boss.style.position = estiloOriginal.position;
        boss.style.left = estiloOriginal.left;
        boss.style.top = estiloOriginal.top;
        boss.style.right = estiloOriginal.right;
        boss.style.bottom = estiloOriginal.bottom;
    }
});