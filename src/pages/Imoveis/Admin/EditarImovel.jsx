import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./NovoImovel.css";
import { buscarImovel } from "../../../services/api";

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

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSalvando(true);
      setErro("");

      const resposta = await fetch(
  `https://castellari-imoveis.onrender.com/imoveis/${id}`,
        {
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
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível atualizar o imóvel."
        );
      }

      alert("Imóvel atualizado com sucesso!");

      navigate("/admin");
    } catch (error) {
      console.error("Erro ao editar imóvel:", error);

      setErro(
        error.message || "Não foi possível atualizar o imóvel."
      );
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
            <span className="admin-label">
              ADMINISTRAÇÃO
            </span>

            <h1>Editar imóvel</h1>

            <p>
              Atualize as informações do imóvel cadastrado.
            </p>
          </div>

          <Link
            to="/admin"
            className="admin-button"
          >
            ← Voltar
          </Link>
        </div>

        {erro && (
          <div className="novo-imovel-erro">
            {erro}
          </div>
        )}

        <form
          className="novo-imovel-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label htmlFor="tipo">
              Tipo do imóvel
            </label>

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
            <label htmlFor="titulo">
              Título
            </label>

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
            <label htmlFor="localizacao">
              Localização
            </label>

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
              <label htmlFor="preco">
                Preço
              </label>

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
              <label htmlFor="area">
                Área (m²)
              </label>

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
              <label htmlFor="quartos">
                Quartos
              </label>

              <input
                id="quartos"
                name="quartos"
                type="number"
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
                value={formulario.suites}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sala">
                Sala
              </label>

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
              <label htmlFor="banheiros">
                Banheiros
              </label>

              <input
                id="banheiros"
                name="banheiros"
                type="number"
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
                value={formulario.vagas}
                onChange={handleChange}
              />
            </div>

          </div>

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
            />
          </div>

          <div className="form-group">
            <label htmlFor="video">
              Vídeo
            </label>

            <input
              id="video"
              name="video"
              type="text"
              value={formulario.video}
              onChange={handleChange}
            />
          </div>

          <div className="novo-imovel-acoes">

            <Link
              to="/admin"
              className="admin-button"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="admin-button"
              disabled={salvando}
            >
              {salvando
                ? "Salvando..."
                : "Salvar alterações"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}