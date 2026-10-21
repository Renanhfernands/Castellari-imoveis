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

    const [resultado] = await db.query(
      "DELETE FROM imoveis WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        erro: "Imóvel não encontrado.",
      });
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
  try {
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

    console.log("RESULTADO DO INSERT:", resultado);

    res.status(201).json({
      mensagem: "Imóvel cadastrado com sucesso.",
      id: resultado.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Não foi possível cadastrar o imóvel.",
    });
  }
});


// ==========================================
// SERVIDOR
// ==========================================

// ==========================================
// UPLOAD DE IMAGENS DO IMÓVEL
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

      res.status(500).json({
        erro: "Não foi possível enviar as imagens.",
      });
    }
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Servidor rodando na porta ${PORT}`
  );
});