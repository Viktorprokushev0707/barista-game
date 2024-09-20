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
let barista = { x: canvas.width / 2 - 50, y: canvas.height - 100, width: 100, height: 150 };
let objects = [];
let score = 0;
let missed = 0; // Счетчик пропущенных объектов
let gameOver = false; // Флаг окончания игры

// Функция для создания новых объектов
function createObject() {
    const images = [coffeeImage, toastImage, moneyImage, syrnikImage];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const x = Math.random() * (canvas.width - 50);
    objects.push({ x, y: 0, width: 50, height: 50, image: randomImage });
}

// Обновление игры
function update() {
    if (!gameOver) {
        objects.forEach(object => object.y += 5);

        // Убираем объекты, если они вышли за пределы экрана и увеличиваем счетчик пропущенных
        objects = objects.filter(object => {
            if (object.y >= canvas.height) {
                missed++;
                return false;
            }
            return true;
        });

        // Проверка на столкновение с баристой
        objects.forEach(object => {
            if (object.y + object.height > barista.y &&
                object.x < barista.x + barista.width &&
                object.x + object.width > barista.x) {
                score++;
                objects = objects.filter(o => o !== object);
            }
        });

        // Если пропущено больше 10 объектов, заканчиваем игру
        if (missed >= 10) {
            gameOver = true;
        }

        // Создаем новые объекты с интервалом
        if (Math.random() < 0.05) {
            createObject();
        }
    }
}

// Отрисовка игры
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        // Отрисовка баристы
        ctx.drawImage(baristaImage, barista.x, barista.y, barista.width, barista.height);

        // Отрисовка объектов
        objects.forEach(object => {
            ctx.drawImage(object.image, object.x, object.y, object.width, object.height);
        });

        // Отрисовка счёта и пропущенных объектов
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Score: " + score, 10, 30);
        ctx.fillText("Missed: " + missed, 10, 70);
    } else {
        // Если игра окончена, показываем сообщение
        ctx.font = "50px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Game Over", canvas.width / 2 - 150, canvas.height / 2);
        ctx.font = "30px Arial";
        ctx.fillText("Final Score: " + score, canvas.width / 2 - 100, canvas.height / 2 + 50);
    }
}

// Управление баристой
document.addEventListener('keydown', function (event) {
    if (event.key === "ArrowLeft" && barista.x > 0) {
        barista.x -= 20;
    }
    if (event.key === "ArrowRight" && barista.x < canvas.width - barista.width) {
        barista.x += 20;
    }
});

// Управление для сенсорных экранов
canvas.addEventListener('touchmove', function(event) {
    let touch = event.touches[0];
    let touchX = touch.clientX - canvas.offsetLeft;
    if (touchX > 0 && touchX < canvas.width) {
        barista.x = touchX - barista.width / 2; // Центрируем баристу по касанию
    }
});

// Основной игровой цикл
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

baristaImage.onload = function () {
    gameLoop();
};
