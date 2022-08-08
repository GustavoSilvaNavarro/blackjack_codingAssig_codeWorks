$(document).ready(function() {
    //SELECTS
    const welcomeForm = $('#submitPlayersName');
    const inputPlayerName = $('#playerNameInput');
    const validationField = $('#validateField');
    const welcomeContainer = $('#containerWelcome');
    const gameContainer = $('#blackjackGame');
    const playerName = $('.playerName');
    const statusGame = $('#statusGame');
    const playerCardAmount = $('#playerCardAmount');
    const dealerCardAmount = $('#dealerCardAmount');
    const playerGameBoard = $('#playerGameBoard');
    const dealerGameBoard = $('#dealerGameBoard');
    const winsDisplay = $('#playerWins');
    const loosesDisplay = $('#playerLooses');
    const drawsDisplay = $('#playerDraws');
    const hitButton = $('#boardHitButton');
    const standButton = $('#boardStandButton');
    const dealButton = $('#boardDealButton');
    const matchStatusPlayer = $('#matchStatusPlayer');
    const matchStatusDealer = $('#matchStatusDealer');
    const splitButton = $('#boardSplitButton');
    const hit2Button = $('#boardHit2Button');
    const playerGameBoard2 = $('#playerGameBoard2');
    const playerCardAmount2 = $('#playerCardAmountLowerHand');
    const matchStatusPlayer2 = $('#matchStatusPlayer2');

    let firstTwoCards = [];

    //INITIAL CONDITIONS OF THE GAME
    class BlackjackGame { // code base on javascript tutorial from clever programmer and https://codesandbox.io/s/javascript-beginner-tutorial-blackjack-epegw?from-embed
        constructor() {
            this.wins = 0;
            this.looses = 0;
            this.draws = 0;
            this.isPlaying = true;
            this.isStand = false;
            this.turnIsOver = false;
            this.isSplitMode = false;
        };

        static cardIdentifiers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        static cardValues = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11]};
        static cardLinkImgs = {'2': 'https://res.cloudinary.com/dukuzakaw/image/upload/v1659540170/codeWorkAssigment/cards/2_nuqeji.webp', '3': 'https://res.cloudinary.com/dukuzakaw/image/upload/v1659540169/codeWorkAssigment/cards/3_hd5fiw.webp', '4': 'https://res.cloudinary.com/dukuzakaw/image/upload/v1659540169/codeWorkAssigment/cards/4_juu8k9.webp', '5': 'https://res.cloudinary.com/dukuzakaw/image/upload/v1659540169/codeWorkAssigment/cards/5_lpr3lr.webp', '6': 'https://res.cloudinary.com/dukuzakaw/image/upload/v1659540169/codeWorkAssigment/cards/6_kjbrtt.webp', '7': 'https://res.cloudinary.com/dukuzakaw/image/upload/v1659540169/codeWorkAssigment/cards/7_ttoult.webp', '8': 'https://res.cloudinary.com/dukuzakaw/image/upload/v1659540169/codeWorkAssigment/cards/8_pnv5gw.webp', '9': 'https://res.cloudinary.com/dukuzakaw/image/upload/v1659540170/codeWorkAssigment/cards/9_nuyjcf.webp', '10': 'https://res.cloudinary.com/dukuzakaw/image/upload/v1659540170/codeWorkAssigment/cards/10_msmos8.webp', 'J': 'https://res.cloudinary.com/dukuzakaw/image/upload/v1659540170/codeWorkAssigment/cards/J_ykco4o.webp', 'Q': 'https://res.cloudinary.com/dukuzakaw/image/upload/v1659540170/codeWorkAssigment/cards/Q_pued87.webp', 'K': 'https://res.cloudinary.com/dukuzakaw/image/upload/v1659540170/codeWorkAssigment/cards/K_j74qdn.webp', 'A': 'https://res.cloudinary.com/dukuzakaw/image/upload/v1659540170/codeWorkAssigment/cards/A_cegppd.webp'};

        pickACard = () => BlackjackGame.cardIdentifiers[Math.floor(Math.random() * 13)]; //code based on sample from MDN
    };

    //PLAYERS
    class Player {
        constructor(cardAmount, board, matchStatus) {
            this.cardAmount = cardAmount;
            this.board = board;
            this.score = 0;
            this.isBlackJack = false;
            this.matchStatus = matchStatus;
            this.hasAnAss = false;
        };
    };

    const game = new BlackjackGame();
    const userPlayer = new Player(playerCardAmount, playerGameBoard, matchStatusPlayer);
    const dealerPlayer = new Player(dealerCardAmount, dealerGameBoard, matchStatusDealer);
    let userPlayer2;

    welcomeForm.on('submit', function(e) {
        e.preventDefault();

        const expReg = /^[a-zA-Z\s]{3,60}$/; //code base on https://www.codegrepper.com/code-examples/whatever/regex+only+letters
        if(expReg.test(inputPlayerName.val())) {
            welcomeContainer.addClass('removeContainer');
            gameContainer.removeClass('removeContainer');
            playerName.text(inputPlayerName.val().trim());
        } else {
            validationField.removeClass('hideElement');
            validationField.addClass('showElement');
        };
    });

    // Show Cards
    const showCard = (currentPlayer, card) => { //code base on javascript tutorial from clever programmer
        if(currentPlayer.score <= 21) currentPlayer.board.append(`<img src=${BlackjackGame.cardLinkImgs[card]} alt="${card}" />`);
    };

    //DISPLAY OVERALL SCORES
    const displayGameScores = (gameScore, display) => {
        (gameScore < 10) ? display.text(`0${gameScore}`) : display.text(gameScore);
    };

    //DISPLAY PLAYERS SCORE
    const displayPlayersScore = player => {
        (player.score < 10) ? player.cardAmount.text(`0${player.score}`) : player.cardAmount.text(player.score.toString());
    };

    //COMPARE RESULTS AGAINS DEALER
    const scoreComparison = player => {
        if(((player.score > dealerPlayer.score) && player.score <= 21) || (dealerPlayer.score > 21 && player.score <= 21)) {
            game.wins++;
            player.cardAmount.text('You Won!');
            displayGameScores(game.wins, winsDisplay);
        };

        if(player.score === dealerPlayer.score) {
            game.draws++;
            player.cardAmount.text('You Drew!');
            displayGameScores(game.draws, drawsDisplay);
        };

        if((dealerPlayer.score <= 21) && (dealerPlayer.score > player.score) && player.score <= 21) {
            player.cardAmount.text('You Lost!');
            game.looses++;
            displayGameScores(game.looses, loosesDisplay)
        };
    };

    //DISPLAYS BUST
    const bustPlayer = player => {
        if(player.score > 21) {
            player.cardAmount.addClass('removeContainer');
            if(player.isBlackJack) {
                player.isBlackJack = false;
                player.matchStatus.text('Bust!');
                player.matchStatus.removeClass('blackjackPlayer');
                player.matchStatus.addClass('bustPlayer');
            } else {
                player.matchStatus.removeClass('removeContainer');
                player.matchStatus.text('Bust!');
                player.matchStatus.addClass('bustPlayer')
            };
        } else {
            displayPlayersScore(player);
        };
    };

    //Update the score
    const updateScore = (currentPlayer, card) => { //code base on javascript tutorial from clever programmer
        if(currentPlayer.score <= 21) {
            if(card === 'A') {
                if(currentPlayer.score + BlackjackGame.cardValues[card][1] <= 21) {
                    currentPlayer.score += BlackjackGame.cardValues[card][1];
                    currentPlayer.hasAnAss = true;
                    displayPlayersScore(currentPlayer);
                } else {
                    currentPlayer.score += BlackjackGame.cardValues[card][0];
                    if(currentPlayer.hasAnAss && currentPlayer.score > 21) {
                        currentPlayer.score -= 10;
                        currentPlayer.hasAnAss = false;
                        if(currentPlayer.isBlackJack) {
                            currentPlayer.isBlackJack = false;
                            currentPlayer.matchStatus.removeClass('blackjackPlayer');
                            currentPlayer.matchStatus.addClass('removeContainer');
                        };
                        bustPlayer(currentPlayer);
                    } else {
                        bustPlayer(currentPlayer);
                    };
                };
            } else {
                currentPlayer.score += BlackjackGame.cardValues[card];
                if(currentPlayer.hasAnAss && currentPlayer.score > 21) {
                    currentPlayer.score -= 10;
                    currentPlayer.hasAnAss = false;
                    if(currentPlayer.isBlackJack) {
                        currentPlayer.isBlackJack = false;
                        currentPlayer.matchStatus.removeClass('blackjackPlayer');
                        currentPlayer.matchStatus.addClass('removeContainer');
                    };
                    bustPlayer(currentPlayer);
                } else {
                    bustPlayer(currentPlayer);
                };
            };
        };
    };

    //GET GAME RESULT
    const getResult = () => {
        if(game.isPlaying && !game.turnIsOver) {
            if(userPlayer.score > 21) {
                statusGame.text('You Lost!');
                statusGame.css('color', '#c1121f');
                hitButton.prop('disabled', true);
                standButton.prop('disabled', true);
                dealButton.prop('disabled', false);
                game.isPlaying = false;
                game.turnIsOver = true;
                game.looses++;
                displayGameScores(game.looses, loosesDisplay);
            } else {
                if((userPlayer.score > dealerPlayer.score) || (dealerPlayer.score > 21)) {
                    game.wins++;
                    game.isPlaying = false;
                    game.turnIsOver = true;
                    statusGame.text('You Won!');
                    statusGame.css('color', '#008000');
                    displayGameScores(game.wins, winsDisplay);
                    dealButton.prop('disabled', false);
                };

                if(userPlayer.score === dealerPlayer.score) {
                    game.draws++;
                    game.isPlaying = false;
                    game.turnIsOver = true;
                    statusGame.text('You Drew!');
                    statusGame.css('color', '#FB8500');
                    displayGameScores(game.draws, drawsDisplay);
                    dealButton.prop('disabled', false);
                };

                if((dealerPlayer.score <= 21) && (dealerPlayer.score > userPlayer.score)) {
                    statusGame.text('You Lost!');
                    statusGame.css('color', '#c1121f');
                    dealButton.prop('disabled', false);
                    game.isPlaying = false;
                    game.turnIsOver = true;
                    game.looses++;
                    displayGameScores(game.looses, loosesDisplay);
                };
            };
        };
    };

    const getResultforSplitModeBust = (activePlayer, isDealer) => {
        if(game.isPlaying && !game.turnIsOver && game.isSplitMode) {
            if(activePlayer.score > 21 && !isDealer) {
                game.looses++;
                activePlayer.matchStatus.text('You Lost!');

                displayGameScores(game.looses, loosesDisplay)

                if(userPlayer.score > 21 && userPlayer2.score > 21) {
                    game.turnIsOver = true;
                    game.isPlaying = false;
                    dealButton.prop('disabled', false);
                    statusGame.text('End of the Round');
                    hit2Button.addClass('removeContainer');
                    hit2Button.prop('disabled', true);
                    standButton.prop('disabled', true);
                };

                if(userPlayer.score > 21 && userPlayer2.score < 21) {
                    hitButton.prop('disabled', true);            
                };
            };
        };

        if(isDealer) {
            scoreComparison(userPlayer);
            scoreComparison(userPlayer2);

            dealButton.prop('disabled', false);
            game.isPlaying = false;
            game.turnIsOver = true;
            statusGame.text('End of the Round');
        };
    };

    const clearScoreBoard = (player) => {
        if(player.matchStatus.hasClass('bustPlayer')) {
            player.matchStatus.text('Blackjack');
            player.matchStatus.removeClass('bustPlayer');
            player.matchStatus.addClass('removeContainer');

            player.cardAmount.removeClass('removeContainer');
            player.cardAmount.text('00');
        } else {
            player.cardAmount.text('00');
        };

        if(player.matchStatus.hasClass('blackjackPlayer')) {
            player.matchStatus.removeClass('blackjackPlayer');
            player.matchStatus.addClass('removeContainer');

            player.cardAmount.text('00');
        } else {
            player.cardAmount.text('00');
        };
    };

    //PIECE OF CODE GOT IT FROM https://www.delftstack.com/howto/javascript/javascript-wait-for-x-seconds/, generates a delay to wait x seconds in javascript
    const delay = time => new Promise(resolve => setTimeout(resolve, time));

    //FIRST CARDS TO SHOW UP
    const firstGame = (user, numberOfCards) => {
        if(!game.turnIsOver && game.isPlaying) {
            let i = 0;
            while(i < numberOfCards) {
                const card = game.pickACard();
                showCard(user, card);
                updateScore(user, card);
                i++;
                firstTwoCards.push(card);
            };

            if(user.score === 21 && !game.isSplitMode) {
                user.isBlackJack = true;
                user.matchStatus.removeClass('removeContainer');
                user.matchStatus.addClass('blackjackPlayer');
            };

            if(firstTwoCards.length > 1 && (BlackjackGame.cardValues[firstTwoCards[0]] === BlackjackGame.cardValues[firstTwoCards[1]]) && !game.isSplitMode) {
                splitButton.removeClass('removeContainer');
                splitButton.prop('disabled', false);
            };
        };
    };

    firstGame(userPlayer, 2);
    firstGame(dealerPlayer, 1);

    //HIT BUTTON FUNCTIONALITY
    hitButton.click(() => {
        if(game.isPlaying && !game.isStand && !game.turnIsOver) {
            (statusGame.text() === "Let's Play") ? statusGame.text('Playing...') : '';

            const newCard = game.pickACard();
            showCard(userPlayer, newCard);
            updateScore(userPlayer, newCard);

            if(!game.isSplitMode) {
                splitButton.prop('disabled', true);
                splitButton.addClass('removeContainer');
            };

            if(userPlayer.score > 21) {
                (game.isSplitMode) ? getResultforSplitModeBust(userPlayer, false) : getResult();
            };
        };
    });

    //DEALER PLAYS
    standButton.click(async () => {
        if(!game.isSplitMode) {
            hitButton.prop('disabled', true);
            if(!splitButton.hasClass('removeContainer')) {
                splitButton.prop('disabled', true);
                splitButton.addClass('removeContainer');
            };
        } else {
            hit2Button.addClass('removeContainer');
            hit2Button.prop('disabled', true);
        };

        standButton.prop('disabled', true);

        if(game.isPlaying && !game.turnIsOver && !game.isStand) {
            game.isStand = true;
            (statusGame.text() === "Let's Play") ? statusGame.text('Playing...') : '';

            while(dealerPlayer.score <= 16) {
                const newDealerCard = game.pickACard();
                showCard(dealerPlayer, newDealerCard);
                updateScore(dealerPlayer, newDealerCard);
                if(dealerPlayer.board[0].childElementCount === 2 && dealerPlayer.score === 21) {
                    dealerPlayer.isBlackJack = true;
                    dealerPlayer.matchStatus.removeClass('removeContainer');
                    dealerPlayer.matchStatus.addClass('blackjackPlayer');
                };

                await delay(1000); // codebase on javascript tutorial from clever programmer
            };

            (game.isSplitMode) ? getResultforSplitModeBust(dealerPlayer, true) : getResult();
        };
    });

    //RESTART GAME
    dealButton.click(() => {
        if(game.turnIsOver && !game.isPlaying) {
            dealButton.prop('disabled', true);
            const userImg = userPlayer.board.children('img'); // code base on jquery documentation
            const dealerImg = dealerPlayer.board.children('img');

            for(let i = 0; i < userImg.length; i++) { //code base on javascript tutorial clever programmer
                userImg[i].remove();
            };

            for(let i = 0; i < dealerImg.length; i++) { //code base on javascript tutorial clever programmer
                dealerImg[i].remove();
            };

            userPlayer.score = 0;
            userPlayer.isBlackJack = false;
            userPlayer.hasAnAss = false;
            dealerPlayer.score = 0;
            dealerPlayer.isBlackJack = false;
            dealerPlayer.hasAnAss = false;

            game.isPlaying = true;
            game.turnIsOver = false;
            game.isStand = false;

            firstTwoCards = [];

            statusGame.text("Let's Play");
            statusGame.css('color', '#003566');

            clearScoreBoard(userPlayer);
            clearScoreBoard(dealerPlayer);

            if(game.isSplitMode) {
                const userImg2 = userPlayer2.board.children('img');

                for(let i = 0; i < userImg2.length; i++) { //code base on javascript tutorial clever programmer
                    userImg2[i].remove();
                };
    
                clearScoreBoard(userPlayer2);
                userPlayer2.board.addClass('removeContainer');
                userPlayer2.cardAmount.addClass('removeContainer');
                userPlayer2.score = 0;
                userPlayer2.isBlackJack = false;
                userPlayer2.hasAnAss = false;
            };

            game.isSplitMode = false;

            firstGame(userPlayer, 2);
            firstGame(dealerPlayer, 1);

            hitButton.prop('disabled', false);
            standButton.prop('disabled', false);
        };
    });

    //SPLIT YOUR CARDS
    splitButton.click(() => {
        if(!game.turnIsOver && !game.isStand && !game.isSplitMode) {
            game.isSplitMode = true;
            userPlayer2 = new Player(playerCardAmount2, playerGameBoard2, matchStatusPlayer2);

            (statusGame.text() === "Let's Play") ? statusGame.text('Playing...') : '';

            userPlayer.board.children('img')[1].remove();
            userPlayer2.board.removeClass('removeContainer');
            userPlayer2.cardAmount.removeClass('removeContainer');
            userPlayer2.board.append(`<img src=${BlackjackGame.cardLinkImgs[firstTwoCards[1]]} alt="${firstTwoCards[1]}" />`);

            if(firstTwoCards[0] === 'A' && firstTwoCards[1] === 'A') {
                userPlayer.score = BlackjackGame.cardValues[firstTwoCards[0]][1];
                userPlayer2.score = BlackjackGame.cardValues[firstTwoCards[1]][1];
                userPlayer2.hasAnAss = true;

                firstGame(userPlayer, 1);
                firstGame(userPlayer2, 1);
                hitButton.prop('disabled', true);
                splitButton.prop('disabled', true);
                splitButton.addClass('removeContainer')
            } else {
                userPlayer.score = BlackjackGame.cardValues[firstTwoCards[0]];
                userPlayer2.score = BlackjackGame.cardValues[firstTwoCards[1]];

                splitButton.prop('disabled', true);
                splitButton.addClass('removeContainer');

                hit2Button.removeClass('removeContainer');
                hit2Button.prop('disabled', false);
            };

            displayPlayersScore(userPlayer);
            displayPlayersScore(userPlayer2);
        };
    });

    hit2Button.click(() => {
        if(game.isPlaying && !game.isStand && !game.turnIsOver) {
            (statusGame.text() === "Let's Play") ? statusGame.text('Playing...') : '';
            hitButton.prop('disabled', true);
            const newCard2 = game.pickACard();
            showCard(userPlayer2, newCard2);
            updateScore(userPlayer2, newCard2);

            if(userPlayer2.score > 21) {
                getResultforSplitModeBust(userPlayer2, false);
                hit2Button.prop('disabled', true);
            };
        };
    });
});