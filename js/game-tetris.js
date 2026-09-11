/* =========================================================
   EASYFLOW — TETRIS
   ========================================================= */

const EasyFlowTetris = {

    canvas: null,
    ctx: null,

    cols: 10,
    rows: 20,
    cell: 25,

    board: [],

    piece: null,
    nextPiece: null,

    score: 0,
    lines: 0,
    level: 1,

    running: false,
    gameOver: false,

    timer: null,

    difficulty: "easy",

    colors: {
        I: "#06b6d4",
        O: "#eab308",
        T: "#a855f7",
        S: "#22c55e",
        Z: "#ef4444",
        J: "#3b82f6",
        L: "#f97316"
    },

    shapes: {

        I: [
            [1,1,1,1]
        ],

        O: [
            [1,1],
            [1,1]
        ],

        T: [
            [0,1,0],
            [1,1,1]
        ],

        S: [
            [0,1,1],
            [1,1,0]
        ],

        Z: [
            [1,1,0],
            [0,1,1]
        ],

        J: [
            [1,0,0],
            [1,1,1]
        ],

        L: [
            [0,0,1],
            [1,1,1]
        ]

    },


    /* =====================================================
       ИНИЦИАЛИЗАЦИЯ
       ===================================================== */

    init(canvasId = "tetrisCanvas") {

        this.canvas =
            document.getElementById(canvasId);

        if (!this.canvas) {
            console.error(
                "Tetris: canvas не найден"
            );
            return;
        }

        this.ctx =
            this.canvas.getContext("2d");

        this.canvas.width =
            this.cols * this.cell;

        this.canvas.height =
            this.rows * this.cell;

        this.difficulty =
            typeof difficulty !== "undefined"
                ? difficulty
                : "easy";

        this.createBoard();

        this.draw();

    },


    /* =====================================================
       НОВАЯ ИГРА
       ===================================================== */

    start(level) {

        if (level) {
            this.difficulty = level;
        } else if (
            typeof difficulty !== "undefined"
        ) {
            this.difficulty = difficulty;
        }

        this.stopTimer();

        this.createBoard();

        this.score = 0;
        this.lines = 0;
        this.level = 1;

        this.running = true;
        this.gameOver = false;

        this.nextPiece =
            this.randomPiece();

        this.spawnPiece();

        this.updateUI();

        this.startTimer();

        this.draw();

        this.addGameStat();

    },


    /* =====================================================
       ДОСКА
       ===================================================== */

    createBoard() {

        this.board =
            Array.from(
                { length: this.rows },
                () =>
                    Array(this.cols).fill(null)
            );

    },


    /* =====================================================
       СОЗДАНИЕ ФИГУРЫ
       ===================================================== */

    randomPiece() {

        const types =
            Object.keys(this.shapes);

        const type =
            types[
                Math.floor(
                    Math.random() *
                    types.length
                )
            ];

        return {

            type,

            shape:
                this.shapes[type]
                    .map(row => [...row]),

            x: 0,
            y: 0

        };

    },


    spawnPiece() {

        this.piece =
            this.nextPiece ||
            this.randomPiece();

        this.nextPiece =
            this.randomPiece();

        this.piece.x =
            Math.floor(
                (
                    this.cols -
                    this.piece.shape[0].length
                ) / 2
            );

        this.piece.y = 0;

        if (
            this.collision(
                this.piece,
                0,
                0
            )
        ) {

            this.end();

        }

        this.updateNextPiece();

    },


    /* =====================================================
       ПРОВЕРКА СТОЛКНОВЕНИЯ
       ===================================================== */

    collision(
        piece,
        offsetX,
        offsetY
    ) {

        for (
            let y = 0;
            y < piece.shape.length;
            y++
        ) {

            for (
                let x = 0;
                x < piece.shape[y].length;
                x++
            ) {

                if (
                    !piece.shape[y][x]
                ) {
                    continue;
                }

                const newX =
                    piece.x +
                    x +
                    offsetX;

                const newY =
                    piece.y +
                    y +
                    offsetY;

                if (
                    newX < 0 ||
                    newX >= this.cols ||
                    newY >= this.rows
                ) {

                    return true;

                }

                if (
                    newY >= 0 &&
                    this.board[newY][newX]
                ) {

                    return true;

                }

            }

        }

        return false;

    },


    /* =====================================================
       ДВИЖЕНИЕ
       ===================================================== */

    moveLeft() {

        if (!this.running) {
            return;
        }

        if (
            !this.collision(
                this.piece,
                -1,
                0
            )
        ) {

            this.piece.x--;

            this.draw();

        }

    },


    moveRight() {

        if (!this.running) {
            return;
        }

        if (
            !this.collision(
                this.piece,
                1,
                0
            )
        ) {

            this.piece.x++;

            this.draw();

        }

    },


    moveDown() {

        if (!this.running) {
            return;
        }

        if (
            !this.collision(
                this.piece,
                0,
                1
            )
        ) {

            this.piece.y++;

        } else {

            this.lockPiece();

        }

        this.draw();

    },


    /* =====================================================
       БЫСТРОЕ ПАДЕНИЕ
       ===================================================== */

    hardDrop() {

        if (!this.running) {
            return;
        }

        let distance = 0;

        while (
            !this.collision(
                this.piece,
                0,
                1
            )
        ) {

            this.piece.y++;

            distance++;

        }

        this.score +=
            distance * 2;

        this.lockPiece();

        this.draw();

    },


    /* =====================================================
       ПОВОРОТ
       ===================================================== */

    rotate() {

        if (!this.running) {
            return;
        }

        const oldShape =
            this.piece.shape;

        const rows =
            oldShape.length;

        const cols =
            oldShape[0].length;

        const rotated =
            Array.from(
                { length: cols },
                () =>
                    Array(rows).fill(0)
            );

        for (
            let y = 0;
            y < rows;
            y++
        ) {

            for (
                let x = 0;
                x < cols;
                x++
            ) {

                rotated[x][
                    rows - 1 - y
                ] =
                    oldShape[y][x];

            }

        }

        this.piece.shape =
            rotated;

        if (
            this.collision(
                this.piece,
                0,
                0
            )
        ) {

            this.piece.shape =
                oldShape;

        } else {

            this.draw();

        }

    },


    /* =====================================================
       ЗАКРЕПИТЬ ФИГУРУ
       ===================================================== */

    lockPiece() {

        for (
            let y = 0;
            y < this.piece.shape.length;
            y++
        ) {

            for (
                let x = 0;
                x < this.piece.shape[y].length;
                x++
            ) {

                if (
                    !this.piece.shape[y][x]
                ) {
                    continue;
                }

                const boardY =
                    this.piece.y + y;

                const boardX =
                    this.piece.x + x;

                if (
                    boardY >= 0 &&
                    boardY < this.rows &&
                    boardX >= 0 &&
                    boardX < this.cols
                ) {

                    this.board[boardY][boardX] =
                        this.piece.type;

                }

            }

        }

        const cleared =
            this.clearLines();

        this.addScore(
            cleared
        );

        this.spawnPiece();

        this.updateUI();

    },


    /* =====================================================
       УДАЛЕНИЕ ЛИНИЙ
       ===================================================== */

    clearLines() {

        let cleared = 0;

        for (
            let y = this.rows - 1;
            y >= 0;
            y--
        ) {

            if (
                this.board[y]
                    .every(cell => cell !== null)
            ) {

                this.board.splice(
                    y,
                    1
                );

                this.board.unshift(
                    Array(this.cols)
                        .fill(null)
                );

                cleared++;

                y++;

            }

        }

        if (cleared > 0) {

            this.lines +=
                cleared;

            this.level =
                Math.floor(
                    this.lines / 10
                ) + 1;

            this.restartTimer();

        }

        return cleared;

    },


    /* =====================================================
       ОЧКИ
       ===================================================== */

    addScore(lines) {

        const points = {

            0: 0,
            1: 100,
            2: 300,
            3: 500,
            4: 800

        };

        const gained =
            (points[lines] || 0) *
            this.level;

        this.score +=
            gained;

        if (
            gained > 0 &&
            typeof EasyFlowData !== "undefined"
        ) {

            EasyFlowData.addScore(
                gained
            );

        }

        this.saveRecord();

    },


    /* =====================================================
       РЕКОРД
       ===================================================== */

    saveRecord() {

        if (
            typeof EasyFlowData ===
            "undefined"
        ) {
            return;
        }

        const old =
            EasyFlowData.getRecord(
                "tetris",
                this.difficulty
            );

        if (
            this.score > old
        ) {

            EasyFlowData.setRecord(
                "tetris",
                this.difficulty,
                this.score
            );

        }

    },


    /* =====================================================
       СТАТИСТИКА ИГР
       ===================================================== */

    addGameStat() {

        if (
            typeof EasyFlowData !==
            "undefined"
        ) {

            EasyFlowData.addGame();

        }

    },


    /* =====================================================
       ТАЙМЕР
       ===================================================== */

    getSpeed() {

        let base;

        if (
            this.difficulty ===
            "medium"
        ) {

            base = 600;

        } else if (
            this.difficulty ===
            "hard"
        ) {

            base = 400;

        } else {

            base = 800;

        }

        return Math.max(
            100,
            base -
            (this.level - 1) *
            50
        );

    },


    startTimer() {

        this.stopTimer();

        this.timer =
            setInterval(
                () => {

                    this.moveDown();

                },
                this.getSpeed()
            );

    },


    restartTimer() {

        if (this.running) {
            this.startTimer();
        }

    },


    stopTimer() {

        if (this.timer) {

            clearInterval(
                this.timer
            );

            this.timer = null;

        }

    },


    /* =====================================================
       GAME OVER
       ===================================================== */

    end() {

        if (!this.running) {
            return;
        }

        this.running = false;
        this.gameOver = true;

        this.stopTimer();

        this.saveRecord();

        if (
            typeof EasyFlowData !==
            "undefined"
        ) {

            EasyFlowData.addWin();

        }

        const message =
            document.getElementById(
                "tetrisMessage"
            );

        if (message) {

            message.textContent =
                "💥 Игра окончена! Очки: " +
                this.score;

        }

        this.updateUI();

        this.draw();

    },


    /* =====================================================
       ОТРИСОВКА
       ===================================================== */

    draw() {

        if (!this.ctx) {
            return;
        }

        this.ctx.fillStyle =
            "#111827";

        this.ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );


        /*
           Сетка
        */

        this.ctx.strokeStyle =
            "rgba(255,255,255,.08)";

        this.ctx.lineWidth = 1;

        for (
            let x = 0;
            x <= this.cols;
            x++
        ) {

            this.ctx.beginPath();

            this.ctx.moveTo(
                x * this.cell,
                0
            );

            this.ctx.lineTo(
                x * this.cell,
                this.canvas.height
            );

            this.ctx.stroke();

        }

        for (
            let y = 0;
            y <= this.rows;
            y++
        ) {

            this.ctx.beginPath();

            this.ctx.moveTo(
                0,
                y * this.cell
            );

            this.ctx.lineTo(
                this.canvas.width,
                y * this.cell
            );

            this.ctx.stroke();

        }


        /*
           Доска
        */

        for (
            let y = 0;
            y < this.rows;
            y++
        ) {

            for (
                let x = 0;
                x < this.cols;
                x++
            ) {

                if (
                    this.board[y][x]
                ) {

                    this.drawCell(
                        x,
                        y,
                        this.board[y][x]
                    );

                }

            }

        }


        /*
           Текущая фигура
        */

        if (this.piece) {

            for (
                let y = 0;
                y < this.piece.shape.length;
                y++
            ) {

                for (
                    let x = 0;
                    x < this.piece.shape[y].length;
                    x++
                ) {

                    if (
                        this.piece.shape[y][x]
                    ) {

                        this.drawCell(
                            this.piece.x + x,
                            this.piece.y + y,
                            this.piece.type
                        );

                    }

                }

            }

        }

    },


    drawCell(x, y, type) {

        const color =
            this.colors[type] ||
            "#2563eb";

        this.ctx.fillStyle =
            color;

        this.ctx.fillRect(
            x * this.cell + 2,
            y * this.cell + 2,
            this.cell - 4,
            this.cell - 4
        );

        this.ctx.fillStyle =
            "rgba(255,255,255,.2)";

        this.ctx.fillRect(
            x * this.cell + 3,
            y * this.cell + 3,
            this.cell - 6,
            5
        );

    },


    /* =====================================================
       NEXT PIECE
       ===================================================== */

    updateNextPiece() {

        const canvas =
            document.getElementById(
                "tetrisNextCanvas"
            );

        if (!canvas) {
            return;
        }

        const ctx =
            canvas.getContext("2d");

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        if (!this.nextPiece) {
            return;
        }

        const shape =
            this.nextPiece.shape;

        const size = 25;

        const offsetX =
            (
                canvas.width -
                shape[0].length *
                size
            ) / 2;

        const offsetY =
            (
                canvas.height -
                shape.length *
                size
            ) / 2;

        ctx.fillStyle =
            this.colors[
                this.nextPiece.type
            ];

        for (
            let y = 0;
            y < shape.length;
            y++
        ) {

            for (
                let x = 0;
                x < shape[y].length;
                x++
            ) {

                if (
                    shape[y][x]
                ) {

                    ctx.fillRect(
                        offsetX +
                        x * size,
                        offsetY +
                        y * size,
                        size - 3,
                        size - 3
                    );

                }

            }

        }

    },


    /* =====================================================
       UI
       ===================================================== */

    updateUI() {

        const score =
            document.getElementById(
                "tetrisScore"
            );

        const lines =
            document.getElementById(
                "tetrisLines"
            );

        const level =
            document.getElementById(
                "tetrisLevel"
            );

        const record =
            document.getElementById(
                "tetrisRecord"
            );

        if (score) {
            score.textContent =
                this.score;
        }

        if (lines) {
            lines.textContent =
                this.lines;
        }

        if (level) {
            level.textContent =
                this.level;
        }

        if (record) {

            let value = 0;

            if (
                typeof EasyFlowData !==
                "undefined"
            ) {

                value =
                    EasyFlowData.getRecord(
                        "tetris",
                        this.difficulty
                    );

            }

            record.textContent =
                value;

        }

    },


    /* =====================================================
       ОСТАНОВКА
       ===================================================== */

    stop() {

        this.running = false;

        this.stopTimer();

    }

};


/* =========================================================
   УПРАВЛЕНИЕ КЛАВИАТУРОЙ
   ========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            !EasyFlowTetris.running
        ) {
            return;
        }

        switch(event.key) {

            case "ArrowLeft":

                event.preventDefault();

                EasyFlowTetris.moveLeft();

                break;


            case "ArrowRight":

                event.preventDefault();

                EasyFlowTetris.moveRight();

                break;


            case "ArrowDown":

                event.preventDefault();

                EasyFlowTetris.moveDown();

                break;


            case "ArrowUp":

                event.preventDefault();

                EasyFlowTetris.rotate();

                break;


            case " ":

                event.preventDefault();

                EasyFlowTetris.hardDrop();

                break;

        }

    }
);


/* =========================================================
   АВТОМАТИЧЕСКИЙ ЗАПУСК
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        EasyFlowTetris.init();

    }
);
