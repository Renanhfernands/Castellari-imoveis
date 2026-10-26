const express = require("express");
const cors = require("cors");
const db = require("./db");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// CONFIGURAÇÃO DO CLOUDINARY
// ==========================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("☁️ CLOUDINARY CONFIGURADO:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "OK" : "AUSENTE",
  api_key: process.env.CLOUDINARY_API_KEY ? "OK" : "AUSENTE",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "OK" : "AUSENTE",
});

// ==========================================
// CONFIGURAÇÃO DO MULTER
// ==========================================

// As imagens ficam temporariamente na memória.
// Depois são enviadas para o Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB por imagem
  },

  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new Error("Apenas arquivos de imagem são permitidos.")
      );
    }

    cb(null, true);
  },
});

// ==========================================
// FUNÇÃO: ENVIAR PARA O CLOUDINARY
// ==========================================

function enviarParaCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },

      (error, resultado) => {
        if (error) {
          return reject(error);
        }

        resolve(resultado);
      }
    );

    stream.end(buffer);
  });
}

// ==========================================
// FUNÇÃO: EXCLUIR DO CLOUDINARY
// ==========================================

async function excluirDoCloudinary(url) {
  if (!url || !url.includes("res.cloudinary.com")) {
    return;
  }

  try {
    const partes = url.split("/upload/");

    if (partes.length !== 2) {
      return;
    }

    let caminho = partes[1];

    const segmentos = caminho.split("/");

    const indiceVersao = segmentos.findIndex((segmento) =>
      /^v\d+$/.test(segmento)
    );

    if (indiceVersao !== -1) {
      caminho = segmentos
        .slice(indiceVersao + 1)
        .join("/");
    }

    const publicId = caminho.replace(/\.[^/.]+$/, "");

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });

  } catch (error) {
    console.error(
      "⚠️ Erro ao excluir imagem do Cloudinary:",
      error
    );
  }
}

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

    console.log(
      "🗄️ BANCO CONECTADO:",
      resultado
    );

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

    // Busca a capa antes de excluir
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

    // Remove imagens do banco
    await db.query(
      "DELETE FROM imovel_imagens WHERE imovel_id = ?",
      [id]
    );

    // Remove imóvel
    const [resultado] = await db.query(
      "DELETE FROM imoveis WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        erro: "Imóvel não encontrado.",
      });
    }

    // Remove capa do Cloudinary
    if (imovel[0].imagem_capa) {
      await excluirDoCloudinary(
        imovel[0].imagem_capa
      );
    }

    // Remove imagens do carrossel
    for (const imagem of imagens) {
      await excluirDoCloudinary(imagem.url);
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

    console.log(
      "📦 DADOS RECEBIDOS:",
      req.body
    );

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

      console.log(
        "❌ VALIDAÇÃO FALHOU"
      );

      return res.status(400).json({
        erro:
          "Tipo, título, localização e preço são obrigatórios.",
      });
    }

    console.log(
      "✅ VALIDAÇÃO OK"
    );

    console.log(
      "💾 TENTANDO INSERIR NO BANCO..."
    );

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

    console.log(
      "🔥 INSERT EXECUTADO"
    );

    console.log(
      "📊 RESULTADO:",
      resultado
    );

    console.log(
      "🆔 ID GERADO:",
      resultado.insertId
    );

    const [conexao] = await db.query(`
      SELECT
        DATABASE() AS banco,
        @@hostname AS host,
        @@port AS porta,
        USER() AS usuario
    `);

    console.log(
      "🔎 CONEXÃO DO BACKEND:"
    );

    console.log(
      conexao[0]
    );

    const [imovelCriado] = await db.query(
      "SELECT * FROM imoveis WHERE id = ?",
      [resultado.insertId]
    );

    console.log(
      "🔎 IMÓVEL APÓS INSERT:"
    );

    console.log(
      imovelCriado
    );

    res.status(201).json({
      mensagem:
        "Imóvel cadastrado com sucesso.",
      id: resultado.insertId,
    });

  } catch (error) {

    console.error("");

    console.error(
      "❌ ERRO AO CADASTRAR IMÓVEL:"
    );

    console.error(error);

    console.error("");

    res.status(500).json({
      erro:
        "Não foi possível cadastrar o imóvel.",
    });
  }
});

// ==========================================
// UPLOAD / SUBSTITUIÇÃO DA FOTO DE CAPA
// ==========================================

app.post(
  "/imoveis/:id/imagem-capa",
  upload.single("imagemCapa"),

  async (req, res) => {

    try {

      const { id } = req.params;

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
          erro:
            "Nenhuma imagem de capa foi enviada.",
        });
      }

      const capaAntiga =
        imoveis[0].imagem_capa;

      console.log(
        `☁️ Enviando capa do imóvel ${id} para o Cloudinary...`
      );

      const resultadoCloudinary =
        await enviarParaCloudinary(
          req.file.buffer,
          `castellari/imoveis/${id}/capa`
        );

      const url =
        resultadoCloudinary.secure_url;

      await db.query(
        "UPDATE imoveis SET imagem_capa = ? WHERE id = ?",
        [url, id]
      );

      if (capaAntiga) {

        await excluirDoCloudinary(
          capaAntiga
        );
      }

      console.log(
        "✅ CAPA SALVA:",
        url
      );

      res.status(201).json({
        mensagem:
          "Imagem de capa atualizada com sucesso.",
        url,
      });

    } catch (error) {

      console.error(
        "❌ ERRO NO UPLOAD DA CAPA:",
        error
      );

      res.status(500).json({
        erro:
          "Não foi possível atualizar a imagem de capa.",
      });
    }
  }
);

