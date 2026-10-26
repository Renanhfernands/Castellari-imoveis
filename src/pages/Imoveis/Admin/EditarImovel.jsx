import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./NovoImovel.css";
import { buscarImovel } from "../../../services/api";

const API_URL = "https://castellari-imoveis.onrender.com";

export default function EditarImovel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [formulario, setFormulario] = useState({
    tipo: "",
    titulo: "",
    localizacao: "",
    preco: "",
    quartos: "",
    suites: "",
    sala: "",
    banheiros: "",
    vagas: "",
    area: "",
    descricao: "",
    video: "",
  });

  const [capaAtual, setCapaAtual] = useState("");
  const [novaCapa, setNovaCapa] = useState(null);
  const [imagens, setImagens] = useState([]);
  const [novasImagens, setNovasImagens] = useState([]);

  useEffect(() => {
    async function carregarImovel() {
      try {
        setCarregando(true);
        setErro("");

        const imovel = await buscarImovel(id);

        setFormulario({
          tipo: imovel.tipo ?? "",
          titulo: imovel.titulo ?? "",
          localizacao: imovel.localizacao ?? "",
          preco: imovel.preco ?? "",
          quartos: imovel.quartos ?? "",
          suites: imovel.suites ?? "",
          sala: imovel.sala ?? "",
          banheiros: imovel.banheiros ?? "",
          vagas: imovel.vagas ?? "",
          area: imovel.area ?? "",
          descricao: imovel.descricao ?? "",
          video: imovel.video ?? "",
        });

        setCapaAtual(imovel.imagem_capa ?? "");
        setImagens(Array.isArray(imovel.imagens) ? imovel.imagens : []);
      } catch (error) {
        console.error("Erro ao carregar imóvel:", error);
        setErro("Não foi possível carregar o imóvel.");
      } finally {
        setCarregando(false);
      }
    }

    carregarImovel();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function montarUrlImagem(url) {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
  }

  function handleNovaCapa(event) {
    const arquivo = event.target.files?.[0];

    if (arquivo) {
      setNovaCapa(arquivo);
    }
  }

  function handleNovasImagens(event) {
    const arquivos = Array.from(event.target.files || []);

    if (!arquivos.length) return;

    if (imagens.length + novasImagens.length + arquivos.length > 20) {
      setErro("O imóvel pode ter no máximo 20 imagens no carrossel.");
      return;
    }

    setErro("");
    setNovasImagens((anteriores) => [...anteriores, ...arquivos]);
    event.target.value = "";
  }

  function removerNovaImagem(index) {
    setNovasImagens((anteriores) =>
      anteriores.filter((_, indice) => indice !== index)
    );
  }

  async function removerCapa() {
    if (!window.confirm("Tem certeza que deseja remover a imagem de capa?")) {
      return;
    }

    try {
      setSalvando(true);
      setErro("");

      const resposta = await fetch(`${API_URL}/imoveis/${id}/imagem-capa`, {
        method: "DELETE",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível remover a capa.");
      }

      setCapaAtual("");
      alert("Imagem de capa removida com sucesso.");
    } catch (error) {
      console.error("Erro ao remover capa:", error);
      setErro(error.message || "Não foi possível remover a capa.");
    } finally {
      setSalvando(false);
    }
  }

  async function removerImagem(imagemId) {
    if (!window.confirm("Tem certeza que deseja remover esta imagem?")) {
      return;
    }

    try {
      setSalvando(true);
      setErro("");

      const resposta = await fetch(
        `${API_URL}/imoveis/${id}/imagens/${imagemId}`,
        {
          method: "DELETE",
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível remover a imagem.");
      }

      setImagens((anteriores) =>
        anteriores.filter((imagem) => imagem.id !== imagemId)
      );
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      setErro(error.message || "Não foi possível remover a imagem.");
    } finally {
      setSalvando(false);
    }
  }

  async function enviarCapa() {
    if (!novaCapa) return;

    const formData = new FormData();
    formData.append("imagemCapa", novaCapa);

    const resposta = await fetch(`${API_URL}/imoveis/${id}/imagem-capa`, {
      method: "POST",
      body: formData,
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        dados.erro || "Não foi possível atualizar a imagem de capa."
      );
    }

    setCapaAtual(dados.url);
    setNovaCapa(null);
  }

  async function enviarNovasImagens() {
    if (!novasImagens.length) return;

    const formData = new FormData();

    novasImagens.forEach((imagem) => {
      formData.append("imagens", imagem);
    });

    const resposta = await fetch(`${API_URL}/imoveis/${id}/imagens`, {
      method: "POST",
      body: formData,
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        dados.erro || "Não foi possível adicionar as imagens."
      );
    }

    const imovelAtualizado = await buscarImovel(id);

    setImagens(
      Array.isArray(imovelAtualizado.imagens)
        ? imovelAtualizado.imagens
        : []
    );

    setNovasImagens([]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSalvando(true);
      setErro("");

      const resposta = await fetch(`${API_URL}/imoveis/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: formulario.tipo,
          titulo: formulario.titulo,
          localizacao: formulario.localizacao,
          preco: formulario.preco,
          quartos: formulario.quartos || null,
          suites: formulario.suites || null,
          sala: formulario.sala || null,
          banheiros: formulario.banheiros || null,
          vagas: formulario.vagas || null,
          area: formulario.area || null,
          descricao: formulario.descricao || null,
          video: formulario.video || null,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível atualizar o imóvel."
        );
      }

      if (novaCapa) {
        await enviarCapa();
      }

      if (novasImagens.length > 0) {
        await enviarNovasImagens();
      }

      alert("Imóvel atualizado com sucesso!");
      navigate("/admin");
    } catch (error) {
      console.error("Erro ao editar imóvel:", error);
      setErro(error.message || "Não foi possível atualizar o imóvel.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirImovel() {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este imóvel?\n\n" +
        "O imóvel e todas as suas imagens serão removidos.\n\n" +
        "Essa ação não poderá ser desfeita."
    );

    if (!confirmar) return;

    try {
      setSalvando(true);
      setErro("");

      const resposta = await fetch(`${API_URL}/imoveis/${id}`, {
        method: "DELETE",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível excluir o imóvel.");
      }

      alert("Imóvel excluído com sucesso!");
      navigate("/admin");
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      setErro(error.message || "Não foi possível excluir o imóvel.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main className="novo-imovel">
        <div className="novo-imovel-container">
          <p>Carregando imóvel...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="novo-imovel">
      <div className="novo-imovel-container">
        <div className="novo-imovel-header">
          <div>
            <span className="admin-label">ADMINISTRAÇÃO</span>
            <h1>Editar imóvel</h1>
            <p>Atualize as informações do imóvel cadastrado.</p>
          </div>

          <Link to="/admin" className="admin-button">
            ← Voltar
          </Link>
        </div>

        {erro && <div className="novo-imovel-erro">{erro}</div>}

        <form className="novo-imovel-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tipo">Tipo do imóvel</label>
            <input
              id="tipo"
              name="tipo"
              type="text"
              value={formulario.tipo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              value={formulario.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="localizacao">Localização</label>
            <input
              id="localizacao"
              name="localizacao"
              type="text"
              value={formulario.localizacao}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="preco">Preço</label>
              <input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                value={formulario.preco}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="area">Área (m²)</label>
              <input
                id="area"
                name="area"
                type="number"
                step="0.01"
                value={formulario.area}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quartos">Quartos</label>
              <input
                id="quartos"
                name="quartos"
                type="number"
                value={formulario.quartos}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="suites">Suítes</label>
              <input
                id="suites"
                name="suites"
                type="number"
                value={formulario.suites}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sala">Sala</label>
              <input
                id="sala"
                name="sala"
                type="number"
                value={formulario.sala}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="banheiros">Banheiros</label>
              <input
                id="banheiros"
                name="banheiros"
                type="number"
                value={formulario.banheiros}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="vagas">Vagas</label>
              <input
                id="vagas"
                name="vagas"
                type="number"
                value={formulario.vagas}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              rows="10"
              value={formulario.descricao}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="video">Vídeo</label>
            <input
              id="video"
              name="video"
              type="text"
              value={formulario.video}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Imagem de capa</label>

            {capaAtual && (
              <div>
                <img
                  src={montarUrlImagem(capaAtual)}
                  alt="Imagem de capa atual"
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    display: "block",
                    marginBottom: "10px",
                  }}
                />

                <button
                  type="button"
                  className="admin-button"
                  onClick={removerCapa}
                  disabled={salvando}
                >
                  Remover capa
                </button>
              </div>
            )}

            <input
              id="novaCapa"
              type="file"
              accept="image/*"
              onChange={handleNovaCapa}
              disabled={salvando}
            />

            {novaCapa && <p>Nova capa: {novaCapa.name}</p>}
          </div>

          <div className="form-group">
            <label>Fotos do carrossel</label>

            {imagens.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "15px",
                  marginBottom: "20px",
                }}
              >
                {imagens.map((imagem, index) => (
                  <div
                    key={imagem.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "8px",
                    }}
                  >
                    <img
                      src={montarUrlImagem(imagem.url)}
                      alt={`Foto ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />

                    <button
                      type="button"
                      className="admin-button"
                      style={{
                        width: "100%",
                        marginTop: "8px",
                      }}
                      onClick={() => removerImagem(imagem.id)}
                      disabled={salvando}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              id="novasImagens"
              type="file"
              accept="image/*"
              multiple
              onChange={handleNovasImagens}
              disabled={
                salvando ||
                imagens.length + novasImagens.length >= 20
              }
            />

            <small>
              {imagens.length + novasImagens.length}/20 imagens
            </small>

            {novasImagens.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                <p>Novas imagens selecionadas:</p>

                {novasImagens.map((imagem, index) => (
                  <div
                    key={`${imagem.name}-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      padding: "8px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <span>{imagem.name}</span>

                    <button
                      type="button"
                      className="admin-button"
                      onClick={() => removerNovaImagem(index)}
                      disabled={salvando}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="novo-imovel-acoes">
            <Link to="/admin" className="admin-button">
              Cancelar
            </Link>

            <button
              type="submit"
              className="admin-button"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>

        <div
          style={{
            marginTop: "40px",
            paddingTop: "30px",
            borderTop: "1px solid #ddd",
          }}
        >
          <h2>Zona de perigo</h2>

          <p>
            Excluir este imóvel removerá também suas imagens.
            Essa ação não poderá ser desfeita.
          </p>

          <button
            type="button"
            className="admin-button"
            onClick={excluirImovel}
            disabled={salvando}
          >
            Excluir imóvel
          </button>
        </div>
      </div>
    </main>
  );
}