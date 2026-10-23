const form = document.getElementById('cep-form');
const cepInput = document.getElementById('cep');
const buscarBtn = document.getElementById('buscar-btn');
const resultado = document.getElementById('resultado');

cepInput.addEventListener('input', () => {
  const numeros = cepInput.value.replace(/\D/g, '').slice(0, 8);
  cepInput.value = numeros.length > 5
    ? `${numeros.slice(0, 5)}-${numeros.slice(5)}`
    : numeros;
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const cep = cepInput.value.replace(/\D/g, '');

  if (cep.length !== 8) {
    mostrarMensagem('Digite um CEP válido com 8 números.', 'error');
    limparCampos();
    cepInput.focus();
    return;
  }

  buscarBtn.disabled = true;
  buscarBtn.innerHTML = '<span>Buscando...</span>';
  mostrarMensagem('Consultando o CEP...', '');
  limparCampos();

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) throw new Error('Não foi possível consultar o serviço.');

    const data = await response.json();
    if (data.erro) {
      mostrarMensagem('CEP não encontrado. Confira os números e tente novamente.', 'error');
      return;
    }

    document.getElementById('logradouro').value = data.logradouro || 'Não informado';
    document.getElementById('bairro').value = data.bairro || 'Não informado';
    document.getElementById('cidade').value = data.localidade || 'Não informado';
    document.getElementById('estado').value = data.uf || '—';
    mostrarMensagem('Endereço encontrado com sucesso.', 'success');
  } catch (error) {
    mostrarMensagem('Não foi possível buscar agora. Verifique sua conexão e tente novamente.', 'error');
    console.error('Erro ao consultar CEP:', error);
  } finally {
    buscarBtn.disabled = false;
    buscarBtn.innerHTML = '<span>Buscar</span><span aria-hidden="true">→</span>';
  }
});

function mostrarMensagem(texto, tipo) {
  resultado.textContent = texto;
  resultado.className = `message ${tipo}`.trim();
}

function limparCampos() {
  ['logradouro', 'bairro', 'cidade', 'estado'].forEach((id) => {
    document.getElementById(id).value = '';
  });
}
