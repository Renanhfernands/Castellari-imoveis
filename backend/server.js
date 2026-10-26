const express = require("express");
const cors = require("cors");
const db = require("./db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// CONFIGURAÇÃO DE UPLOAD DE IMAGENS
// ==========================================

const pastaUploads = path.join(__dirname, "uploads");

if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(pastaUploads);
}

app.use("/uploads", express.static(pastaUploads));

console.log("📁 PASTA UPLOADS:", pastaUploads);
console.log(
  "🖼️ ARQUIVOS:",
  fs.readdirSync(pastaUploads).slice(0, 10)
);

// ==========================================
// CONFIGURAÇÃO DO MULTER
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaUploads);
  },

  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname);

    const nome =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extensao;

    cb(null, nome);
  },
});

const upload = multer({
  storage,
});

// ==========================================
// TESTE DA API
// ==========================================

app.get("/", (req, res) => {
  res.json({
    mensagem: "API Castellari Imóveis funcionando!",
  });
});

// ==========================================
// TESTE DO BANCO
// ==========================================

app.get("/teste-banco", async (req, res) => {
  try {
    const [resultado] = await db.query(
      "SELECT DATABASE() AS banco"
    );

    console.log("🗄️ BANCO CONECTADO:", resultado);

    res.json(resultado);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Não foi possível conectar ao banco.",
    });
  }
});

// ==========================================
// LISTAR IMÓVEIS
// ==========================================

app.get("/imoveis", async (req, res) => {
  try {
    const [imoveis] = await db.query(
      "SELECT * FROM imoveis ORDER BY id DESC"
    );

    for (const imovel of imoveis) {
      const [imagens] = await db.query(
        `SELECT id, url, ordem
         FROM imovel_imagens
         WHERE imovel_id = ?
         ORDER BY ordem ASC`,
        [imovel.id]
      );

      imovel.imagens = imagens;
    }

    res.json(imoveis);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Não foi possível buscar os imóveis.",
    });
  }
});

// ==========================================
// BUSCAR UM IMÓVEL
// ==========================================

app.get("/imoveis/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [imoveis] = await db.query(
      "SELECT * FROM imoveis WHERE id = ?",
      [id]
    );

    if (imoveis.length === 0) {
      return res.status(404).json({
        erro: "Imóvel não encontrado.",
      });
    }

    const [imagens] = await db.query(
      `SELECT id, url, ordem
       FROM imovel_imagens
       WHERE imovel_id = ?
       ORDER BY ordem ASC`,
      [id]
    );

    res.json({
      ...imoveis[0],
      imagens,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Não foi possível buscar o imóvel.",
    });
  }
});

// ==========================================
// EXCLUIR IMÓVEL
// ==========================================

app.delete("/imoveis/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Busca a capa antes de excluir o imóvel
    const [imovel] = await db.query(
      "SELECT imagem_capa FROM imoveis WHERE id = ?",
      [id]
    );

    if (imovel.length === 0) {
      return res.status(404).json({
        erro: "Imóvel não encontrado.",
      });
    }

    // Busca imagens do carrossel
    const [imagens] = await db.query(
      `SELECT url
       FROM imovel_imagens
       WHERE imovel_id = ?`,
      [id]
    );

    // Exclui o imóvel
    const [resultado] = await db.query(
      "DELETE FROM imoveis WHERE id = ?",
      [id]
    );

    // Tenta apagar a imagem de capa do servidor
    if (imovel[0].imagem_capa) {
      const caminhoCapa = path.join(
        __dirname,
        imovel[0].imagem_capa
      );

      if (fs.existsSync(caminhoCapa)) {
        fs.unlinkSync(caminhoCapa);
      }
    }

    // Tenta apagar as imagens do carrossel
    for (const imagem of imagens) {
      if (imagem.url) {
        const caminhoImagem = path.join(
          __dirname,
          imagem.url
        );

        if (fs.existsSync(caminhoImagem)) {
          fs.unlinkSync(caminhoImagem);
        }
      }
    }

    res.json({
      mensagem: "Imóvel excluído com sucesso.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Não foi possível excluir o imóvel.",
    });
  }
});

