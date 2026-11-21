// Aguarda o HTML carregar completamente antes de rodar os scripts
document.addEventListener('DOMContentLoaded', () => {
  const btnFalar = document.getElementById('btnFalar');
  if (btnFalar) {
    btnFalar.addEventListener('click', falarDoInput);
  }

  // Escuta o clique no botão de limpar
  const btnLimpar = document.getElementById('btnLimpar');
  if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
      document.getElementById('texto').value = '';
    });
  }
});

function emitirSom(textoParaFalar) {
  if (!textoParaFalar.trim()) return;
  window.speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(textoParaFalar);
  fala.lang = 'pt-BR';
  window.speechSynthesis.speak(fala);
}

function falarDoInput() {
  const texto = document.getElementById('texto').value;
  emitirSom(texto);
}

function carregarArquivosDaPasta(event, nomeCategoria) {
  const arquivos = Array.from(event.target.files);
  const galeriaItens = document.getElementById('galeriaItens');
  
  // Limpa a caixa de texto ao selecionar uma nova pasta/categoria no topo
  document.getElementById('texto').value = '';

  // Destaca visualmente qual categoria está ativa no topo
  document.querySelectorAll('.categoria-item').forEach(el => el.classList.remove('ativa'));
  document.getElementById(`label-${nomeCategoria}`).classList.add('ativa');

  galeriaItens.innerHTML = '';

  // Filtra apenas arquivos .jpg ou .jpeg
  const imagensJpg = arquivos.filter(arquivo => 
    /\.(jpe?g)$/i.test(arquivo.name)
  );

  if (imagensJpg.length === 0) {
    galeriaItens.innerHTML = `<span class="aviso-galeria">Nenhuma imagem .jpg encontrada dentro da pasta selecionada.</span>`;
    return;
  }

  // Cria e insere as miniaturas no rodapé
  imagensJpg.forEach(arquivo => {
    const url = URL.createObjectURL(arquivo);
    const img = document.createElement('img');
    img.src = url;
    img.title = arquivo.name;

    img.onclick = (e) => {
      e.stopPropagation(); // Impede bugs de cliques indesejados no label pai

      document.querySelectorAll('.galeria-rodape img').forEach(el => el.classList.remove('ativa'));
      img.classList.add('ativa');

      // Atualiza o quadro de visualização
      const visualizador = document.getElementById('visualizador');
      visualizador.innerHTML = `<img src="${url}" alt="${arquivo.name}">`;

      // Limpa a extensão .jpg do nome do arquivo
      const nomeSemExtensao = arquivo.name.replace(/\.[^/.]+$/, "");
      const incluirNomeAtivo = document.getElementById('chkIncluirNome').checked;
      const falarNomeAtivo = document.getElementById('chkFalarNome').checked;

      // CORREÇÃO AQUI: Se estiver ativo inclui o novo nome, caso contrário, limpa o texto antigo
      if (incluirNomeAtivo) {
        document.getElementById('texto').value = nomeSemExtensao;
      } else {
        document.getElementById('texto').value = '';
      }

      if (falarNomeAtivo) {
        emitirSom(nomeSemExtensao);
      }
    };

    galeriaItens.appendChild(img);
  });
}
