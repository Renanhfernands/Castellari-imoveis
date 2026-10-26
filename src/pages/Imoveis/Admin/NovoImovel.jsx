import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NovoImovel.css";

const API_URL = "https://castellari-imoveis.onrender.com";

export default function NovoImovel() {
  const navigate = useNavigate();

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

  // =========================
  // IMAGENS
  // =========================

  const [imagemCapa, setImagemCapa] = useState(null);
  const [previewCapa, setPreviewCapa] = useState("");

  const [imagensCarrossel, setImagensCarrossel] = useState([]);
  const [previewsCarrossel, setPreviewsCarrossel] = useState([]);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // =========================
  // CAMPOS DO FORMULÁRIO
  // =========================

  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  // =========================
  // FOTO DE CAPA
  // =========================

  function handleImagemCapaChange(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      setImagemCapa(null);
      setPreviewCapa("");
      return;
    }

    setErro("");
    setImagemCapa(arquivo);

    const preview = URL.createObjectURL(arquivo);
    setPreviewCapa(preview);
  }

  // =========================
  // FOTOS DO CARROSSEL
  // =========================

  function handleImagensCarrosselChange(event) {
    const arquivos = Array.from(event.target.files || []);

    if (arquivos.length > 20) {
      setErro("Você pode selecionar no máximo 20 imagens para o carrossel.");
      event.target.value = "";
      setImagensCarrossel([]);
      setPreviewsCarrossel([]);
      return;
    }

    setErro("");
    setImagensCarrossel(arquivos);

    const novosPreviews = arquivos.map((arquivo) =>
      URL.createObjectURL(arquivo)
    );

    setPreviewsCarrossel(novosPreviews);
  }

  // =========================
  // LIMPEZA DOS PREVIEWS
  // =========================

  useEffect(() => {
    return () => {
      if (previewCapa) {
        URL.revokeObjectURL(previewCapa);
      }
    };
  }, [previewCapa]);

  useEffect(() => {
    return () => {
      previewsCarrossel.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previewsCarrossel]);

  // =========================
  // ENVIO
  // =========================

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSalvando(true);
      setErro("");

      // =========================
      // VALIDAÇÕES
      // =========================

      if (!imagemCapa) {
        throw new Error("Selecione uma foto de capa para o imóvel.");
      }

      // =========================
      // 1. CADASTRA O IMÓVEL
      // =========================

      const resposta = await fetch(`${API_URL}/imoveis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: formulario.tipo,
          titulo: formulario.titulo,
          localizacao: formulario.localizacao,
          preco: Number(formulario.preco),

          quartos: formulario.quartos
            ? Number(formulario.quartos)
            : null,

          suites: formulario.suites
            ? Number(formulario.suites)
            : null,

          sala: formulario.sala
            ? Number(formulario.sala)
            : null,

          banheiros: formulario.banheiros
            ? Number(formulario.banheiros)
            : null,

          vagas: formulario.vagas
            ? Number(formulario.vagas)
            : null,

          area: formulario.area
            ? Number(formulario.area)
            : null,

          descricao: formulario.descricao || null,
          video: formulario.video || null,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível cadastrar o imóvel."
        );
      }

      const idImovel = dados.id;

      // =========================
      // 2. ENVIA FOTO DE CAPA
      // =========================

      if (imagemCapa) {
        const formDataCapa = new FormData();

        formDataCapa.append("imagemCapa", imagemCapa);

        const respostaCapa = await fetch(
          `${API_URL}/imoveis/${idImovel}/imagem-capa`,
          {
            method: "POST",
            body: formDataCapa,
          }
        );

        const dadosCapa = await respostaCapa.json();

        if (!respostaCapa.ok) {
          throw new Error(
            dadosCapa.erro ||
              "O imóvel foi cadastrado, mas não foi possível enviar a foto de capa."
          );
        }
      }

      // =========================
      // 3. ENVIA IMAGENS DO CARROSSEL
      // =========================

      if (imagensCarrossel.length > 0) {
        const formDataCarrossel = new FormData();

        imagensCarrossel.forEach((imagem) => {
          formDataCarrossel.append("imagens", imagem);
        });

        const respostaCarrossel = await fetch(
          `${API_URL}/imoveis/${idImovel}/imagens`,
          {
            method: "POST",
            body: formDataCarrossel,
          }
        );

        const dadosCarrossel = await respostaCarrossel.json();

        if (!respostaCarrossel.ok) {
          throw new Error(
            dadosCarrossel.erro ||
              "O imóvel foi cadastrado, mas não foi possível enviar as imagens do carrossel."
          );
        }
      }

      alert("Imóvel cadastrado com sucesso!");

      navigate("/admin");
    } catch (error) {
      console.error("Erro ao cadastrar imóvel:", error);
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  // =========================
  // RENDER
  // =========================

  return (
    <main className="novo-imovel">
      <div className="novo-imovel-container">

        <div className="novo-imovel-header">
          <span className="admin-label">
            ADMINISTRAÇÃO
          </span>

          <h1>Novo imóvel</h1>

          <p>
            Preencha as informações do imóvel para cadastrá-lo.
          </p>
        </div>

        <form
          className="novo-imovel-form"
          onSubmit={handleSubmit}
        >

          {/* =========================
              INFORMAÇÕES BÁSICAS
          ========================= */}

          <section className="form-section">
            <h2>Informações básicas</h2>

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="tipo">
                  Tipo *
                </label>

                <select
                  id="tipo"
                  name="tipo"
                  value={formulario.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Selecione
                  </option>

                  <option value="Apartamento">
                    Apartamento
                  </option>

                  <option value="Casa">
                    Casa
                  </option>

                  <option value="Terreno">
                    Terreno
                  </option>

                  <option value="Comercial">
                    Comercial
                  </option>

                  <option value="Sobrado">
                    Sobrado
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="preco">
                  Preço *
                </label>

                <input
                  id="preco"
                  name="preco"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formulario.preco}
                  onChange={handleChange}
                  placeholder="Ex: 46000"
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="titulo">
                  Título *
                </label>

                <input
                  id="titulo"
                  name="titulo"
                  type="text"
                  value={formulario.titulo}
                  onChange={handleChange}
                  placeholder="Ex: Apartamento à venda em Francisco Morato"
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="localizacao">
                  Localização *
                </label>

                <input
                  id="localizacao"
                  name="localizacao"
                  type="text"
                  value={formulario.localizacao}
                  onChange={handleChange}
                  placeholder="Ex: São Paulo - Francisco Morato"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="area">
                  Área (m²)
                </label>

                <input
                  id="area"
                  name="area"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formulario.area}
                  onChange={handleChange}
                  placeholder="Ex: 80"
                />
              </div>

            </div>
          </section>

          {/* =========================
              CARACTERÍSTICAS
          ========================= */}

          <section className="form-section">
            <h2>Características</h2>

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="quartos">
                  Quartos
                </label>

                <input
                  id="quartos"
                  name="quartos"
                  type="number"
                  min="0"
                  value={formulario.quartos}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="suites">
                  Suítes
                </label>

                <input
                  id="suites"
                  name="suites"
                  type="number"
                  min="0"
                  value={formulario.suites}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sala">
                  Salas
                </label>

                <input
                  id="sala"
                  name="sala"
                  type="number"
                  min="0"
                  value={formulario.sala}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="banheiros">
                  Banheiros
                </label>

                <input
                  id="banheiros"
                  name="banheiros"
                  type="number"
                  min="0"
                  value={formulario.banheiros}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="vagas">
                  Vagas
                </label>

                <input
                  id="vagas"
                  name="vagas"
                  type="number"
                  min="0"
                  value={formulario.vagas}
                  onChange={handleChange}
                />
              </div>

            </div>
          </section>

          {/* =========================
              IMAGENS
          ========================= */}

          <section className="form-section">
            <h2>Imagens do imóvel</h2>

            {/* FOTO DE CAPA */}

            <div className="form-group">
              <label htmlFor="imagemCapa">
                Foto de Capa
              </label>

              <input
                id="imagemCapa"
                type="file"
                accept="image/*"
                onChange={handleImagemCapaChange}
              />

              <p>
                Selecione uma única imagem para ser usada como
                capa do imóvel no card.
              </p>

              {previewCapa && (
                <div className="imagens-preview">
                  <div className="imagem-preview-item">
                    <img
                      src={previewCapa}
                      alt="Prévia da capa"
                    />

                    <span>
                      Capa do Card
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* CARROSSEL */}

            <div className="form-group">
              <label htmlFor="imagensCarrossel">
                Fotos do imóvel
              </label>

              <input
                id="imagensCarrossel"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagensCarrosselChange}
              />

              <p>
                Selecione até 20 imagens para o carrossel
                da página do imóvel.
              </p>
            </div>

            {previewsCarrossel.length > 0 && (
              <div className="imagens-preview">

                {previewsCarrossel.map((preview, index) => (
                  <div
                    className="imagem-preview-item"
                    key={`${preview}-${index}`}
                  >
                    <img
                      src={preview}
                      alt={`Prévia do carrossel ${index + 1}`}
                    />

                    <span>
                      Carrossel {index + 1}
                    </span>
                  </div>
                ))}

              </div>
            )}

          </section>

          {/* =========================
              DESCRIÇÃO E VÍDEO
          ========================= */}

          <section className="form-section">
            <h2>Descrição e vídeo</h2>

            <div className="form-group">
              <label htmlFor="descricao">
                Descrição
              </label>

              <textarea
                id="descricao"
                name="descricao"
                rows="10"
                value={formulario.descricao}
                onChange={handleChange}
                placeholder="Digite a descrição do imóvel..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="video">
                Link do vídeo
              </label>

              <input
                id="video"
                name="video"
                type="url"
                value={formulario.video}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </section>

          {/* =========================
              ERRO
          ========================= */}

          {erro && (
            <div className="form-erro">
              {erro}
            </div>
          )}

          {/* =========================
              AÇÕES
          ========================= */}

          <div className="form-actions">

            <button
              type="button"
              className="button-cancelar"
              onClick={() => navigate("/admin")}
              disabled={salvando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="button-salvar"
              disabled={salvando}
            >
              {salvando
                ? "Cadastrando..."
                : "Cadastrar imóvel"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}