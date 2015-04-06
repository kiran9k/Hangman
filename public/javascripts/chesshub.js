$( document ).ready(function() {

    /*
     * When the user is logged in, it's name is loaded in the "data" attribute of the "#loggedUser" element.
     * This name is then passed to the socket connection handshake query
     */
    var username;
    var time_out=300;//5 minutes in seconds
    var domain_url="http://192.168.12.77:3000";// The url where the game is to be run (dont include '/' at the end)
    var enable_time_out=true;// play with timeout ? (true/false)
    var enable_time_add=false;//add 10 sec to every valid move if enabled( Blitz mode rules)
    if($("#loggedUser").length) {
        username = $("#loggedUser").data("user");
    } else {
        username = "Anonymous";
    }

    // socket used for real time games
    var socket = io(domain_url, { query: 'user=' + username });

    //socket used to broadcast live games on tv page
    var tvSocket = io(domain_url+'/tv');

    // socket used to broadcast events to monitoring page
    var monitorSocket = io(domain_url+'/monitor');

    // Puzzle of the day: initialize a chess board with puzzle data
    if ($("#pod").length) {
        var pod = new ChessBoard('pod', $("#pod").data('fen'));
        $('#podSolution').popover();
    }

    /*
     * Show error message on login failure
     */
    if ($("#loginError").length && !$("#loginError").is(':empty')) {

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-top'
        }).post({
            message: $("#loginError").html(),
            type: 'error',
            showCloseButton: true,
            hideAfter: 10
        });
    }

    /*
     * Show error message on registration failure
     */
    if ($("#registerError").length && !$("#registerError").is(':empty')) {

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-top'
        }).post({
            message: $("#registerError").html(),
            type: 'error',
            showCloseButton: true,
            hideAfter: 10
        });
    }

    /*
     * Show message on successful logout
     */
    if ($("#logoutSuccess").length && !$("#logoutSuccess").is(':empty')) {

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-top'
        }).post({
            message: $("#logoutSuccess").html(),
            type: 'success',
            showCloseButton: true,
            hideAfter: 10
        });
    }

    /*
     * Show welcome message on registration success
     */
    if ($("#registerSuccess").length && !$("#registerSuccess").is(':empty')) {

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-top'
        }).post({
                message: $("#registerSuccess").html(),
                type: 'success',
                showCloseButton: true,
                hideAfter: 10
            });
    }

    /*
     * Show welcome message on login success
     */
    if ($("#welcomeMessage").length && !$("#welcomeMessage").is(':empty')) {

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-top'
        }).post({
            message: $("#welcomeMessage").html(),
            type: 'success',
            showCloseButton: true,
            hideAfter: 10
        });
    }

    /*
     * Show message on account update success
     */
    if ($("#updateStatus").length && !$("#updateStatus").is(':empty')) {

        var ok = $("#updateStatus").data('ok');
        var message = $("#updateStatus").html();

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-top'
        }).post({
            message: message,
            type: ok ? 'success' : 'error',
            showCloseButton: true,
            hideAfter: 10
        });
    }

    /*
     *  Show chats to be displayed
     *  Chats are never stored .
     *  So , chats are lost if any page is reloaded .
     *  Chat pops up whenver there's a new message
     *  TODO :Store chat conversations .
     */
    var socket1 = io();
    $('.chat-form').submit(function(){

        if( $('#m').val().length>0)
        {
            socket1.emit('chat message', username+' : '+$('#m').val());
        }
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        //new chat message ..pop the chats
        $(".chat").show();
        document.getElementById('chat-active').className='active';
        $('#messages').append($('<li>').text(msg));
    });

    /*
     *  show or hide the chats window
     */
    showhideChat= function () {
        $(".chat").toggle();
        if($(".chat").is(":visible") == true)//if chat is visible then make Chats menu active
        {
            document.getElementById('chat-active').className='active';
        }
        else
            document.getElementById('chat-active').className='inactive';

    };
    //initially hide chat
    $(".chat").hide();
    document.getElementById('chat-active').className='inactive';//make chat inactive

    /*
     * Game page
     */
    if ($("#board").length) {

        /*
         * Initialize a new game
         */
        var game = new Chess();
        var pgnEl = $('#pgn');
        var token = $("#board").data('token');
        var side = $("#board").data('side');
        var opponentSide = side === "black" ? "white" : "black";

	    /*
         * Timer : displays time taken by each player while making moves
         * Displays time remaining for each player
         */
        var black=false;
        var white=false;
        var timer=function(time_set)
        {
             /*
             added condtion to checkout for gameover
             */
            var possibleMoves = game.moves();
            //alert(game.game_over());
            // if the game is over, reload a new game
            if (game.in_draw() === true ) {
                $('#gameResult').html('Game is a draw !');
                $('#gameResultPopup').modal({
                    keyboard: false,
                    backdrop: 'static'
                });
            }

            if(game.turn().toString()=='w')
            {
                if(game.game_over() === true || possibleMoves.length===0)
                {
                    $('#gameResult').html('Game Over.Black Won !');
                    $('#gameResultPopup').modal({
                        keyboard: false,
                        backdrop: 'static'
                    });
                }
                if(enable_time_out)
                {
                    time_set[0] -= 1;
                    if (black) {
                        if (enable_time_add)//if enabled  will add 10 sec to each valid move
                            time_set[1] += 10;
                        black = false;

                    }
                    white = true;
                    if (time_set[0] <= 0) {
                        //handle time out
                        $('#gameResult').html('TimeOut! Black Won !');
                        $('#gameResultPopup').modal({
                            keyboard: false,
                            backdrop: 'static'
                        });
                        clearInterval(timer_interval);
                    }
                }
            }
            if(game.turn().toString()=='b')
            {
                if(game.game_over() === true || possibleMoves.length===0)
                {
                    $('#gameResult').html('Game Over. White Won !');
                    $('#gameResultPopup').modal({
                        keyboard: false,
                        backdrop: 'static'
                    });
                }
                if(enable_time_out)
                {
                    time_set[1] -= 1;
                    if (white) {
                        if (enable_time_add)//if enabled  will add 10 sec to each valid move
                            time_set[0] = time_set[0] + 10;
                        white = false;
                    }
                    black = true;
                    if (time_set[1] <= 0) {
                        //handle time out
                        $('#gameResult').html('TimeOut!  White Won !');
                        $('#gameResultPopup').modal({
                            keyboard: false,
                            backdrop: 'static'
                        });
                        clearInterval(timer_interval);
                    }
                }
            }
            if(enable_time_out)
            {
                $("#timeb").html(("00" + Math.floor(time_set[1] / 60)).slice(-2) + ":" + ("00" + time_set[1] % 60).slice(-2));
                $("#timew").html(("00" + Math.floor(time_set[0] / 60)).slice(-2) + ":" + ("00" + time_set[0] % 60).slice(-2));
            }
            return time_set;
        };

        /*
         * When a piece is dragged, check if it the current player has the turn
         */
        var onDragStart = function(source, piece, position, orientation) {
            if (game.game_over() === true ||
                (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
                (game.turn() !== side.charAt(0) )) {
                return false;
            }
        };

        /*
         * When a piece is dropped, check if the move is legal
         */
        var onDrop = function(source, target, piece, newPos, oldPos, orientation) {
            // see if the move is legal
            var move = game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });

            // illegal move
            if (move === null) return 'snapback';
            pgnEl.html(game.pgn());
            $('.turn').removeClass("fa fa-spinner");
            $('#turn-' + game.turn()).addClass("fa fa-spinner");
            socket.emit('new-move', {
                token: token,
                source: source,
                target: target,
                piece: piece,
                newPosition: ChessBoard.objToFen(newPos),
                oldPosition: ChessBoard.objToFen(oldPos)
            });
        };

        // update the board position after the piece snap
        // for castling, en passant, pawn promotion
        var onSnapEnd = function() {
            board.position(game.fen());
        };

        /*
         * Initialize a new board
         */
        var cfg = {
            draggable: true,
            position: 'start',
            moveSpeed: 'slow',
            onDragStart: onDragStart,
            onSnapEnd: onSnapEnd,
            onDrop: onDrop,
            snapbackSpeed: 500,
            snapSpeed: 150,
            orientation: side
        };
        //var board = new ChessBoard('board', cfg);

        /*
         * When the game page is loaded, fire a join event to join the game room
         */
        socket.emit('join', {
            'token': token,
            'side': side
        });

        /*
         * When a new game is created, the game creator should wait for an opponent to join the game
         */
        socket.on('wait', function () {
            var url = domain_url+"/game/" + token + "/" + opponentSide;
            $('#gameUrl').html(url);
            $('#gameUrlPopup').modal({ // show modal popup to wait for opponent
                keyboard: false,
                backdrop: 'static'
            });
        });

        /*
         * A second player has joined the game => the game can start
         */
        socket.on('ready', function (data) {
	    //intialize the timer
            var time_sets=[0,0];
            time_sets[0]=time_out;
            time_sets[1]=time_out;
            timer_interval=setInterval(function(){ time_sets=timer(time_sets)}, 1000);//repeat every second
            $('#turn-w').addClass("fa fa-spinner");
            $('#player-white').html(data.white);
            $('#player-black').html(data.black);
            $('#gameUrlPopup').modal('hide');
        });

        /*
         * A new move has been made by a player => update the UI
         */
        socket.on('new-move', function(data){
            game.move({ from: data.source, to: data.target });
            board.position( game.fen() );
            pgnEl.html(game.pgn());
            $('.turn').removeClass("fa fa-spinner");
            $('#turn-' + game.turn()).addClass("fa fa-spinner");
        });

        /*
         * A player resigns the game
         */
        $('#resignButton').click(function (ev) {
            ev.preventDefault();
            socket.emit('resign', {
                'token': token,
                'side': side
            });
        });

        /*
         * Notify opponent resignation
         */
        socket.on('player-resigned', function (data) {
            $('#gameResult').html(data.side + ' resigned.');
            $('#gameResultPopup').modal({
                keyboard: false,
                backdrop: 'static'
            });
        });

        /*
         * Notify opponent disconnection
         */
        socket.on('opponent-disconnected', function () {
            $('#gameResult').html('Your opponent has been disconnected.');
            $('#gameResultPopup').modal({
                keyboard: false,
                backdrop: 'static'
            });
        });

        /*
         * Notify that the game is full => impossible to join the game
         */
        socket.on('full', function () {
            alert("This game has been already joined by another person.");
            window.location = '/';
        });

    }

    /*
     * TV page
     */
    if ($("#trg").length) {
        var trg = new ChessBoard('trg', 'start'); // initialize a chess board with the top rated live game
        tvSocket.on('new-top-rated-game-move', function(data){
            trg.position(data.fen);
            if ($("#tv-game-details").length) {
                $("#pgn").html(data.pgn);
                $("#pgn").scrollTop($("#pgn")[0].scrollHeight);
                $('.turn').removeClass("fa fa-spinner");
                $('#turn-' + data.turn).addClass("fa fa-spinner");
            }
        });
    }

    /*
     * Monitoring page
     */
    if ($("#monitor").length) {

        var nbUsers, nbGames, totalGames;

        monitorSocket.on('update', function(data) {
            /*
             * load monitoring event data
             */
            nbUsers = data.nbUsers;
            nbGames = data.nbGames;
            totalGames = nbGames; // todo: should be set from data.totalGames;
            $("#nbUsers").html(nbUsers);
            $("#nbGames").html(nbGames);
            $("#totalGames").html(totalGames);

            /*
             * Update the status chart
             */
            var chart = $('#chart').highcharts();
            chart.series[0].addPoint(nbUsers, true, true);
            chart.series[1].addPoint(nbGames, true, true);
        });

        $('#chart').highcharts({
            chart: {
                type: 'spline',
                renderTo: 'container',
                defaultSeriesType: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10
            },
            title: {
                text: ''
            },
            yAxis: {
                title: {
                    text: 'Total'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                enabled: true
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'active users',
                data: [0,0,0,0,0,0]
            },{
                name: 'active games',
                data: [0,0,0,0,0,0]
            }]
        });

    }

    /*
     * Search page
     */
    if ($("#searchGameForm")) {
        $( "#searchGameFormSubmit" ).on("click", function( event ) {
            $.ajax({
                type: "POST",
                url: domain_url+"/search",
                data: {
                    white: $( "input[name$='white']" ).val(),
                    black: $( "input[name$='black']" ).val(),
                    content: $( "input[name$='content']" ).val(),
                    result: $( "input[name$='result']" ).val()
                },
                success: function (data){
                    var games = data.games;
                    console.log(games.length);
                    $('#foundGamesTable tbody tr').remove();
                    for (var i = 0; i < games.length; i++) {
                        var game = "<tr>" +
                            "<td>" + games[i]._id + "</td>" +
                            "<td>" + games[i]._source.white + "</td>" +
                            "<td>" + games[i]._source.black + "</td>" +
                            "<td>" + games[i]._source.result + "</td>" +
                            "<td>" + "<a title='Not implemented' href='#'><i class='fa fa-eye'></i> Preview</a>" + "</td>" +
                            "</tr>";
                        $('#foundGamesTable tbody').append(game);
                    }
                    $('#totalFoundGames').html(games.length);
                    $("#searchResult").show();
                },
                error: function() {
                    alert("Error while searching games!");
                }
            });
            event.preventDefault();
        });
    }
});

