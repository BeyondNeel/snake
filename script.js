// Constants
const canvasSize = 400;
const tileSize = 20;

// Game variables
let snake;
let food;
let score;
let direction;
let gameLoop;
let touchStartX = 0;
let touchStartY = 0;

// Initialize game
function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    score = 0;
    direction = 'right';

    document.addEventListener('keydown', changeDirection);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);

    gameLoop = setInterval(() => {
        update();
        draw(context);
    }, 100);
}

// Update game state
function update() {
    const head = {...snake[0] };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    if (head.x === food.x && head.y === food.y) {
        // Snake eats the food
        score++;
        food = generateFood();
    } else {
        // Remove the tail segment
        snake.pop();
    }

    // Add new head segment
    snake.unshift(head);

    // Check for collision with walls or self
    if (head.x < 0 || head.x >= canvasSize / tileSize || head.y < 0 || head.y >= canvasSize / tileSize || isColliding()) {
        gameOver();
    }
}

// Draw game on canvas
function draw(context) {
    context.clearRect(0, 0, canvasSize, canvasSize);

    // Draw snake
    snake.forEach(segment => {
        context.fillStyle = '#2196F3';
        context.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });

    // Draw food
    context.fillStyle = '#F44336';
    context.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    // Draw score
    context.fillStyle = '#000';
    context.font = '20px Arial';
    context.fillText('Score: ' + score, 10, 30);
}

// Generate random food position
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / tileSize)),
        y: Math.floor(Math.random() * (canvasSize / tileSize))
    };
}

// Check if snake is colliding with itself
function isColliding() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Game over
function gameOver() {
    clearInterval(gameLoop);
    alert('Game over! Your score is ' + score);
}

// Change snake direction based on arrow keys
function changeDirection(event) {
    event.preventDefault(); // Prevent default behavior of arrow keys
    const key = event.keyCode;
    switch (key) {
        case 37:
            if (direction !== 'right')
                direction = 'left';
            break;
        case 38:
            if (direction !== 'down')
                direction = 'up';
            break;
        case 39:
            if (direction !== 'left')
                direction = 'right';
            break;
        case 40:
            if (direction !== 'up')
                direction = 'down';
            break;
    }
}

// Attach event listener for arrow keys
document.addEventListener('keydown', changeDirection);

// Touch event handlers
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction !== 'left') {
            direction = 'right';
        } else if (deltaX < 0 && direction !== 'right') {
            direction = 'left';
        }
    } else {
        if (deltaY > 0 && direction !== 'up') {
            direction = 'down';
        } else if (deltaY < 0 && direction !== 'down') {
            direction = 'up';
        }
    }

    touchStartX = 0;
    touchStartY = 0;
}

// Restart the game
function restartGame() {
    clearInterval(gameLoop);
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvasSize, canvasSize);
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    score = 0;
    direction = 'right';
    gameLoop = setInterval(() => {
        update();
        draw(context);
    }, 100);
}

// Initialize the game on page load
window.onload = function() {
    const startButton = document.getElementById('startBtn');
    startButton.addEventListener('click', function() {
        initGame();
    });
};