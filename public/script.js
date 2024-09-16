function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'ryangauterio' && password === 'SuaSenha') {
        document.getElementById('login-panel').style.display = 'none';
        document.getElementById('storage-panel').style.display = 'block';
        listFiles();
    } else {
        alert('Usuário ou senha incorretos!');
    }
}

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://node01.dkhosting.shop:25568/upload', true);

        xhr.upload.onprogress = function(event) {
            const percent = (event.loaded / event.total) * 100;
            const progressBar = document.getElementById('progressBar');
            progressBar.style.width = percent + '%';
        };

        xhr.onload = function() {
            if (xhr.status === 200) {
                alert('Arquivo enviado com sucesso!');
                listFiles();
            } else {
                alert('Erro ao enviar arquivo!');
            }
            document.getElementById('progressContainer').style.display = 'none';
        };

        xhr.onerror = function() {
            alert('Erro ao enviar arquivo!');
            document.getElementById('progressContainer').style.display = 'none';
        };

        document.getElementById('progressContainer').style.display = 'block';
        xhr.send(formData);
    }
}

function downloadFile(fileName) {
    window.location.href = `http://node01.dkhosting.shop:25568/download/${fileName}`;
}

function deleteFile(fileName) {
    fetch(`http://node01.dkhosting.shop:25568/delete/${fileName}`, {
        method: 'DELETE'
    }).then(response => response.json())
      .then(data => {
          alert('Arquivo deletado com sucesso!');
          listFiles();
      }).catch(error => {
          console.error('Erro ao deletar arquivo:', error);
      });
}

function listFiles() {
    fetch('http://node01.dkhosting.shop:25568/files')
        .then(response => response.json())
        .then(files => {
            displayFiles(files);
        });
}

function searchFiles() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    fetch('http://node01.dkhosting.shop:25568/files')
        .then(response => response.json())
        .then(files => {
            const filteredFiles = files.filter(file => file.toLowerCase().includes(searchInput));
            displayFiles(filteredFiles);
        });
}

function displayFiles(files) {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        const fileIcon = document.createElement('img');
        fileIcon.className = 'file-icon';

        if (file.endsWith('.zip') || file.endsWith('.rar')) {
            fileIcon.src = 'winrar.png';
        } else if (file.endsWith('.txt')) {
            fileIcon.src = 'txt.png';
        } else if (file.endsWith('.html')) {
            fileIcon.src = 'html.png';
        } else {
            fileIcon.src = 'pasta.png';
        }

        const fileName = document.createElement('span');
        fileName.textContent = file;

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.onclick = () => downloadFile(file);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteFile(file);

        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.onclick = () => viewFile(file);

        fileItem.appendChild(fileIcon);
        fileItem.appendChild(fileName);
        fileItem.appendChild(downloadButton);
        fileItem.appendChild(deleteButton);
        fileItem.appendChild(viewButton);
        fileList.appendChild(fileItem);
    });
}

function viewFile(fileName) {
    if (fileName.endsWith('.html')) {
        window.open(`http://node01.dkhosting.shop:25568/uploads/${fileName}`, '_blank');
    } else {
        alert('Visualização disponível apenas para arquivos HTML.');
    }
}
