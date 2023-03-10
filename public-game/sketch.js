const URL = `http://${window.location.hostname}:8080`;
let socket = io(URL, {
    path: '/real-time'
});

let ball
let player
let score = undefined

function setup() {
    createCanvas(windowWidth, windowHeight);
    ball = {
        x: windowWidth / 2,
        y: windowHeight / 4,
        diameter: 25,
        xDirection: 'RIGHT',
        yDirection: 'DOWN',
        block: false
    }
    player = {
        x: windowWidth / 2,
        y: windowHeight / 8 * 7,
        xDirection: 'CENTER',
        width: windowWidth / 10,
        height: 25,
        block: false
    }

}

function draw() {
    background(0, 50)
    renderScore()
    renderBall(ball)
    renderPlayer(player)

    ballCollision(ball);
    ballMovement(ball);
    playerMovement(player)

    playerBallCollider(player, ball)

    gameOver()
}

function renderBall(ball) {
    fill(255)
    circle(ball.x, ball.y, ball.diameter)
}

function renderPlayer(player) {
    fill(0, 0, 255)
    rectMode(CENTER)
    rect(player.x, player.y, player.width, player.height);
    rectMode(CORNER)
}

function renderScore() {
    if (score !== undefined) {
        textAlign(CENTER, CENTER)
        fill(255, 255, 0);
        textSize(32)
        text(`Final score: ${score}`, windowWidth / 2, 100)

        fill(255, 0, 0);
        textSize(50)
        text(`GAME OVER`, windowWidth / 2, windowHeight/2)


    }
}

function ballMovement(ball) {
    if (!ball.block) {
        switch (ball.xDirection) {
            case 'RIGHT':
                ball.x += 5
                break;
            case 'LEFT':
                ball.x -= 5
                break;
        }
        switch (ball.yDirection) {
            case 'DOWN':
                ball.y += 5
                break;
            case 'UP':
                ball.y -= 5
                break;
        }
    }
}

function ballCollision(ball) {
    if (ball.x <= 0) {
        ball.xDirection = 'RIGHT'
    }
    if (ball.x >= windowWidth) {
        ball.xDirection = 'LEFT'
    }
    if (ball.y <= 0) {
        ball.yDirection = 'DOWN'
    }
    if (ball.y >= windowHeight) {
        ball.y = windowHeight / 4
        ball.block = true
        player.block = true
        const point = 0
        sendScore(point)
    }
}

function playerMovement(player) {
    if (!player.block) {
        switch (player.xDirection) {
            case 'RIGHT':
                player.x += 10
                break;
            case 'LEFT':
                player.x -= 10
                break;
            case 'CENTER':
                player.x = player.x
                break;
        }
    }
}

function playerBallCollider(player, ball) {
    if (ball.x >= player.x - (player.width / 2) && ball.x <= player.x + (player.width / 2) && ball.y <= player.y + (player.height / 2) && ball.y >= player.y - (player.height / 2)) {
        ball.yDirection = 'UP'
        const point = 1
        sendScore(point)
    }
}

function gameOver() {
    if (ball.block) {
        getFinalScore();
    }
}

/*___________________________________________

1) Include the socket method to listen to events and change the players position.
_____________________________________________ */
socket.on('game-size', deviceSize => {
    let { windowWidth, windowHeight } = deviceSize;
    player = windowWidth;
    ball = windowHeight;});


/*___________________________________________

2) Include the fetch method to POST each time the player scores a point
_____________________________________________ */

async function sendScore(point) {
        let messageGet = {content:'point'}
    
        const request = {
            method: 'POST',
            Headers: {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(messageGet)
        }
        console.log('score de juego');
        await fetch('http://localhost:8080/score', messageGet)
    }


/*___________________________________________

3) Include the fetch method to GET the final score at the end of the game
_____________________________________________ */

async function getFinalScore(){
    const res = await fetch ('http://localhost:8080/final-score')
    const data = await res.json()
    let {content} = data
    score = content
    console.log(content);
}

