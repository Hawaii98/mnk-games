var game = {
    obj: document.getElementById('game'),
    canv: document.createElement('canvas'),
    context: null,
    settings: {},
    signType: {WHITE: "silver", BLACK: "black"},
    playerSign: null,
    playerTurn: false,
    prepareGame: function (m, n, k, turn, sign) {
        this.settings = {m: m, n: n, k: k};
        this.playerTurn = turn;
        this.playerSign = (sign == "white" ? this.signType.WHITE : this.signType.BLACK),
        this.canv.id = 'gameElement';
        this.canv.height = this.settings.n*40+1;
        this.canv.width = this.settings.n*40+1;
        this.obj.appendChild(this.canv);
        this.context = this.canv.getContext('2d');
        this.canv.addEventListener("mousedown", game.getMouseClickCoordinates, false);
        this.drawBoard(this.settings.m, this.settings.n);
    },
    drawBoard: function (m, n) {
        for (var x = 0; x <= m; x++) {
            this.context.moveTo(0.5 + x*40, 0);
            this.context.lineTo(0.5 + x*40, n*40);
        }
        for (var x = 0; x <= n; x++) {
            this.context.moveTo(0, 0.5 + x*40);
            this.context.lineTo(m*40, 0.5 + x*40);
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
    clickOnField: function (x, y) {
        if(game.playerTurn)
            game.setSignOnField(x, y, game.playerSign);
    },
    getMouseClickCoordinates: function (event) {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = this;
        do{
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        }
        while(currentElement = currentElement.offsetParent){
            canvasX = event.pageX - totalOffsetX;
            canvasY = event.pageY - totalOffsetY;
        }
        game.clickOnField(Math.ceil(canvasX/40)-1, Math.ceil(canvasY/40)-1);
    },
    setSignOnField: function (x, y, type) {
        game.context.beginPath();
        game.context.arc(x*40+20, y*40+20, 15, 0, 2 * Math.PI, false);
        game.context.fillStyle = type;
        game.context.fill();
        game.context.stroke();
    }
}