const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Устанавливаем размеры канваса в зависимости от экрана
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Вызываем при загрузке страницы

// Полное предотвращение прокрутки страницы на мобильных устройствах
document.body.addEventListener('touchstart', function(event) {
    event.preventDefault();
}, { passive: false });

document.body.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, { passive: false });

// Загружаем изображения
const baristaImage = new Image();
baristaImage.src = 'assets/barista.png';

const coffeeImage = new Image();
coffeeImage.src = 'assets/coffee.png';

const toastImage = new Image();
toastImage.src = 'assets/toast.png';

const moneyImage = new Image();
const syrnikImage = new Image();
moneyImage.src = 'assets/money.png';
syrnikImage.src = 'assets/syrnik.png';

// Параметры игры
let barista = { x: canvas.width / 2 - 75, y: canvas.height - 200, width: 150, height: 200 };
let objects = [];
let score = 0;

// Функция для создания новых объектов
function createObject() {
    const images = [coffeeImage, toastImage, moneyImage, syrnikImage];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const x = Math.random() * (canvas.width - 100);
    objects.push({ x, y: 0, width: 100, height: 100, image: randomImage });
}

// Обновление игры
function update() {
    objects.forEach(object => object.y += 5);

    // Убираем объекты, если они вышли за пределы экрана
    objects = objects.filter(object => object.y < canvas.height);

    // Проверка на столкновение с баристой
    objects.forEach(object => {
        if (object.y + object.height > barista.y &&
            object.x < barista.x + barista.width &&
            object.x + object.width > barista.x) {
            score++;
            objects = objects.filter(o => o !== object);
        }
    });

    // Создаем новые объекты с интервалом
    if (Math.random() < 0.05) {
        createObject();
    }
}

// Отрисовка игры
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка баристы
    ctx.drawImage(baristaImage, barista.x, barista.y, barista.width, barista.height);

    // Отрисовка объектов с добавлением фона
    objects.forEach(object => {
        // Добавляем фон под изображение
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(object​⬤