// ==========================================
// EDITAR IMÓVEL
// ==========================================

app.put("/imoveis/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      tipo,
      titulo,
      localizacao,
      preco,
      quartos,
      suites,
      sala,
      banheiros,
      vagas,
      area,
      descricao,
      video,
    } = req.body;

    if (
      !tipo ||
      !titulo ||
      !localizacao ||
      preco === undefined
    ) {
      return res.status(400).json({
        erro:
          "Tipo, título, localização e preço são obrigatórios.",
      });
    }

    const [resultado] = await db.query(
      `UPDATE imoveis
       SET
         tipo = ?,
         titulo = ?,
         localizacao = ?,
         preco = ?,
         quartos = ?,
         suites = ?,
         sala = ?,
         banheiros = ?,
         vagas = ?,
         area = ?,
         descricao = ?,
         video = ?
       WHERE id = ?`,
      [
        tipo,
        titulo,
        localizacao,
        preco,
        quartos ?? null,
        suites ?? null,
        sala ?? null,
        banheiros ?? null,
        vagas ?? null,
        area ?? null,
        descricao ?? null,
        video ?? null,
        id,
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        erro: "Imóvel não encontrado.",
      });
    }

    res.json({
      mensagem: "Imóvel atualizado com sucesso.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Não foi possível atualizar o imóvel.",
    });
  }
});

// ==========================================
// CADASTRAR IMÓVEL
// ==========================================

