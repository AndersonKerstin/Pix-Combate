module.exports = {
let currentSlide = 0;
const carousel = document.getElementById('carousel');

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    slides.forEach((slide, i) => {
        if (i >= index && i < index + 3) {
            slide.style.display = 'block';
            slide.style.transform = `translateX(${100 * (i - index)}%)`;
        } else {
            slide.style.display = 'none';
        }
    });
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-item');
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-item');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}


// Função para buscar dados do PolygonScan e atualizar as tabelas
async function fetchData() {
    try {
        const response = await fetch('https://api.polygonscan.com/api?module=account&action=tokennfttx&address=0x54FB1Bb165D9030Cb335dcBDdBe103a53BB40098&startblock=0&endblock=999999999&sort=asc&apikey=271988RGKDC66P4K6222U9Y9B3CXU9S2T9');
        const data = await response.json();
        
        const nfts = data.result.reduce((acc, nft) => {
            if (!acc[nft.tokenName]) {
                acc[nft.tokenName] = [];
            }
            acc[nft.tokenName].push(nft);
            return acc;
        }, {});

        Object.keys(nfts).forEach(tokenName => {
            const table = document.createElement('div');
            table.className = 'carousel-item';
            table.innerHTML = `
                <h2>${tokenName}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Usuário</th>
                            <th>Tokens</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${nfts[tokenName].map(nft => `
                            <tr>
                                <td>${nft.to}</td>
                                <td>${nft.tokenID}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            carousel.insertBefore(table, document.querySelector('.carousel-buttons'));
        });

        showSlide(currentSlide);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

fetchData();
