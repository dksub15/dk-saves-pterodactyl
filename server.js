const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 25568;
const UPLOAD_DIR = '/home/container/uploads';

app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(express.json());

app.post('/upload', (req, res) => {
    console.log('Recebendo arquivo...');
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log('Nenhum arquivo foi enviado.');
        return res.status(400).send('Nenhum arquivo foi enviado.');
    }

    const file = req.files.file;
    const uploadPath = path.join(UPLOAD_DIR, file.name);

    file.mv(uploadPath, (err) => {
        if (err) {
            console.log('Erro ao mover o arquivo:', err);
            return res.status(500).send(err);
        }

        console.log('Arquivo enviado com sucesso!');
        res.json({ message: 'Arquivo enviado com sucesso!' });
    });
});

app.get('/files', (req, res) => {
    console.log('Listando arquivos...');
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) {
            console.log('Erro ao listar arquivos:', err);
            return res.status(500).send(err);
        }

        console.log('Arquivos listados:', files);
        res.json(files);
    });
});

app.get('/download/:filename', (req, res) => {
    const filePath = path.join(UPLOAD_DIR, req.params.filename);
    res.download(filePath, (err) => {
        if (err) {
            console.log('Erro ao baixar o arquivo:', err);
            res.status(500).send(err);
        }
    });
});

app.delete('/delete/:filename', (req, res) => {
    const filePath = path.join(UPLOAD_DIR, req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log('Erro ao deletar o arquivo:', err);
            return res.status(500).send(err);
        }

        console.log('Arquivo deletado com sucesso!');
        res.json({ message: 'Arquivo deletado com sucesso!' });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
