const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

const gameState = {};

const isBuyable = (position) => {
    const nonBuyable = [0, 2, 4, 7, 10, 17, 20, 22, 30, 33, 36, 38]; 
    return !nonBuyable.includes(position);
};

io.on('connection', (socket) => {
    console.log(`Player connected! Socket ID: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data.room);
        
        if (!gameState[data.room]) {
            gameState[data.room] = { players: {}, ownership: {} };
        }
        
        // NEW: Added "debt" to track ATM loans
        if (!gameState[data.room].players[data.username]) {
            gameState[data.room].players[data.username] = {
                position: 0,
                cash: 15000,
                debt: 0 
            };
        }

        io.to(data.room).emit('update_state', gameState[data.room]);
    });

    socket.on('roll_dice', (data) => {
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        
        let player = gameState[data.room].players[data.username];
        player.position += total;

        if (player.position > 39) {
            player.position = player.position % 40;
            player.cash += 1500; // Pass GO
        }

        const pos = player.position;

        // Taxes
        if (pos === 4) player.cash -= 2000; 
        if (pos === 38) player.cash -= 1000; 

        // Pay Rent
        const owner = gameState[data.room].ownership[pos];
        if (owner && owner !== data.username) {
            const rent = (pos * 100 + 1000) * 0.15;
            player.cash -= rent;
            gameState[data.room].players[owner].cash += rent;
        }

        io.to(data.room).emit('dice_result', { username: data.username, dice1, dice2, total });
        io.to(data.room).emit('update_state', gameState[data.room]);
    });

    socket.on('buy_property', (data) => {
        let player = gameState[data.room].players[data.username];
        const pos = player.position;
        const price = pos * 100 + 1000; 

        if (isBuyable(pos) && !gameState[data.room].ownership[pos] && player.cash >= price) {
            player.cash -= price;
            gameState[data.room].ownership[pos] = data.username;
            io.to(data.room).emit('update_state', gameState[data.room]);
        }
    });

    // --- NEW: ATM LOAN SYSTEM ---
    socket.on('take_loan', (data) => {
        let player = gameState[data.room].players[data.username];
        const loanAmount = 5000;
        const interest = loanAmount * 0.08; // 8% Interest
        
        player.cash += loanAmount;
        player.debt += (loanAmount + interest);
        io.to(data.room).emit('update_state', gameState[data.room]);
    });

    socket.on('repay_loan', (data) => {
        let player = gameState[data.room].players[data.username];
        if (player.cash >= player.debt && player.debt > 0) {
            player.cash -= player.debt;
            player.debt = 0; // Cleared!
            io.to(data.room).emit('update_state', gameState[data.room]);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
    });
});

server.listen(5000, () => console.log(`🚀 Game Server running on port 5000`));