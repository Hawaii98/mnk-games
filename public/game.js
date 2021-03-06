var game = {
    obj: document.getElementById('game'),
    logs: document.createElement('div'),
    canv: document.createElement('canvas'),
    gameId: null,
    gameStarted: false,
    context: null,
    settings: {},
    signType: {WHITE: "silver", BLACK: "black"},
    playerSign: null,
    playerTurn: false,
    prepareGame: function (m, n, k, turn, sign, gameId) {
		lobby.hideLobby();
        this.settings = {m: m, n: n, k: k};
        this.playerTurn = turn;
        this.gameId = gameId;
        this.playerSign = (sign == "white" ? this.signType.WHITE : this.signType.BLACK);

        this.canv.id = 'gameElement';
        this.canv.height = this.settings.n * 40 + 1;
        this.canv.width = this.settings.m * 40 + 1;
        this.obj.appendChild(this.canv);

        this.logs.id = 'logs';
        this.obj.appendChild(this.logs);
        this.clearLogs();

        this.context = this.canv.getContext('2d');
        this.canv.addEventListener("mousedown", game.getMouseClickCoordinates, false);
        this.drawBoard(this.settings.m, this.settings.n);

        this.log("Waiting for opponent");
    },
    drawBoard: function (m, n) {
        for (var x = 0; x <= m; x++) {
            this.context.moveTo(0.5 + x * 40, 0);
            this.context.lineTo(0.5 + x * 40, n * 40);
        }
        for (var x = 0; x <= n; x++) {
            this.context.moveTo(0, 0.5 + x * 40);
            this.context.lineTo(m * 40, 0.5 + x * 40);
        }
        this.context.strokeStyle = "black";
        this.context.stroke();
    },
    showGameElement: function () {
        this.obj.style.display = "block";
    },
    hideGameElement: function () {
        this.obj.style.display = "none";
    },
    startGame: function () {
        game.gameStarted = true;
    },
    stopGame: function () {
        game.gameStarted = false;
    },
    sendMove: function (x, y) {
        socket.emit("move", {x: x, y: y, gameId: game.gameId});
    },
    reciveData: function (data) {
        game.clearLogs();
        game.drawBoardFromReciveData(data);
        game.playerTurn = ((data.turn == 1 && (game.playerSign == game.signType.WHITE) || data.turn == 2 && (game.playerSign == game.signType.BLACK)) ? 1 : 0);
        if(game.playerTurn)
            game.log("Your turn");
        else
            game.log("Opponent turn");
    },
    drawBoardFromReciveData: function (data) {
        for (var i = 0; i < game.settings.m; i++) {
            for (var j = 0; j < game.settings.n; j++) {
                if (data.board[i][j])
                    game.setSignOnField(i, j, (data.board[i][j] == 1 ? game.signType.WHITE : game.signType.BLACK));
            }
        }
    },
    clickOnField: function (x, y) {
        if (game.playerTurn && game.gameStarted)
            game.sendMove(x, y);
    },
    getMouseClickCoordinates: function (event) {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = this;
        do {
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        }
        while (currentElement = currentElement.offsetParent)
        {
            canvasX = event.pageX - totalOffsetX;
            canvasY = event.pageY - totalOffsetY;
        }
        game.clickOnField(Math.ceil(canvasX / 40) - 1, Math.ceil(canvasY / 40) - 1);
    },
    setSignOnField: function (x, y, type) {
        game.context.beginPath();
        game.context.arc(x * 40 + 20, y * 40 + 20, 15, 0, 2 * Math.PI, false);
        game.context.fillStyle = type;
        game.context.fill();
        game.context.stroke();
    },
    log: function (text) {
        var el = document.createElement('div');
        el.innerHTML = text;
        game.logs.appendChild(el);
    },
    clearLogs: function () {
        game.logs.innerHTML = '';
    }
}