// ==========================================
// REMOVER FOTO DE CAPA
// ==========================================

app.delete(
  "/imoveis/:id/imagem-capa",

  async (req, res) => {

    try {

      const { id } = req.params;

      const [imoveis] = await db.query(
        "SELECT id, imagem_capa FROM imoveis WHERE id = ?",
        [id]
      );

      if (imoveis.length === 0) {

        return res.status(404).json({
          erro:
            "Imóvel não encontrado.",
        });
      }

      const capa =
        imoveis[0].imagem_capa;

      if (!capa) {

        return res.status(404).json({
          erro:
            "Este imóvel não possui imagem de capa.",
        });
      }

      await db.query(
        "UPDATE imoveis SET imagem_capa = NULL WHERE id = ?",
        [id]
      );

      await excluirDoCloudinary(capa);

      res.json({
        mensagem:
          "Imagem de capa removida com sucesso.",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        erro:
          "Não foi possível remover a imagem de capa.",
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

    const imagensEnviadas = [];

    try {

      const { id } = req.params;

      const [imoveis] = await db.query(
        "SELECT id FROM imoveis WHERE id = ?",
        [id]
      );

      if (imoveis.length === 0) {

        return res.status(404).json({
          erro:
            "Imóvel não encontrado.",
        });
      }

      if (
        !req.files ||
        req.files.length === 0
      ) {

        return res.status(400).json({
          erro:
            "Nenhuma imagem foi enviada.",
        });
      }

      const [ultimaImagem] =
        await db.query(
          `SELECT COALESCE(MAX(ordem), 0) AS ultima_ordem
           FROM imovel_imagens
           WHERE imovel_id = ?`,
          [id]
        );

      let ordem =
        ultimaImagem[0].ultima_ordem + 1;

      for (const arquivo of req.files) {

        console.log(
          `☁️ Enviando imagem ${ordem} do imóvel ${id}...`
        );

        const resultadoCloudinary =
          await enviarParaCloudinary(
            arquivo.buffer,
            `castellari/imoveis/${id}/galeria`
          );

        const url =
          resultadoCloudinary.secure_url;

        imagensEnviadas.push(url);

        await db.query(
          `INSERT INTO imovel_imagens
           (imovel_id, url, ordem)
           VALUES (?, ?, ?)`,
          [
            id,
            url,
            ordem,
          ]
        );

        ordem++;
      }

      console.log(
        `✅ ${req.files.length} imagens salvas no Cloudinary.`
      );

      res.status(201).json({
        mensagem:
          "Imagens enviadas com sucesso.",
        quantidade:
          req.files.length,
      });

    } catch (error) {

      console.error(
        "❌ ERRO NO UPLOAD DO CARROSSEL:",
        error
      );

      // Limpa imagens que foram enviadas
      // mas não conseguiram ser salvas no banco.
      for (
        const url of imagensEnviadas
      ) {

        await excluirDoCloudinary(
          url
        );
      }

      res.status(500).json({
        erro:
          "Não foi possível enviar as imagens.",
      });
    }
  }
);

// ==========================================
// REMOVER IMAGEM DO CARROSSEL
// ==========================================

app.delete(
  "/imoveis/:id/imagens/:imagemId",

  async (req, res) => {

    try {

      const {
        id,
        imagemId,
      } = req.params;

      const [imagens] =
        await db.query(
          `SELECT id, url
           FROM imovel_imagens
           WHERE id = ? AND imovel_id = ?`,
          [
            imagemId,
            id,
          ]
        );

      if (imagens.length === 0) {

        return res.status(404).json({
          erro:
            "Imagem não encontrada.",
        });
      }

      const imagem =
        imagens[0];

      await db.query(
        `DELETE FROM imovel_imagens
         WHERE id = ? AND imovel_id = ?`,
        [
          imagemId,
          id,
        ]
      );

      await excluirDoCloudinary(
        imagem.url
      );

      res.json({
        mensagem:
          "Imagem removida com sucesso.",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        erro:
          "Não foi possível remover a imagem.",
      });
    }
  }
);

// ==========================================
// TRATAMENTO DE ERROS DO MULTER
// ==========================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    if (
      error instanceof
      multer.MulterError
    ) {

      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {

        return res.status(400).json({
          erro:
            "A imagem não pode ultrapassar 10 MB.",
        });
      }

      if (
        error.code ===
        "LIMIT_UNEXPECTED_FILE"
      ) {

        return res.status(400).json({
          erro:
            "Quantidade de imagens excedida.",
        });
      }

      return res.status(400).json({
        erro:
          "Erro no upload das imagens.",
      });
    }

    if (error) {

      console.error(
        "❌ ERRO:",
        error
      );

      return res.status(400).json({
        erro:
          error.message ||
          "Erro na requisição.",
      });
    }

    next();
  }
);

// ==========================================
// SERVIDOR
// ==========================================

const PORT =
  process.env.PORT || 3000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `Servidor rodando na porta ${PORT}`
    );
  }
);