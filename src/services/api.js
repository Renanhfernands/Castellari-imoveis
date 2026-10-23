const API_URL = "https://castellari-imoveis.onrender.com";

// ==========================================
// LISTAR IMÓVEIS
// ==========================================

export async function buscarImoveis() {
  const resposta = await fetch(`${API_URL}/imoveis`);

  if (!resposta.ok) {
    throw new Error("Não foi possível buscar os imóveis.");
  }

  return resposta.json();
}

// ==========================================
// BUSCAR UM IMÓVEL
// ==========================================

export async function buscarImovel(id) {
  const resposta = await fetch(`${API_URL}/imoveis/${id}`);

  if (!resposta.ok) {
    throw new Error("Não foi possível buscar o imóvel.");
  }

  return resposta.json();
}