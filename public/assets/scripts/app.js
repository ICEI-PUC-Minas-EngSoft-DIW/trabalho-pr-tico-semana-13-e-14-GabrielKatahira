
let artistas = [];
let albumId;
async function reloadData() {
    const res = await fetch("http://localhost:3000/artistas");
    artistas = await res.json();

    try{loadGrid()} catch(e){console.error(e)}
    try{loadCarousel()} catch(e){console.error(e)}
    try{loadArtist()} catch(e){console.error(e)}
    try{loadCharts()} catch(e){console.error(e)}
}

const container= document.getElementById("artist-carousel");
const track = document.getElementById("artist-carousel-track");
let currentIndex = 0;

function loadCarousel() {
    track.innerHTML = artistas.map(artista => `
        <div id="artist-carousel-item" onclick="viewArtist(${artista.id})">
            <img src="${artista.image}">
            <div>
                <h1>${artista.nome}</h1>
            </div>
        </div>
        `
    ).join('')
}

function slide(direction) {
    const totalItems = artistas.length;
    const containerWidth = container.offsetWidth; 
    const maxIndex = totalItems - 1;                

    currentIndex += direction;
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    track.style.transform = `translateX(-${currentIndex * containerWidth}px)`;
}

function loadGrid() {
    const grid = document.getElementById("artist-grid");
    grid.innerHTML = artistas.map(artista => `
        <div id="artist-grid-item">
            <img src="${artista.image}" onclick="viewArtist(${artista.id})">
            <h2>${artista.nome}</h2>
            <p>Gêneros: ${artista.generos}</p>
            <button onclick="deleteArtist(${artista.id})">Deletar Artista</button>
        </div>`    
    ).join('')+
         `<a id="artist-grid-item" href="cadastro_artista.html">
                <h2>Adicionar novo artista</h2>
        </a>`;
}
function viewArtist(id) {
    window.location.href = `detalhe.html?id=${id}`;
}

function loadArtist() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const artista = artistas.find(a => a.id == id);
    const container = document.getElementById("artist-data");
    if (artista) {
        container.innerHTML = `
            <div id="artist-details">
                <img src="${artista.image}">
                <div>
                    <h1>${artista.nome}</h1>
                    <p>Gêneros: ${artista.generos}</p>
                    <p>Idiomas: ${artista.idioma}</p>
                    <p>Vocaloids: ${artista.vocaloids}</p>
                </div>
            </div>
            <h2>Álbuns</h2>
            <div id="line"></div>
            <div id="album-grid">
        `+artista.albuns.map(album => `
            <div id="album-grid-item">
                <img src="${album.imagem}">
                <p>${album.nome}</p>
            </div>
            `).join('')+
        "</div>"
    } else {
        container.innerHTML = `
        <h1>Artista não encontrado.</h1>
        `
    }
}
async function deleteArtist(id) {
    try {
        const response = await fetch(`http://localhost:3000/artistas/${id}`, {
            method: 'DELETE',
        });

        if(response.ok) {
            alert('Artista deletado com sucesso!');
            reloadData();
        } else {
            alert('Erro:'+e);
        }
    } catch(e) {
        alert('Erro:'+e);
    }
}
function updateImage(imagePath,elementId) {
    const imageElement = document.getElementById(elementId);
    if(imagePath) {
        imageElement.src = `assets/img/${imagePath}`;
    }
}
function createAlbum() {
    const albumElement = document.getElementById('artist-albums');
    albumElement.innerHTML += 
    `<div id="album-card">
        <img src="assets/img/album1-1.png" id="album-image-${albumId}">
        <select onchange="updateImage(this.value,'album-image-${albumId}')" id="input-image">
            <option value="album1-1.png">Album1-1</option>
            <option value="album1-2.png">Album1-2</option>
            <option value="album1-3.png">Album1-3</option>
            <option value="album2-1.png">Album2-1</option>
            <option value="album2-2.png">Album2-2</option>
            <option value="album2-3.jpg">Album2-3</option>
            <option value="album3-1.png">Album3-1</option>
            <option value="album3-2.jpg">Album3-2</option>
            <option value="album3-3.jpg">Album3-3</option>
            <option value="album4-1.jpg">Album4-1</option>
            <option value="album4-2.jpg">Album4-2</option>
            <option value="album4-3.png">Album4-3</option>
        </select>
        <h4>Nome do Album:</h4>
        <input type=text id="input-name">
        <input type=hidden id="input-id" value=${albumId}>
        <button onclick="deleteAlbum(${albumId})">Deletar Álbum</button>
     </div>`;
     albumId++;
}
function deleteAlbum(id) {
    const albums = Array.from(document.querySelectorAll("#album-card"));
    const album = albums.find((alb) => alb.querySelector("#input-id").value == id);
    album.remove();
}
async function createArtist() {
    const name = document.getElementById('artist-name').value;
    const language = document.getElementById('artist-language').value;
    const genres = document.getElementById('artist-genres').value;
    const singers = document.getElementById('artist-singers').value;
    const image = 'assets/img/'+document.getElementById('artist-image-select').value;
    const albumData = [];
    const albums = document.querySelectorAll('#album-card');
    const genreData = [];
    const singerData = [];

    albums.forEach(album => {
        const nome = album.querySelector('#input-name').value;
        const imagem = 'assets/img/'+album.querySelector('#input-image').value;
        const id = album.querySelector('#input-id').value;
        if (nome || imagem || id) {
            albumData.push({nome, imagem, id});
        }
    })
    genres.split(",").forEach(genre => {
        genreData.push(
            genre.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .trim()
        )
    })
    singers.split(",").forEach(singer => {
        singerData.push(
            singer.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .trim()
        )
    })
    const artistData = {
        nome:name,
        idioma:language,
        generos:genreData,
        vocaloids:singerData,
        image:image,
        albuns:albumData
    }
    try {
        const response = await fetch('http://localhost:3000/artistas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(artistData)
        });

        if(response.ok) {
            alert('Artista salvo com sucesso!');
            window.location.href = 'index.html';
        } else {
            alert('Erro:'+e);
        }
    } catch(e) {
        alert('Erro:'+e);
    }
}
async function loadCharts() {
    let genres = {};
    let singers = {};
    artistas.forEach(artista => {
        artista.generos.forEach(genre => {
            genres[genre] = (genres[genre] || 0) + 1;
        });
        artista.vocaloids.forEach(singer => {
            singers[singer] = (singers[singer] || 0) + 1;
        })
    });
    let genreMap = new Map(Object.entries(genres));
    let singerMap = new Map(Object.entries(singers));

    genreChart = document.getElementById("genre-chart").getContext('2d');
    singerChart = document.getElementById("singer-chart").getContext('2d');
    new Chart(genreChart, {
        type: 'bar',
        data: {
            labels: Array.from(genreMap.keys()),
            datasets: [{
                label:'Artistas',
                data: Array.from(genreMap.values()),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    })
    new Chart (singerChart, {
        type: 'pie',
        data: {
            labels: Array.from(singerMap.keys()),
            datasets: [{
                label:'Artistas',
                data: Array.from(singerMap.values()),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    })
    
}
window.onload = (() => {
    reloadData();
    albumId = 1;
})