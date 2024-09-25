let currentSlide = 0;
const carousel = document.getElementById('carousel');

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    slides.forEach((slide, i) => {
        if (i >= index && i < index + 3) {
            slide.style.display = 'block';
            slide.style.transform = `translateX(${10 * (i - index)}%)`;
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

        // Ordenar os tokens pela quantidade de NFTs
        const sortedTokenNames = Object.keys(nfts).sort((a, b) => nfts[b].length - nfts[a].length);

        sortedTokenNames.forEach(tokenName => {
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

// Conectar à MetaMask
async function connectMetaMask() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            console.log('Conectado à MetaMask:', account);
            return account;
        } catch (error) {
            console.error('Erro ao conectar à MetaMask:', error);
        }
    } else {
        alert('MetaMask não está instalada!');
    }
}
