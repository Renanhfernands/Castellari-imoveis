const API_URL = "http://localhost:3000";

export async function buscarImoveis() {
  const resposta = await fetch(`${API_URL}/imoveis`);

  if (!resposta.ok) {
    throw new Error("Não foi possível buscar os imóveis.");
  }

  return resposta.json();
}

export async function buscarImovel(id) {
  const resposta = await fetch(`${API_URL}/imoveis/${id}`);

  if (!resposta.ok) {
    throw new Error("Não foi possível buscar o imóvel.");
  }

  return resposta.json();
}