app.post("/imoveis", async (req, res) => {
  console.log("");
  console.log("==========================================");
  console.log("🔥 POST /imoveis RECEBIDO");
  console.log("==========================================");

  try {
    console.log("📦 DADOS RECEBIDOS:", req.body);

    const {
      tipo,
      titulo,
      localizacao,
      preco,
      quartos,
      suites,
      sala,
      banheiros,
      vagas,
      area,
      descricao,
      video,
    } = req.body;

    if (
      !tipo ||
      !titulo ||
      !localizacao ||
      preco === undefined
    ) {
      console.log("❌ VALIDAÇÃO FALHOU");

      return res.status(400).json({
        erro:
          "Tipo, título, localização e preço são obrigatórios.",
      });
    }

    console.log("✅ VALIDAÇÃO OK");
    console.log("💾 TENTANDO INSERIR NO BANCO...");

    const [resultado] = await db.query(
      `INSERT INTO imoveis
      (
        tipo,
        titulo,
        localizacao,
        preco,
        quartos,
        suites,
        sala,
        banheiros,
        vagas,
        area,
        descricao,
        video
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tipo,
        titulo,
        localizacao,
        preco,
        quartos ?? null,
        suites ?? null,
        sala ?? null,
        banheiros ?? null,
        vagas ?? null,
        area ?? null,
        descricao ?? null,
        video ?? null,
      ]
    );

    console.log("🔥 INSERT EXECUTADO");
    console.log("📊 RESULTADO:", resultado);
    console.log("🆔 ID GERADO:", resultado.insertId);

    // ==========================================
    // VERIFICAR QUAL BANCO ESTÁ SENDO USADO
    // ==========================================

    const [conexao] = await db.query(`
      SELECT
        DATABASE() AS banco,
        @@hostname AS host,
        @@port AS porta,
        USER() AS usuario
    `);

    console.log("🔎 CONEXÃO DO BACKEND:");
    console.log(conexao[0]);

    // ==========================================
    // VERIFICAR SE O IMÓVEL EXISTE APÓS O INSERT
    // ==========================================

    const [imovelCriado] = await db.query(
      "SELECT * FROM imoveis WHERE id = ?",
      [resultado.insertId]
    );

    console.log("🔎 IMÓVEL APÓS INSERT:");
    console.log(imovelCriado);

    // ==========================================
    // RESPOSTA
    // ==========================================

    res.status(201).json({
      mensagem: "Imóvel cadastrado com sucesso.",
      id: resultado.insertId,
    });
  } catch (error) {
    console.error("");
    console.error("❌ ERRO AO CADASTRAR IMÓVEL:");
    console.error(error);
    console.error("");

    res.status(500).json({
      erro: "Não foi possível cadastrar o imóvel.",
    });
  }
});

// ==========================================
// UPLOAD DA FOTO DE CAPA
// ==========================================

app.post(
  "/imoveis/:id/imagem-capa",
  upload.single("imagemCapa"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Verifica se o imóvel existe
      const [imoveis] = await db.query(
        "SELECT id, imagem_capa FROM imoveis WHERE id = ?",
        [id]
      );

      if (imoveis.length === 0) {
        return res.status(404).json({
          erro: "Imóvel não encontrado.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          erro: "Nenhuma imagem de capa foi enviada.",
        });
      }

      // Remove a capa antiga, caso exista
      const capaAntiga = imoveis[0].imagem_capa;

      if (capaAntiga) {
        const caminhoCapaAntiga = path.join(
          __dirname,
          capaAntiga
        );

        if (fs.existsSync(caminhoCapaAntiga)) {
          fs.unlinkSync(caminhoCapaAntiga);
        }
      }

      // Nova URL
      const url = `/uploads/${req.file.filename}`;

      // Salva no banco
      await db.query(
        "UPDATE imoveis SET imagem_capa = ? WHERE id = ?",
        [url, id]
      );

      res.status(201).json({
        mensagem: "Imagem de capa enviada com sucesso.",
        url,
      });
    } catch (error) {
      console.error(error);

      // Se deu erro depois do upload, tenta remover o arquivo
      if (req.file) {
        const caminhoArquivo = path.join(
          pastaUploads,
          req.file.filename
        );

        if (fs.existsSync(caminhoArquivo)) {
          fs.unlinkSync(caminhoArquivo);
        }
      }

      res.status(500).json({
        erro: "Não foi possível enviar a imagem de capa.",
      });
    }
  }
);

// ==========================================
// UPLOAD DE IMAGENS DO CARROSSEL
// ==========================================

app.post(
  "/imoveis/:id/imagens",
  upload.array("imagens", 20),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Verifica se o imóvel existe
      const [imoveis] = await db.query(
        "SELECT id FROM imoveis WHERE id = ?",
        [id]
      );

      if (imoveis.length === 0) {
        return res.status(404).json({
          erro: "Imóvel não encontrado.",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          erro: "Nenhuma imagem foi enviada.",
        });
      }

      // Descobre a última ordem usada
      const [ultimaImagem] = await db.query(
        `SELECT COALESCE(MAX(ordem), 0) AS ultima_ordem
         FROM imovel_imagens
         WHERE imovel_id = ?`,
        [id]
      );

      let ordem = ultimaImagem[0].ultima_ordem + 1;

      for (const arquivo of req.files) {
        const url = `/uploads/${arquivo.filename}`;

        await db.query(
          `INSERT INTO imovel_imagens
          (imovel_id, url, ordem)
          VALUES (?, ?, ?)`,
          [id, url, ordem]
        );

        ordem++;
      }

      res.status(201).json({
        mensagem: "Imagens enviadas com sucesso.",
        quantidade: req.files.length,
      });
    } catch (error) {
      console.error(error);

      // Remove arquivos que foram enviados caso o banco dê erro
      if (req.files && req.files.length > 0) {
        for (const arquivo of req.files) {
          const caminhoArquivo = path.join(
            pastaUploads,
            arquivo.filename
          );

          if (fs.existsSync(caminhoArquivo)) {
            fs.unlinkSync(caminhoArquivo);
          }
        }
      }

      res.status(500).json({
        erro: "Não foi possível enviar as imagens.",
      });
    }
  }
);

// ==========================================
// SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Servidor rodando na porta ${PORT}`
  );
});