const express = require('express');
const cron = require('node-cron');
const path = require('path');

const app = express();
let variables = [];

// Kişiler verilerini tanımlıyoruz
const people = [
    { name: 'Orkun', image: 'image1.jpg', video: 'video1.mp4' },
    { name: 'Aziz', image: 'image2.jpg', video: 'video2.mp4' },
    { name: 'Ahmet', image: 'image3.jpg', video: 'video3.mp4' },
    { name: 'Murat', image: 'image4.jpg', video: 'video4.mp4' },
    { name: 'Yasin', image: 'image5.jpg', video: 'video5.mp4' },
    { name: 'Melih', image: 'image6.jpg', video: 'video6.mp4' }
];

// Rastgele değişkenleri ve resimleri oluşturan fonksiyon
function updateVariables() {
    variables = people.map(person => ({
        value: Math.floor(Math.random() * 100) + 1,
        image: `/images/${person.image}`,
        video: `/videos/${person.video}`,
        name: person.name
    }));
    variables.sort((a, b) => b.value - a.value);  // Büyükten küçüğe sıralama
}

// Zamanlayıcıyı başlatıyoruz - her gece 00:00'da çalışacak
cron.schedule('2 14 * * *', () => {
    updateVariables();
    console.log('Variables updated:', variables);
});

// İlk başta da değişkenleri güncelleyip başlatıyoruz
updateVariables();

// Public klasörünü statik dosyalar için ayarlıyoruz
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <style>
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .item {
                    position: relative;
                    width: 300px;
                    margin: 10px;
                    border: 2px solid #000;
                    border-radius: 8px;
                    overflow: hidden;
                    text-align: center;
                    background-color: #f4f4f4;
                }
                .item img {
                    width: 100%;
                    height: auto;
                }
                .item video {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .item:hover video {
                    opacity: 1;
                }
                .item span {
                    display: block;
                    padding: 10px;
                    background-color: rgba(0, 0, 0, 0.5);
                    color: white;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <h1>Rastgele Değişkenler ve Resimler</h1>
            <div class="container">
                ${variables.map(variable => `
                    <div class="item">
                        <img src="${variable.image}" alt="Resim">
                        <video src="${variable.video}" muted loop></video>
                        <span>${variable.value}%<br>${variable.name}</span>
                    </div>
                `).join('')}
            </div>
            <script>
                document.querySelectorAll('.item').forEach(item => {
                    const video = item.querySelector('video');
                    item.addEventListener('mouseover', () => {
                        video.play();
                    });
                    item.addEventListener('mouseout', () => {
                        video.pause();
                    });
                });
            </script>
        </body>
        </html>
    `);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
