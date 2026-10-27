import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { Chess } from 'chess.js';

const socket = io.connect("http://localhost:5000", { reconnectionAttempts: 3 });

const indiaBoardSpaces=[{name:"GO",type:"corner",icon:"🚀"},{name:"Guwahati",color:"#8B4513",icon:"🐘"},{name:"Community Chest",type:"chance",icon:"💎"},{name:"Bhubaneswar",color:"#8B4513",icon:"🏛️"},{name:"Income Tax",type:"tax",icon:"💼"},{name:"Chennai Ctrl",type:"station",icon:"🚄"},{name:"Panaji",color:"#87CEEB",icon:"🌴"},{name:"Chance",type:"chance",icon:"🔮"},{name:"Agra",color:"#87CEEB",icon:"🕌"},{name:"Patna",color:"#87CEEB",icon:"🌾"},{name:"JAIL",type:"corner",icon:"🔒"},{name:"Jaipur",color:"#FF1493",icon:"🏰"},{name:"💡 Electric",type:"utility",icon:"⚡"},{name:"Udaipur",color:"#FF1493",icon:"🌊"},{name:"Ludhiana",color:"#FF1493",icon:"⚙️"},{name:"Howrah",type:"station",icon:"🌉"},{name:"Chandigarh",color:"#FFA500",icon:"🏙️"},{name:"Community Chest",type:"chance",icon:"💎"},{name:"Amritsar",color:"#FFA500",icon:"🛕"},{name:"Shimla",color:"#FFA500",icon:"🏔️"},{name:"FREE PARKING",type:"corner",icon:"🅿️"},{name:"Kochi",color:"#FF0000",icon:"🥥"},{name:"Chance",type:"chance",icon:"🔮"},{name:"Bengaluru",color:"#FF0000",icon:"💻"},{name:"Hyderabad",color:"#FF0000",icon:"🍛"},{name:"New Delhi",type:"station",icon:"🏛️"},{name:"Kanpur",color:"#FFD700",icon:"🏭"},{name:"Lucknow",color:"#FFD700",icon:"🍢"},{name:"🚰 Water",type:"utility",icon:"💧"},{name:"Surat",color:"#FFD700",icon:"💍"},{name:"GO TO JAIL",type:"corner",icon:"🚨"},{name:"Pune",color:"#008000",icon:"🎓"},{name:"Ahmedabad",color:"#008000",icon:"🧵"},{name:"Community Chest",type:"chance",icon:"💎"},{name:"Kolkata",color:"#008000",icon:"🚊"},{name:"Mumbai CST",type:"station",icon:"🚉"},{name:"Chance",type:"chance",icon:"🔮"},{name:"Chennai",color:"#00008B",icon:"🎬"},{name:"Luxury Tax",type:"tax",icon:"👑"},{name:"Mumbai",color:"#00008B",icon:"🌆"}];
const globalBoardSpaces=[{name:"GO",type:"corner",icon:"🚀"},{name:"Havana",color:"#8B4513",icon:"🇨🇺"},{name:"Community Chest",type:"chance",icon:"💎"},{name:"Madrid",color:"#8B4513",icon:"🇪🇸"},{name:"Income Tax",type:"tax",icon:"📉"},{name:"North Station",type:"station",icon:"🚆"},{name:"Athens",color:"#87CEEB",icon:"🇬🇷"},{name:"Chance",type:"chance",icon:"❓"},{name:"Dublin",color:"#87CEEB",icon:"🇮🇪"},{name:"Copenhagen",color:"#87CEEB",icon:"🇩🇰"},{name:"JAIL",type:"corner",icon:"⛓️"},{name:"Paris",color:"#FF1493",icon:"🇫🇷"},{name:"💡 Electric",type:"utility",icon:"⚡"},{name:"Rome",color:"#FF1493",icon:"🇮🇹"},{name:"Berlin",color:"#FF1493",icon:"🇩🇪"},{name:"West Station",type:"station",icon:"🚆"},{name:"Toronto",color:"#FFA500",icon:"🇨🇦"},{name:"Community Chest",type:"chance",icon:"📦"},{name:"Seoul",color:"#FFA500",icon:"🇰🇷"},{name:"Beijing",color:"#FFA500",icon:"🇨🇳"},{name:"FREE PARKING",type:"corner",icon:"🅿️"},{name:"Dubai",color:"#FF0000",icon:"🇦🇪"},{name:"Chance",type:"chance",icon:"❓"},{name:"Sydney",color:"#FF0000",icon:"🇦🇺"},{name:"Singapore",color:"#FF0000",icon:"🇸🇬"},{name:"South Station",type:"station",icon:"🚆"},{name:"London",color:"#FFD700",icon:"🇬🇧"},{name:"Tokyo",color:"#FFD700",icon:"🇯🇵"},{name:"🚰 Water",type:"utility",icon:"💧"},{name:"Hong Kong",color:"#FFD700",icon:"🇭🇰"},{name:"GO TO JAIL",type:"corner",icon:"🚨"},{name:"San Francisco",color:"#008000",icon:"🌉"},{name:"Los Angeles",color:"#008000",icon:"🌴"},{name:"Community Chest",type:"chance",icon:"📦"},{name:"Chicago",color:"#008000",icon:"🍕"},{name:"East Station",type:"station",icon:"🚆"},{name:"Chance",type:"chance",icon:"❓"},{name:"Washington DC",color:"#00008B",icon:"🦅"},{name:"Luxury Tax",type:"tax",icon:"💍"},{name:"New York",color:"#00008B",icon:"🗽"}];

const getGridPosition = (index) => {
  if (index === 0) return { gridColumn: 11, gridRow: 11 }; if (index > 0 && index < 10) return { gridColumn: 11 - index, gridRow: 11 };
  if (index === 10) return { gridColumn: 1, gridRow: 11 }; if (index > 10 && index < 20) return { gridColumn: 1, gridRow: 11 - (index - 10) };
  if (index === 20) return { gridColumn: 1, gridRow: 1 }; if (index > 20 && index < 30) return { gridColumn: 1 + (index - 20), gridRow: 1 };
  if (index === 30) return { gridColumn: 11, gridRow: 1 }; if (index > 30 && index < 40) return { gridColumn: 11, gridRow: 1 + (index - 30) };
};

const getTileDirection = (index) => {
  if (index > 20 && index < 30) return 'column'; if (index > 0 && index < 10) return 'column-reverse'; 
  if (index > 10 && index < 20) return 'row-reverse'; if (index > 30 && index < 40) return 'row'; return 'column'; 
};

const getColorStyle = (index, color) => {
  if (!color) return null;
  if (index > 20 && index < 30) return { height: '12px', width: '100%', backgroundColor: color, marginTop: 'auto', borderRadius: '0 0 3px 3px' };
  if (index > 0 && index < 10) return { height: '12px', width: '100%', backgroundColor: color, marginBottom: 'auto', borderRadius: '3px 3px 0 0' };
  if (index > 10 && index < 20) return { width: '12px', height: '100%', backgroundColor: color, marginRight: 'auto', borderRadius: '3px 0 0 3px' };
  if (index > 30 && index < 40) return { width: '12px', height: '100%', backgroundColor: color, marginLeft: 'auto', borderRadius: '0 3px 3px 0' };
  return { height: '12px', width: '100%', backgroundColor: color };
};

const tokenColors = ["#f43f5e", "#38bdf8", "#facc15", "#34d399"];
const nonBuyable = [0, 2, 4, 7, 10, 17, 20, 22, 30, 33, 36, 38]; 
const isBuyable = (pos) => !nonBuyable.includes(pos);

const themes = {
  classic: { name: "Quantum Obsidian (Default)", bg: "#030712", text: "#f8fafc", accent: "#fbbf24", glassBg: "rgba(15, 23, 42, 0.45)", tileBg: "rgba(30, 41, 59, 0.55)", border: "rgba(251, 191, 36, 0.25)" },
  neon: { name: "Cyber Matrix (Unlock: 2 Online Wins)", bg: "#02020a", text: "#22d3ee", accent: "#f43f5e", glassBg: "rgba(10, 10, 32, 0.45)", tileBg: "rgba(24, 24, 60, 0.55)", border: "rgba(244, 63, 94, 0.3)", minOnlineWins: 2 },
  royal: { name: "Imperial Gold (Unlock: 3 Local Wins)", bg: "#0c0602", text: "#fde047", accent: "#f97316", glassBg: "rgba(26, 12, 4, 0.45)", tileBg: "rgba(45, 22, 10, 0.55)", border: "rgba(249, 115, 22, 0.3)", minPassWins: 3 },
  emerald: { name: "Starlight Vault (Unlock: 2 PC Wins)", bg: "#010a03", text: "#86efac", accent: "#059669", glassBg: "rgba(4, 20, 8, 0.45)", tileBg: "rgba(10, 42, 16, 0.55)", border: "rgba(5, 150, 105, 0.3)", minSingleWins: 2 },
  midnight: { name: "Aether Void (Unlock: 5 Total Wins)", bg: "#030305", text: "#e2e8f0", accent: "#c084fc", glassBg: "rgba(14, 14, 22, 0.45)", tileBg: "rgba(28, 28, 42, 0.55)", border: "rgba(192, 132, 252, 0.3)", minTotalWins: 5 },
  crimson: { name: "Blood Moon (Unlock: 10 Total Wins)", bg: "#1a0505", text: "#fecaca", accent: "#ef4444", glassBg: "rgba(40, 10, 10, 0.45)", tileBg: "rgba(60, 15, 15, 0.55)", border: "rgba(239, 68, 68, 0.3)", minTotalWins: 10 },
  ocean: { name: "Deep Abyss (Unlock: 15 Total Wins)", bg: "#041e2a", text: "#cffafe", accent: "#06b6d4", glassBg: "rgba(6, 40, 55, 0.45)", tileBg: "rgba(10, 60, 80, 0.55)", border: "rgba(6, 182, 212, 0.3)", minTotalWins: 15 }
};

const ancientArtifactsList = [
  { name: "🏺 Indus Valley Vase", value: 12000, era: "2500 BCE" },
  { name: "🪙 Chola Gold Coin", value: 25000, era: "10th Century" },
  { name: "📜 Sanskrit Palm-leaf", value: 18000, era: "12th Century" }
];

function App() {
  const [currentView, setCurrentView] = useState('menu'); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile');
  const [username, setUsername] = useState("Abhi"); 
  const [room, setRoom] = useState("");
  const [lastRoll, setLastRoll] = useState(null);
  
  const [players, setPlayers] = useState({});
  const [ownership, setOwnership] = useState({});
  const [artifactVault, setArtifactVault] = useState([]);
  
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [countdown, setCountdown] = useState(null); 
  const [boardEdition, setBoardEdition] = useState("India");
  const [isRolling, setIsRolling] = useState(false);
  
  const [diceDisplay, setDiceDisplay] = useState({d1: 1, d2: 1});

  // --- SIKANDAR & MINI-GAMES STATE ---
  const [sikandarModal, setSikandarModal] = useState(false);
  const [activeGameSession, setActiveGameSession] = useState(null); 
  const [arenaOpponent, setArenaOpponent] = useState(null); 
  const [arenaHumanOpponent, setArenaHumanOpponent] = useState(null);
  const [arenaStreak, setArenaStreak] = useState(0);
  const [arenaStatus, setArenaStatus] = useState('idle'); 
  
  const [playerHand, setPlayerHand] = useState([]);
  const [oppHand, setOppHand] = useState([]);
  const [pattiTurn, setPattiTurn] = useState("");
  const [pattiCardsSeen, setPattiCardsSeen] = useState({});
  const [pattiPot, setPattiPot] = useState(0);
  const [pattiStatus, setPattiStatus] = useState("Place your boot amount to deal.");
  const [showdownResult, setShowdownResult] = useState(null);

  const [chessGame, setChessGame] = useState(new Chess());
  const [chessBoardState, setChessBoardState] = useState([]);
  const [selectedChessSquare, setSelectedChessSquare] = useState(null);
  const [chessTurn, setChessStatus] = useState("White's turn.");

  // --- AUCTION HOUSE STATE ---
  const [auctionModal, setAuctionModal] = useState(false);
  const [auctionOpponent, setAuctionOpponent] = useState(null); 
  const [auctionHumanOpponent, setAuctionHumanOpponent] = useState(null);
  const [auctionStreak, setAuctionStreak] = useState(0);
  const [auctionStatus, setAuctionStatus] = useState('idle'); 
  const [auctionProperty, setAuctionProperty] = useState({ name: "Mumbai Empire", price: 5000, index: 39 });
  const [auctionTurn, setAuctionTurn] = useState("");
  const [opponentBid, setOpponentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);

  const [scores, setScores] = useState({ onlineWins: 4, onlineLosses: 2, passWins: 8, passLosses: 3, singleWins: 2, singleLosses: 1 });
  const [currentTheme, setCurrentTheme] = useState('classic');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  const [isLocalMode, setIsLocalMode] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false); 
  const [localNames, setLocalNames] = useState(["Abhi", "Player 2", "", ""]);
  const [hasRolledThisTurn, setHasRolledThisTurn] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    socket.on("connect", () => {});
    socket.on("disconnect", () => {});
    socket.on("dice_result", (data) => { if(!isLocalMode){ setIsRolling(true); setTimeout(() => { setLastRoll(data); setIsRolling(false); }, 800); } });
    socket.on("update_state", (roomState) => { if(!isLocalMode){ setPlayers(roomState.players); setOwnership(roomState.ownership); } });
    return () => { socket.off("connect"); socket.off("disconnect"); socket.off("dice_result"); socket.off("update_state"); };
  }, [isLocalMode]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCurrentView('board');
      setCountdown(null);
    }
  }, [countdown]);

  useEffect(() => {
    let interval;
    if (isRolling) {
      interval = setInterval(() => {
        setDiceDisplay({ d1: Math.floor(Math.random() * 6) + 1, d2: Math.floor(Math.random() * 6) + 1 });
      }, 80);
    }
    return () => clearInterval(interval);
  }, [isRolling]);

  useEffect(() => {
    if (isAiMode && username === "PC Tycoon" && !hasRolledThisTurn) {
      const aiTimer = setTimeout(() => rollDice(), 1000);
      return () => clearTimeout(aiTimer);
    }
  }, [username, isAiMode, hasRolledThisTurn]);

  useEffect(() => {
    if (isAiMode && username === "PC Tycoon" && hasRolledThisTurn && !isRolling) {
      const aiActionTimer = setTimeout(() => {
        const pcPlayer = players["PC Tycoon"];
        if (pcPlayer) {
          const pcPos = pcPlayer.position;
          const price = pcPos * 100 + 1000;
          if (isBuyable(pcPos) && !ownership[pcPos] && pcPlayer.cash >= price) {
             setPlayers(prev => ({ ...prev, ["PC Tycoon"]: { ...prev["PC Tycoon"], cash: prev["PC Tycoon"].cash - price } }));
             setOwnership(prev => ({ ...prev, [pcPos]: "PC Tycoon" }));
          }
        }
        endLocalTurn();
      }, 1500); 
      return () => clearTimeout(aiActionTimer);
    }
  }, [hasRolledThisTurn, isRolling, username, isAiMode]);

  const playMusicAndNavigate = (view) => {
    if (audioRef.current && soundEnabled && !isPlaying) { audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e)); }
    setCurrentView(view);
  };

  const joinOnlineRoom = () => { if (username !== "" && room !== "") { setIsLocalMode(false); setIsAiMode(false); socket.emit("join_room", { username, room }); setCountdown(3); } };

  const startLocalGame = () => {
    const activePlayers = localNames.filter(n => n.trim() !== "");
    if (activePlayers.length < 2) return alert("You need at least 2 players!");
    setIsLocalMode(true); setIsAiMode(false); setUsername(activePlayers[0]); setHasRolledThisTurn(false); setLastRoll(null);
    const initialPlayers = {};
    activePlayers.forEach(name => { initialPlayers[name] = { position: 0, cash: 15000, debt: 0 }; });
    setPlayers(initialPlayers); setOwnership({}); setCountdown(3);
  };

  const startAiGame = () => {
    setIsLocalMode(true); setIsAiMode(true);
    const playerName = localNames[0].trim() !== "" ? localNames[0] : "Abhi";
    setUsername(playerName); setHasRolledThisTurn(false); setLastRoll(null);
    setPlayers({ [playerName]: { position: 0, cash: 15000, debt: 0 }, "PC Tycoon": { position: 0, cash: 15000, debt: 0 } });
    setOwnership({}); setCountdown(3);
  };

  const rollDice = () => {
    if (hasRolledThisTurn && isLocalMode) return; 
    if (!isLocalMode) {
      socket.emit("roll_dice", { username, room });
    } else {
      const dice1 = Math.floor(Math.random() * 6) + 1; const dice2 = Math.floor(Math.random() * 6) + 1; const total = dice1 + dice2;
      setIsRolling(true); setHasRolledThisTurn(true);
      setTimeout(() => {
        setLastRoll({ username, dice1, dice2, total }); setIsRolling(false);
        setPlayers(prev => {
          let updated = { ...prev }; let p = { ...updated[username] };
          p.position += total;
          if (p.position > 39) { p.position = p.position % 40; p.cash += 1500; }
          if (p.position === 4) p.cash -= 2000;
          if (p.position === 38) p.cash -= 1000;
          const owner = ownership[p.position];
          if (owner && owner !== username && updated[owner]) {
            const rent = Math.floor((p.position * 100 + 1000) * 0.15);
            p.cash -= rent; updated[owner].cash += rent;
          }
          if (p.cash < 0) {
            alert(`🚨 ${username} is bankrupt and has been disqualified!`);
            delete updated[username];
            const remainingPlayers = Object.keys(updated);
            if (remainingPlayers.length > 0) {
              setTimeout(() => { setUsername(remainingPlayers[0]); setHasRolledThisTurn(false); setLastRoll(null); }, 100);
            }
          }
          updated[username] = p; return updated;
        });
      }, 1000);
    }
  };

  const endLocalTurn = () => {
    const activePlayers = Object.keys(players); if (activePlayers.length === 0) return;
    const currentIdx = activePlayers.indexOf(username);
    const nextIdx = (currentIdx !== -1 ? currentIdx + 1 : 0) % activePlayers.length;
    setUsername(activePlayers[nextIdx]); setHasRolledThisTurn(false); setLastRoll(null);
  };

  const buyProperty = () => {
    if (!isLocalMode) { socket.emit("buy_property", { username, room }); } else {
      const myPos = players[username] ? players[username].position : 0; const price = myPos * 100 + 1000;
      if (isBuyable(myPos) && !ownership[myPos] && players[username] && players[username].cash >= price) {
        setPlayers(prev => ({ ...prev, [username]: { ...prev[username], cash: prev[username].cash - price } }));
        setOwnership(prev => ({ ...prev, [myPos]: username }));
      }
    }
  };

  const takeLoan = () => {
    if (!isLocalMode) { socket.emit("take_loan", { username, room }); } else {
      if(players[username]) setPlayers(prev => ({ ...prev, [username]: { ...prev[username], cash: prev[username].cash + 5000, debt: prev[username].debt + 5400 } }));
    }
  };

  const repayLoan = () => {
    if (!isLocalMode) { socket.emit("repay_loan", { username, room }); } else {
      const p = players[username];
      if (p && p.cash >= p.debt) setPlayers(prev => ({ ...prev, [username]: { ...prev[username], cash: prev[username].cash - prev[username].debt, debt: 0 } }));
    }
  };

  const startPattiRound = (opponentOverride) => {
    const activeOpponent = opponentOverride || arenaHumanOpponent || (arenaOpponent === 'online' ? 'Online_Rival_99' : 'PC Tycoon');
    let hasEnoughCash = true;
    setPlayers(prev => {
      const p = prev[username] || { position: 0, cash: 15000, debt: 0 };
      if (p.cash < 100) { hasEnoughCash = false; return prev; }
      return { ...prev, [username]: { ...p, cash: p.cash - 100 } };
    });
    if (!hasEnoughCash) { setTimeout(() => alert(`${username} needs at least ₹100 to enter.`), 100); setArenaStatus('idle'); return; }

    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; 
    const getCard = () => { 
      const r = ranks[Math.floor(Math.random()*ranks.length)];
      const s = suits[Math.floor(Math.random()*suits.length)];
      const displayRank = r === 11 ? 'J' : r === 12 ? 'Q' : r === 13 ? 'K' : r === 14 ? 'A' : r;
      return { val: r, suit: s, display: `${displayRank}${s}` };
    };
    
    setPlayerHand([getCard(), getCard(), getCard()]); setOppHand([getCard(), getCard(), getCard()]);
    setPattiCardsSeen({ [username]: false, [activeOpponent]: false }); setPattiPot(200); setShowdownResult(null); 
    setPattiTurn(username); setPattiStatus(`Round started! ${username}'s turn to act.`);
  };

  const handlePattiBet = (amount) => {
    const activeOpponent = arenaHumanOpponent || (arenaOpponent === 'online' ? 'Online_Rival_99' : 'PC Tycoon');
    let betSuccessful = true;
    setPlayers(prev => {
      const p = prev[pattiTurn] || { position: 0, cash: 15000, debt: 0 };
      if (p.cash < amount) { betSuccessful = false; return prev; }
      return { ...prev, [pattiTurn]: { ...p, cash: p.cash - amount } };
    });
    if (!betSuccessful) return alert(`${pattiTurn} does not have enough cash!`);
    
    setPattiPot(prev => prev + amount); 
    if (arenaOpponent === 'pc' || arenaOpponent === 'online') {
      setPattiPot(prev => prev + amount); 
      setPattiStatus(`You bet ₹${amount}. ${activeOpponent} matches. Pot is ₹${pattiPot + (amount*2)}.`);
    } else {
      const nextTurn = pattiTurn === username ? activeOpponent : username;
      setPattiTurn(nextTurn);
      setPattiStatus(`${pattiTurn} bet ₹${amount}. Now it's ${nextTurn}'s turn.`);
    }
  };

  const handlePattiShow = () => {
    const pScore = playerHand.reduce((acc, card) => acc + card.val, 0); 
    const oppScore = oppHand.reduce((acc, card) => acc + card.val, 0);
    const activeOpponent = arenaHumanOpponent || (arenaOpponent === 'online' ? 'Online_Rival_99' : 'PC Tycoon');

    if (pScore > oppScore) {
      setPattiStatus(`${username} won (${pScore} vs ${oppScore})! Takes the ₹${pattiPot} pot!`);
      setPlayers(prev => { const p = prev[username] || { cash: 15000 }; return { ...prev, [username]: { ...p, cash: p.cash + pattiPot } }; });
      setTimeout(() => setArenaStatus('won'), 3000);
    } else {
      setPattiStatus(`${activeOpponent} won (${oppScore} vs ${pScore}). ${username} lost the pot.`);
      setPlayers(prev => { const p = prev[activeOpponent] || { cash: 15000 }; return { ...prev, [activeOpponent]: { ...p, cash: p.cash + pattiPot } }; });
      setTimeout(() => setArenaStatus('lost'), 3000);
    }
    setShowdownResult(true);
  };

  const startChessRound = (opponentOverride) => {
    const newGame = new Chess();
    setChessGame(newGame); setChessBoardState(newGame.board()); setSelectedChessSquare(null);
    const opp = opponentOverride || arenaHumanOpponent || (arenaOpponent === 'online' ? 'Online_Rival_99' : 'PC Tycoon');
    setChessStatus(`Round ${arenaStreak + 1}: ${username} (White) vs ${opp} (Black). White to move.`);
  };

  const checkChessGameEnd = (currentGame) => {
    const isGameOver = currentGame.isGameOver ? currentGame.isGameOver() : currentGame.game_over();
    const isCheckmate = currentGame.isCheckmate ? currentGame.isCheckmate() : currentGame.in_checkmate();
    const isDraw = currentGame.isDraw ? currentGame.isDraw() : currentGame.in_draw();
    const opp = arenaHumanOpponent || (arenaOpponent === 'online' ? 'Online_Rival_99' : 'PC Tycoon');

    if (isCheckmate) {
      if (currentGame.turn() === 'b') {
        setChessStatus(`CHECKMATE! ${username} wins against ${opp}!`); setTimeout(() => setArenaStatus('won'), 2500);
      } else {
        setChessStatus(`CHECKMATE! ${opp} wins against ${username}!`); setTimeout(() => setArenaStatus('lost'), 2500);
      }
    } else if (isDraw) {
      setChessStatus("DRAW! It's a stalemate. You survive this round."); setTimeout(() => setArenaStatus('won'), 2500);
    } else if (isGameOver) {
      setChessStatus("Game Over!"); setTimeout(() => setArenaStatus('lost'), 2500);
    } else {
      setChessStatus(currentGame.turn() === 'w' ? `${username}'s move (White).` : `${opp}'s move (Black).`);
    }
  };

  const makeAiChessMove = (currentGame) => {
    const moves = currentGame.moves();
    if (moves.length > 0) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      currentGame.move(randomMove);
      setChessBoardState(currentGame.board()); checkChessGameEnd(currentGame);
    }
  };

  const handleChessSquareClick = (squareStr) => {
    if ((arenaOpponent === 'pc' || arenaOpponent === 'online') && chessGame.turn() !== 'w') return;
    
    if (!selectedChessSquare) {
      const piece = chessGame.get(squareStr);
      if (piece && piece.color === chessGame.turn()) {
        setSelectedChessSquare(squareStr); setChessStatus(`Selected ${squareStr}. Choose destination.`);
      }
    } else {
      let moveResult = null;
      try { moveResult = chessGame.move({ from: selectedChessSquare, to: squareStr, promotion: 'q' }); } catch (e) { moveResult = null; }
      if (moveResult) {
        setChessBoardState(chessGame.board()); setSelectedChessSquare(null); checkChessGameEnd(chessGame);
        if (arenaOpponent === 'pc' || arenaOpponent === 'online') {
          const isGameOver = chessGame.isGameOver ? chessGame.isGameOver() : chessGame.game_over();
          if (!isGameOver) setTimeout(() => makeAiChessMove(chessGame), 800);
        }
      } else {
        const piece = chessGame.get(squareStr);
        if (piece && piece.color === chessGame.turn()) {
          setSelectedChessSquare(squareStr); setChessStatus(`Selected ${squareStr}. Choose destination.`);
        } else {
          setSelectedChessSquare(null); setChessStatus("Invalid move. Try again.");
        }
      }
    }
  };

  const getChessPieceUnicode = (piece) => {
    if (!piece) return '';
    const codes = { 'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚' };
    return codes[piece.type] || '';
  };

  const grabSikandarReward = (rewardType) => {
    if (rewardType === 'property') {
      const unclaimedTile = activeBoard.findIndex((space, idx) => isBuyable(idx) && !ownership[idx]);
      const targetTile = unclaimedTile !== -1 ? unclaimedTile : 1;
      setOwnership(prev => ({ ...prev, [targetTile]: username }));
      alert(`🎉 Grabbed ${activeBoard[targetTile].name}! Next challenger!`);
    } else {
      const randomArtifact = ancientArtifactsList[Math.floor(Math.random() * ancientArtifactsList.length)];
      setArtifactVault(prev => [...prev, randomArtifact]);
      alert(`🏛️ Grabbed ${randomArtifact.name}! Next challenger!`);
    }
    setArenaStreak(s => s + 1); setArenaStatus('playing');
    if (activeGameSession === 'cards') { startPattiRound(arenaHumanOpponent); }
    if (activeGameSession === 'chess') { startChessRound(arenaHumanOpponent); }
  };

  const startNextAuctionRound = (opponentOverride) => {
    const activeOpponent = opponentOverride || auctionHumanOpponent || (auctionOpponent === 'online' ? 'Online_Rival_99' : 'PC Tycoon');
    const unclaimed = activeBoard.findIndex((s, i) => isBuyable(i) && !ownership[i]);
    const target = unclaimed !== -1 ? unclaimed : Math.floor(Math.random() * 39) + 1;
    setAuctionProperty({ name: activeBoard[target].name, price: target * 100 + 1000, index: target });
    
    if (auctionOpponent === 'pc' || auctionOpponent === 'online') {
      const aiBid = (target * 100 + 1000) + Math.floor(Math.random() * 3000) + (auctionStreak * 500);
      setOpponentBid(aiBid); setBidAmount(aiBid + 100); 
    } else {
      setOpponentBid(target * 100 + 1000); setBidAmount((target * 100 + 1000) + 100); setAuctionTurn(username);
    }
    setAuctionStatus('bidding');
  };

  const submitAuctionBid = () => {
    const activeOpponent = auctionHumanOpponent || (auctionOpponent === 'online' ? 'Online_Rival_99' : 'PC Tycoon');
    const currentPlayer = auctionTurn || username;
    const p = players[currentPlayer] || { cash: 15000 };

    if (bidAmount > opponentBid && p.cash >= bidAmount) {
      if (auctionOpponent === 'pc' || auctionOpponent === 'online') {
        setPlayers(prev => {
          const pState = prev[username] || { position: 0, cash: 15000, debt: 0 };
          return { ...prev, [username]: { ...pState, cash: pState.cash - bidAmount } };
        });
        setOwnership(prev => ({ ...prev, [auctionProperty.index]: username }));
        alert(`🏆 You won ${auctionProperty.name} for ₹${bidAmount}! Next property...`);
        setAuctionStreak(s => s + 1); startNextAuctionRound();
      } else {
        setOpponentBid(bidAmount); setAuctionTurn(auctionTurn === username ? activeOpponent : username);
      }
    } else if (p.cash < bidAmount) {
      alert(`❌ ${currentPlayer} has insufficient funds and is eliminated!`); setAuctionStatus('lost');
    } else {
      alert(`❌ Bid must be higher than ₹${opponentBid}!`);
    }
  };

  const foldAuction = () => {
    const activeOpponent = auctionHumanOpponent || (auctionOpponent === 'online' ? 'Online_Rival_99' : 'PC Tycoon');
    if (auctionOpponent !== 'pc' && auctionOpponent !== 'online') {
      const winner = auctionTurn === username ? activeOpponent : username;
      setPlayers(prev => {
        const wState = prev[winner] || { position: 0, cash: 15000, debt: 0 };
        return { ...prev, [winner]: { ...wState, cash: wState.cash - opponentBid } };
      });
      setOwnership(prev => ({ ...prev, [auctionProperty.index]: winner }));
      alert(`🏆 ${winner} wins ${auctionProperty.name} for ₹${opponentBid}!`);
      setAuctionStreak(s => s + 1); startNextAuctionRound(activeOpponent);
    } else {
      setAuctionStatus('lost');
    }
  };

  const activeBoard = boardEdition === "Global" ? globalBoardSpaces : indiaBoardSpaces;
  const myPlayer = players[username];
  const myPos = myPlayer ? myPlayer.position : 0;
  const currentSpace = activeBoard[myPos];
  const propertyPrice = myPos * 100 + 1000;
  const propertyOwner = ownership[myPos];
  const activeTheme = themes[currentTheme] || themes.classic;

  const menuBtnStyle = { padding: '14px 28px', fontSize: '15px', fontWeight: '700', width: '320px', background: `linear-gradient(135deg, ${activeTheme.accent}22 0%, rgba(15, 23, 42, 0.75) 100%)`, color: '#fff', border: `1px solid ${activeTheme.accent}55`, borderRadius: '16px', cursor: 'pointer', boxShadow: '0 15px 30px rgba(0,0,0,0.5)', zIndex: 10, transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '35px', gap: '16px', textTransform: 'uppercase', letterSpacing: '1px', backdropFilter: 'blur(20px)' };
  const activeTabStyle = { padding: '10px 16px', borderBottom: `2px solid ${activeTheme.accent}`, fontWeight: '600', cursor: 'pointer', color: activeTheme.accent, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' };
  const inactiveTabStyle = { padding: '10px 16px', color: '#64748b', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' };
  const totalWins = scores.onlineWins + scores.passWins + scores.singleWins;
  const totalMatches = totalWins + scores.onlineLosses + scores.passLosses + scores.singleLosses;
  const isThemeUnlocked = (key) => {
    const t = themes[key];
    if (!t) return true;
    if (t.minOnlineWins && scores.onlineWins < t.minOnlineWins) return false;
    if (t.minPassWins && scores.passWins < t.minPassWins) return false;
    if (t.minSingleWins && scores.singleWins < t.minSingleWins) return false;
    if (t.minTotalWins && totalWins < t.minTotalWins) return false;
    return true;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: activeTheme.bg, color: activeTheme.text, fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative', overflow: isMobile ? 'auto' : 'hidden', transition: 'background-color 0.8s ease' }}>
      
      <style>{`
        @keyframes floatBg { 0% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-12px) scale(1.02); } 100% { transform: translateY(0px) scale(1); } }
        @keyframes orbDrift { 0% { transform: translate(0px, 0px) scale(1); } 50% { transform: translate(40px, -30px) scale(1.12); } 100% { transform: translate(0px, 0px) scale(1); } }
        @keyframes flip-dice { 0% { transform: rotateX(0deg) rotateY(0deg) scale(1); } 50% { transform: rotateX(360deg) rotateY(180deg) scale(1.3); } 100% { transform: rotateX(720deg) rotateY(360deg) scale(1); } }
        .rolling-dice { animation: flip-dice 0.9s ease-in-out; display: inline-block; transform-style: preserve-3d; }
      `}</style>

      {/* Main Global Background Image Hook */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url(${process.env.PUBLIC_URL}/tycoons1.png)`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.35, zIndex: 0, pointerEvents: 'none', mixBlendMode: 'luminosity' }} />

      <div style={{ position: 'absolute', top: '-20%', left: '-15%', width: '60vw', height: '60vw', background: `radial-gradient(circle, ${activeTheme.accent}18 0%, transparent 65%)`, borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none', animation: 'orbDrift 12s ease-in-out infinite', zIndex: 1 }} />
      
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      {/* TOP CONTROLS */}
      <div style={{ position: 'absolute', top: '28px', right: '35px', display: 'flex', gap: '16px', zIndex: 50, alignItems: 'center' }}>
        {currentView !== 'board' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '14px', color: activeTheme.accent, background: 'rgba(2, 6, 23, 0.45)', backdropFilter: 'blur(24px)', padding: '10px 20px', borderRadius: '40px', border: `1px solid ${activeTheme.border}`, boxShadow: '0 15px 35px rgba(0,0,0,0.4)' }}>👑 {username} {artifactVault.length > 0 && `| 🏛️ Artifacts: ${artifactVault.length}`}</div>
        )}
        <button onClick={() => { setSoundEnabled(!soundEnabled); if(isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e)); } }} style={{ fontSize: '16px', background: 'rgba(2, 6, 23, 0.45)', backdropFilter: 'blur(24px)', border: `1px solid ${activeTheme.border}`, borderRadius: '50%', width: '48px', height: '48px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', color: '#fff', transition: 'all 0.2s' }}>{soundEnabled ? '🔊' : '🔇'}</button>
        {currentView !== 'board' && (
          <button onClick={() => setIsSettingsOpen(true)} style={{ fontSize: '16px', background: 'rgba(2, 6, 23, 0.45)', backdropFilter: 'blur(24px)', border: `1px solid ${activeTheme.border}`, borderRadius: '50%', width: '48px', height: '48px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', color: '#fff', transition: 'all 0.2s' }}>⚙️</button>
        )}
      </div>

      {/* MENU */}
      {currentView === 'menu' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '5vh', height: '100vh', background: 'transparent', zIndex: 2, position: 'relative' }}>
          <h1 style={{ fontSize: '75px', color: activeTheme.accent, margin: '0 0 2px 0', textShadow: `0 0 60px ${activeTheme.accent}88`, fontFamily: 'serif', textAlign: 'center', letterSpacing: '3px' }}>ব্যবসায়ী</h1>
          <h2 style={{ color: activeTheme.text, marginTop: 0, letterSpacing: isMobile ? '4px' : '8px', textShadow: '2px 2px 15px rgba(0,0,0,0.9)', zIndex: 10, textAlign: 'center', fontSize: '20px', fontWeight: '800' }}>{boardEdition === "Global" ? "GLOBAL EDITION" : "BUSINESS INDIA"}</h2>
          
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '30px', zIndex: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', padding: '20px', backgroundColor: 'rgba(2, 6, 23, 0.6)', borderRadius: '24px', border: `1px solid ${activeTheme.border}`, backdropFilter: 'blur(20px)' }}>
              <h3 style={{ color: activeTheme.accent, margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `1px solid ${activeTheme.accent}55`, paddingBottom: '8px' }}>🎲 Authentic Business Game</h3>
              <button onClick={() => playMusicAndNavigate('lobby')} style={{ ...menuBtnStyle, background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', border: '1px solid #93c5fd' }}><span style={{ fontSize: '18px' }}>🌐</span> Play Online Board</button>
              <button onClick={() => playMusicAndNavigate('localLobby')} style={{ ...menuBtnStyle, background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', border: '1px solid #6ee7b7' }}><span style={{ fontSize: '18px' }}>🏆</span> Pass & Play Board</button>
              <button onClick={() => { playMusicAndNavigate('menu'); startAiGame(); }} style={{ ...menuBtnStyle, background: 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)', border: '1px solid #c4b5fd' }}><span style={{ fontSize: '18px' }}>🤖</span> Play vs PC Board</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', padding: '20px', backgroundColor: 'rgba(2, 6, 23, 0.6)', borderRadius: '24px', border: `1px solid ${activeTheme.border}`, backdropFilter: 'blur(20px)' }}>
              <h3 style={{ color: activeTheme.accent, margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `1px solid ${activeTheme.accent}55`, paddingBottom: '8px' }}>⚔️ Mini-Games & Arenas</h3>
              <button onClick={() => { setSikandarModal(true); setArenaStatus('idle'); setActiveGameSession(null); setArenaOpponent(null); setArenaHumanOpponent(null); }} style={{ ...menuBtnStyle, background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', border: '1px solid #fde047' }}><span style={{ fontSize: '18px' }}>🎯</span> Jo Jeeta Woh Sikandar</button>
              <button onClick={() => { setAuctionModal(true); setAuctionStatus('idle'); setAuctionOpponent(null); setAuctionHumanOpponent(null); }} style={{ ...menuBtnStyle, background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)', border: '1px solid #fca5a5' }}><span style={{ fontSize: '18px' }}>🔨</span> Property Auction House</button>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: '25px', zIndex: 10, textAlign: 'center', width: '100%' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              © 2026 Business India Game Pvt Ltd. All Rights Reserved.
            </span>
          </div>
        </div>
      )}

      {/* JO JEETA WOH SIKANDAR ARENA MODAL */}
      {sikandarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 120 }}>
          <div style={{ width: '90%', maxWidth: '580px', backgroundColor: '#0f172a', border: '2px solid #f59e0b', borderRadius: '24px', padding: '30px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.9)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ color: '#f59e0b', marginTop: 0, fontSize: '28px', textTransform: 'uppercase', letterSpacing: '1px' }}>🎯 Jo Jeeta Woh Sikandar</h2>
            
            {!activeGameSession ? (
              <>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '25px' }}>Engage in consecutive professional matches. Grab rare loot for every win!</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <button onClick={() => setActiveGameSession('cards')} style={{ padding: '16px', background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)', color: '#fff', border: '1px solid #fca5a5', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>🃏 Enter 3-Patti Showdown</button>
                  <button onClick={() => setActiveGameSession('chess')} style={{ padding: '16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', color: '#fff', border: '1px solid #93c5fd', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>♟️ Enter Real Chess Arena</button>
                  <button onClick={() => setSikandarModal(false)} style={{ padding: '12px', background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', marginTop: '10px' }}>⬅️ Exit Arena</button>
                </div>
              </>
            ) : !arenaOpponent ? (
              <>
                <h3 style={{ color: activeTheme.text }}>Choose Your Challenger Mode</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <button onClick={() => { setArenaOpponent('online'); setArenaStatus('setup'); setArenaStreak(0); }} style={{ padding: '14px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🌐 Online Multiplayer</button>
                  <button onClick={() => { setArenaOpponent('local'); setArenaStatus('setup'); setArenaStreak(0); }} style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🏆 Local Pass & Play (PvP)</button>
                  <button onClick={() => { setArenaOpponent('pc'); setArenaHumanOpponent(null); setArenaStreak(0); setArenaStatus('playing'); if(activeGameSession==='cards') startPattiRound(); else startChessRound(); }} style={{ padding: '14px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid #8b5cf6', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🤖 Vs PC Master (PvE)</button>
                  <button onClick={() => setActiveGameSession(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginTop: '10px' }}>Back</button>
                </div>
              </>
            ) : arenaOpponent === 'online' && arenaStatus === 'setup' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ color: activeTheme.text }}>Join Online Arena</h3>
                <input type="text" placeholder="Enter Room Code" value={room} onChange={(e) => setRoom(e.target.value)} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #3b82f6', backgroundColor: '#020617', color: '#fff' }} />
                <button onClick={() => { if(room) { setArenaStatus('playing'); setArenaHumanOpponent(`Online Rival (${room})`); if(activeGameSession==='cards') startPattiRound(`Online Rival (${room})`); else startChessRound(`Online Rival (${room})`); } else alert("Enter a room code!"); }} style={{ padding: '14px', background: '#3b82f6', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Join Room & Play</button>
                <button onClick={() => setArenaOpponent(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Back</button>
              </div>
            ) : arenaOpponent === 'local' && arenaStatus === 'setup' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ color: activeTheme.text }}>Setup Local Match</h3>
                <input type="text" placeholder="Player 1 Name" value={localNames[0]} onChange={(e) => setLocalNames([e.target.value, ...localNames.slice(1)])} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #10b981', backgroundColor: '#020617', color: '#fff' }} />
                <input type="text" placeholder="Player 2 Name" value={localNames[1]} onChange={(e) => setLocalNames([localNames[0], e.target.value, ...localNames.slice(2)])} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #10b981', backgroundColor: '#020617', color: '#fff' }} />
                <button onClick={() => { if(localNames[0] && localNames[1]) { setUsername(localNames[0]); setArenaHumanOpponent(localNames[1]); setArenaStatus('playing'); if(activeGameSession==='cards') startPattiRound(localNames[1]); else startChessRound(localNames[1]); } else alert("Enter names for both players!"); }} style={{ padding: '14px', background: '#10b981', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Start Local Match</button>
                <button onClick={() => setArenaOpponent(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Back</button>
              </div>
            ) : arenaStatus === 'lost' ? (
              <div style={{ padding: '20px' }}>
                <h1 style={{ fontSize: '60px', margin: 0 }}>☠️</h1>
                <h3 style={{ color: '#ef4444', fontSize: '24px' }}>Defeated!</h3>
                <p style={{ color: '#cbd5e1' }}>Survival streak ended at <strong>{arenaStreak} wins</strong>.</p>
                <button onClick={() => { setSikandarModal(false); setActiveGameSession(null); setArenaOpponent(null); setArenaHumanOpponent(null); }} style={{ width: '100%', marginTop: '20px', padding: '14px', background: '#334155', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Leave Arena</button>
              </div>
            ) : arenaStatus === 'won' ? (
              <div style={{ padding: '20px' }}>
                <h1 style={{ fontSize: '60px', margin: 0 }}>🏆</h1>
                <h3 style={{ color: '#10b981', fontSize: '24px' }}>Flawless Victory!</h3>
                <p style={{ color: '#cbd5e1' }}>Current Survival Streak: <strong>{arenaStreak + 1}</strong></p>
                <p style={{ color: '#fbbf24', fontSize: '15px', marginBottom: '15px' }}>Choose your loot to continue:</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <button onClick={() => grabSikandarReward('property')} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)' }}>🏠 Grab Real Estate</button>
                  <button onClick={() => grabSikandarReward('artifact')} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)' }}>🏛️ Grab Artifact</button>
                </div>
              </div>
            ) : activeGameSession === 'cards' ? (
              <div>
                <h3 style={{ color: '#ef4444', fontSize: '20px' }}>🃏 Match {arenaStreak + 1}: 3-Patti Showdown</h3>
                <p style={{ color: '#fbbf24', fontSize: '18px', fontWeight: 'bold' }}>POT: ₹{pattiPot}</p>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>{pattiStatus}</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', margin: '20px 0', minHeight: '100px' }}>
                  {(pattiTurn === username ? playerHand : oppHand).map((card, idx) => {
                    const isVisible = showdownResult || pattiCardsSeen[pattiTurn];
                    return (
                      <div key={idx} style={{ width: '70px', height: '100px', backgroundColor: isVisible ? '#fff' : '#1e293b', border: isVisible ? 'none' : '2px solid #334155', color: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                        {isVisible ? card.display : '🂠'}
                      </div>
                    )
                  })}
                </div>

                {showdownResult && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0', opacity: 0.8 }}>
                    <span style={{ color: '#fff', fontSize: '12px' }}>Opponent Hand:</span>
                    {(pattiTurn === username ? oppHand : playerHand).map((c, i) => <span key={i} style={{ background: '#fff', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>{c.display}</span>)}
                  </div>
                )}

                {!showdownResult && (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {!pattiCardsSeen[pattiTurn] && <button onClick={() => setPattiCardsSeen(prev => ({ ...prev, [pattiTurn]: true }))} style={{ padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>👀 See {pattiTurn}'s Cards</button>}
                    <button onClick={() => handlePattiBet(pattiCardsSeen[pattiTurn] ? 200 : 100)} style={{ padding: '12px', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>💰 {pattiCardsSeen[pattiTurn] ? 'Chaal (₹200)' : 'Blind (₹100)'}</button>
                    <button onClick={handlePattiShow} style={{ padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>🃏 Show (Compare)</button>
                    <button onClick={() => setArenaStatus('lost')} style={{ padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Fold (Pack)</button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 style={{ color: '#3b82f6', fontSize: '20px' }}>♟️ Match {arenaStreak + 1}: Actual Chess Arena</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '15px' }}>{chessTurn}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '2px', backgroundColor: '#0f172a', padding: '4px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #1e293b' }}>
                  {chessBoardState.map((row, rIndex) => 
                    row.map((cell, cIndex) => {
                      const files = ['a','b','c','d','e','f','g','h'];
                      const squareStr = files[cIndex] + (8 - rIndex);
                      const isSelected = selectedChessSquare === squareStr;
                      const isDark = (rIndex + cIndex) % 2 !== 0;
                      
                      return (
                        <div key={squareStr} onClick={() => handleChessSquareClick(squareStr)} 
                             style={{ height: '40px', backgroundColor: isSelected ? '#fbbf24' : (isDark ? '#475569' : '#cbd5e1'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', cursor: 'pointer', boxShadow: isSelected ? 'inset 0 0 10px rgba(0,0,0,0.8)' : 'none' }}>
                          <span style={{ color: cell?.color === 'w' ? '#fff' : '#000', textShadow: cell ? '0 2px 4px rgba(0,0,0,0.6)' : 'none' }}>
                            {getChessPieceUnicode(cell)}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>
                <button onClick={() => setArenaStatus('lost')} style={{ width: '100%', padding: '14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Resign Match</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUCTION HOUSE CONSECUTIVE SURVIVAL MODAL */}
      {auctionModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 120 }}>
          <div style={{ width: '90%', maxWidth: '480px', backgroundColor: '#0f172a', border: '2px solid #ef4444', borderRadius: '24px', padding: '30px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' }}>
            <h2 style={{ color: '#fca5a5', marginTop: 0, fontSize: '26px' }}>🔨 Endless Auction House</h2>
            
            {!auctionOpponent ? (
              <>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '25px' }}>Outbid challengers continuously to build your empire. The auctions get harder. If you fail to outbid once, you are kicked out!</p>
                <h3 style={{ color: activeTheme.text }}>Choose Auction Ring</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <button onClick={() => { setAuctionOpponent('online'); setAuctionStatus('setup'); setAuctionStreak(0); }} style={{ padding: '14px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🌐 Online Bidders</button>
                  <button onClick={() => { setAuctionOpponent('local'); setAuctionStatus('setup'); setAuctionStreak(0); }} style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🏆 Local Pass & Play (PvP)</button>
                  <button onClick={() => { setAuctionOpponent('pc'); setAuctionHumanOpponent(null); setAuctionStreak(0); startNextAuctionRound(); }} style={{ padding: '14px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid #8b5cf6', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🤖 PC Tycoon Syndicate</button>
                  <button onClick={() => setAuctionModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginTop: '10px' }}>Cancel</button>
                </div>
              </>
            ) : auctionOpponent === 'online' && auctionStatus === 'setup' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ color: activeTheme.text }}>Join Online Auction</h3>
                <input type="text" placeholder="Enter Room Code" value={room} onChange={(e) => setRoom(e.target.value)} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #3b82f6', backgroundColor: '#020617', color: '#fff' }} />
                <button onClick={() => { if(room) { setAuctionStatus('playing'); setAuctionHumanOpponent(`Online Rival (${room})`); startNextAuctionRound(`Online Rival (${room})`); } else alert("Enter a room code!"); }} style={{ padding: '14px', background: '#3b82f6', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Join Room & Bid</button>
                <button onClick={() => setAuctionOpponent(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Back</button>
              </div>
            ) : auctionOpponent === 'local' && auctionStatus === 'setup' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ color: activeTheme.text }}>Setup Local Auction</h3>
                <input type="text" placeholder="Player 1 Name" value={localNames[0]} onChange={(e) => setLocalNames([e.target.value, ...localNames.slice(1)])} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #10b981', backgroundColor: '#020617', color: '#fff' }} />
                <input type="text" placeholder="Player 2 Name" value={localNames[1]} onChange={(e) => setLocalNames([localNames[0], e.target.value, ...localNames.slice(2)])} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #10b981', backgroundColor: '#020617', color: '#fff' }} />
                <button onClick={() => { if(localNames[0] && localNames[1]) { setUsername(localNames[0]); setAuctionHumanOpponent(localNames[1]); setAuctionStatus('playing'); startNextAuctionRound(localNames[1]); } else alert("Enter names for both players!"); }} style={{ padding: '14px', background: '#10b981', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Start Local Auction</button>
                <button onClick={() => setAuctionOpponent(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Back</button>
              </div>
            ) : auctionStatus === 'lost' ? (
              <div style={{ padding: '20px' }}>
                <h1 style={{ fontSize: '50px', margin: 0 }}>💸</h1>
                <h3 style={{ color: '#ef4444', fontSize: '22px' }}>Outbidded & Bankrupted!</h3>
                <p style={{ color: '#cbd5e1' }}>You acquired <strong>{auctionStreak} properties</strong> before you couldn't match the bid.</p>
                <button onClick={() => { setAuctionModal(false); setAuctionOpponent(null); setAuctionHumanOpponent(null); }} style={{ width: '100%', marginTop: '20px', padding: '14px', background: '#334155', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Exit Auction House</button>
              </div>
            ) : (
              <div>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 15px 0' }}>Auction Streak: {auctionStreak}</p>
                <div style={{ backgroundColor: '#020617', padding: '20px', borderRadius: '14px', border: '1px solid #1e293b', marginBottom: '20px' }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '20px' }}>{auctionProperty.name}</h3>
                  <p style={{ margin: 0, color: '#ef4444', fontSize: '18px', fontWeight: 'bold' }}>Current Bid: ₹{opponentBid}</p>
                  {(auctionOpponent === 'local') && <p style={{ color: '#fbbf24', marginTop: '10px' }}>{auctionTurn}'s Turn to counter-bid!</p>}
                </div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px' }}>Your Counter Bid (₹):</label>
                <input type="number" value={bidAmount} onChange={(e) => setBidAmount(Number(e.target.value))} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #334155', backgroundColor: '#020617', color: '#22c55e', fontSize: '20px', fontWeight: 'bold', boxSizing: 'border-box', textAlign: 'center', marginBottom: '20px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={submitAuctionBid} style={{ flex: 1, padding: '16px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)' }}>
                    Slam Gavel! 🔨
                  </button>
                  <button onClick={foldAuction} style={{ padding: '16px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '14px', cursor: 'pointer' }}>
                    Fold
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOBBIES AND BOARD VIEW */}
      {currentView === 'lobby' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15vh', zIndex: 3, position: 'relative' }}>
          <button onClick={() => setCurrentView('menu')} style={{ position: 'absolute', top: '28px', left: '35px', padding: '10px 20px', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(16px)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontWeight: '600' }}>⬅️ Back</button>
          <div style={{ padding: '45px', backgroundColor: activeTheme.glassBg, backdropFilter: 'blur(30px)', color: activeTheme.text, borderRadius: '30px', boxShadow: '0 30px 90px rgba(0,0,0,0.85)', textAlign: 'center', width: isMobile ? '90%' : '440px', border: `1px solid ${activeTheme.border}` }}>
            <h2 style={{ marginTop: 0, color: activeTheme.accent }}><span>🌐</span> Play Online Board</h2>
            <input type="text" placeholder="Your Name" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '16px', margin: '12px 0', width: '100%', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: activeTheme.tileBg, color: '#fff', boxSizing: 'border-box' }} />
            <input type="text" placeholder="Room Code" onChange={(e) => setRoom(e.target.value)} style={{ padding: '16px', margin: '12px 0 28px 0', width: '100%', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: activeTheme.tileBg, color: '#fff', boxSizing: 'border-box' }} />
            <button onClick={joinOnlineRoom} style={{ width: '100%', padding: '16px', background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #0f172a 100%)`, color: '#fff', border: `1px solid ${activeTheme.accent}88`, borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>Enter Board</button>
          </div>
        </div>
      )}

      {currentView === 'localLobby' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10vh', zIndex: 3, position: 'relative' }}>
          <button onClick={() => setCurrentView('menu')} style={{ position: 'absolute', top: '28px', left: '35px', padding: '10px 20px', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(16px)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontWeight: '600' }}>⬅️ Back</button>
          <div style={{ padding: '45px', backgroundColor: activeTheme.glassBg, backdropFilter: 'blur(30px)', color: activeTheme.text, borderRadius: '30px', boxShadow: '0 30px 90px rgba(0,0,0,0.85)', textAlign: 'center', width: isMobile ? '90%' : '460px', border: `1px solid ${activeTheme.border}` }}>
            <h2 style={{ marginTop: 0, color: activeTheme.accent }}><span>🏆</span> Pass & Play Board</h2>
            {[0, 1, 2, 3].map(i => (
              <input key={i} type="text" placeholder={`Player ${i+1} Name`} value={localNames[i]} onChange={(e) => { const newNames = [...localNames]; newNames[i] = e.target.value; setLocalNames(newNames); }} style={{ padding: '14px', margin: '6px 0', width: '100%', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: activeTheme.tileBg, color: '#fff', boxSizing: 'border-box' }} />
            ))}
            <button onClick={startLocalGame} style={{ width: '100%', marginTop: '15px', padding: '16px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>Start Match</button>
          </div>
        </div>
      )}

      {currentView === 'board' && (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', alignItems: isMobile ? 'center' : 'flex-start', gap: '20px', padding: '16px', marginTop: (isLocalMode && isMobile) ? '40px' : '0', zIndex: 3, position: 'relative' }}>
          
          {isLocalMode && (
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', backgroundColor: username === "PC Tycoon" ? '#ef4444' : activeTheme.accent, color: username === "PC Tycoon" ? 'white' : '#000', textAlign: 'center', padding: '12px', fontSize: isMobile ? '16px' : '18px', fontWeight: 'bold', zIndex: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)' }}>
                 {username === "PC Tycoon" ? "🤖 PC Tycoon is thinking..." : `✨ It is ${username}'s Turn! 🎲`}
             </div>
          )}

          <div style={{ width: isMobile ? '100%' : '260px', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: (isLocalMode && !isMobile) ? '40px' : '0' }}>
            <div style={{ backgroundColor: activeTheme.glassBg, backdropFilter: 'blur(24px)', color: activeTheme.text, padding: '22px', borderRadius: '22px', boxShadow: '0 20px 45px rgba(0,0,0,0.5)', border: `1px solid ${activeTheme.border}` }}>
              <h3 style={{ marginTop: 0, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', color: activeTheme.accent, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><span>🛡️</span> Players</h3>
              {Object.keys(players).map((p, i) => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '10px', backgroundColor: (isLocalMode && p === username) ? activeTheme.tileBg : 'transparent', borderRadius: '12px', border: (isLocalMode && p === username) ? `1px solid ${activeTheme.accent}66` : 'none' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: tokenColors[i % 4], marginRight: '10px', border: '2px solid #fff' }}></div>
                  <strong style={{ flex: 1, fontSize: '15px' }}>{p}</strong>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(11, 8.5vw)' : 'repeat(11, 72px)', gridTemplateRows: isMobile ? 'repeat(11, 8.5vw)' : 'repeat(11, 72px)', gap: '3px', backgroundColor: 'rgba(2, 6, 23, 0.8)', padding: '8px', border: `1px solid ${activeTheme.border}`, borderRadius: '22px', marginTop: (isLocalMode && !isMobile) ? '40px' : '0', boxShadow: '0 30px 70px rgba(0,0,0,0.85)' }}>
            <div style={{ gridColumn: '2 / 11', gridRow: '2 / 11', backgroundColor: activeTheme.glassBg, backdropFilter: 'blur(20px)', color: activeTheme.text, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', margin: '6px', border: `2px dashed ${activeTheme.accent}55`, padding: '10px' }}>
              <h1 style={{ color: activeTheme.accent, fontSize: isMobile ? '26px' : '42px', margin: 0, textAlign: 'center', fontFamily: 'serif' }}>{boardEdition === "Global" ? "GLOBAL" : "ব্যবসায়ী"}</h1>
              <button onClick={rollDice} disabled={(isLocalMode && hasRolledThisTurn) || (isAiMode && username === "PC Tycoon")} style={{ marginTop: isMobile ? '12px' : '20px', padding: isMobile ? '8px 16px' : '12px 32px', fontSize: isMobile ? '16px' : '20px', cursor: ((isLocalMode && hasRolledThisTurn) || (isAiMode && username === "PC Tycoon")) ? 'not-allowed' : 'pointer', background: ((isLocalMode && hasRolledThisTurn) || (isAiMode && username === "PC Tycoon")) ? '#334155' : `linear-gradient(135deg, ${activeTheme.accent} 0%, #0f172a 100%)`, color: '#fff', border: `1px solid ${activeTheme.accent}88`, borderRadius: '30px', fontWeight: 'bold' }}>ROLL DICE 🎲</button>
              
              <div style={{ marginTop: '15px', fontSize: isMobile ? '14px' : '16px', textAlign: 'center', height: isMobile ? '70px' : '90px' }}>
                {lastRoll && !isRolling && <strong>{lastRoll.username} rolled {lastRoll.total}</strong>}
                {isRolling && <strong>Rolling...</strong>}
                <div style={{ fontSize: isMobile ? '20px' : '26px', marginTop: '8px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <span className={isRolling ? "rolling-dice" : ""} style={{ width: isMobile ? '36px' : '50px', height: isMobile ? '36px' : '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: activeTheme.tileBg, color: '#fff', borderRadius: '10px' }}>
                    {isRolling ? diceDisplay.d1 : (lastRoll ? lastRoll.dice1 : '🎲')}
                  </span>
                  <span className={isRolling ? "rolling-dice" : ""} style={{ width: isMobile ? '36px' : '50px', height: isMobile ? '36px' : '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: activeTheme.tileBg, color: '#fff', borderRadius: '10px' }}>
                    {isRolling ? diceDisplay.d2 : (lastRoll ? lastRoll.dice2 : '🎲')}
                  </span>
                </div>
              </div>
            </div>
            {activeBoard.map((space, index) => {
              const pos = getGridPosition(index);
              const direction = getTileDirection(index);
              const colorStyle = getColorStyle(index, space.color);
              const playersHere = Object.keys(players).filter(p => players[p].position === index);

              return (
                <div key={index} style={{ ...pos, backgroundColor: activeTheme.tileBg, color: '#f8fafc', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: direction, fontSize: isMobile ? '1.8vw' : '9px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRadius: '6px' }}>
                  {space.color && <div style={{...colorStyle}}></div>}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1px' }}>
                    <div style={{ fontSize: isMobile ? '2.5vw' : '14px', marginBottom: '1px' }}>{space.icon}</div>
                    <div style={{ fontWeight: '600', lineHeight: '1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '92%', fontSize: isMobile ? '1.7vw' : '8.5px' }}>{space.name}</div>
                  </div>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '2px', pointerEvents: 'none' }}>
                    {playersHere.map((p, i) => <div key={i} style={{ width: isMobile ? '10px' : '14px', height: isMobile ? '10px' : '14px', borderRadius: '50%', backgroundColor: tokenColors[Object.keys(players).indexOf(p) % 4], border: '1.5px solid white' }} />)}
                  </div>
                  {ownership[index] && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.7)', pointerEvents: 'none' }} />}
                </div>
              );
            })}
          </div>

          <div style={{ width: isMobile ? '100%' : '300px', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: (isLocalMode && !isMobile) ? '40px' : '0', marginBottom: isMobile ? '30px' : '0' }}>
            <div style={{ backgroundColor: activeTheme.glassBg, backdropFilter: 'blur(20px)', color: activeTheme.text, padding: '22px', borderRadius: '20px', boxShadow: '0 20px 45px rgba(0,0,0,0.6)', border: `1px solid ${activeTheme.accent}33` }}>
              <h3 style={{ marginTop: 0, color: activeTheme.accent, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><span>💎</span> Your Bank</h3>
              <h2 style={{ fontSize: '36px', margin: '8px 0', color: '#10b981', fontWeight: '800' }}>₹{myPlayer ? Math.floor(myPlayer.cash) : 0}</h2>
              <div style={{ marginTop: '16px', padding: '14px', backgroundColor: activeTheme.tileBg, borderRadius: '14px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>🏦 ATM Services</h4>
                {myPlayer && myPlayer.debt > 0 ? (
                  <>
                    <p style={{ color: '#ef4444', fontWeight: 'bold', margin: '6px 0' }}>Debt: ₹{Math.floor(myPlayer.debt)}</p>
                    <button onClick={repayLoan} disabled={isAiMode && username === "PC Tycoon"} style={{ width: '100%', padding: '10px', backgroundColor: '#334155', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Repay Loan</button>
                  </>
                ) : (
                  <button onClick={takeLoan} disabled={isAiMode && username === "PC Tycoon"} style={{ width: '100%', padding: '10px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Take ₹5,000 Loan</button>
                )}
              </div>
            </div>
            
            <div style={{ backgroundColor: activeTheme.glassBg, backdropFilter: 'blur(20px)', color: activeTheme.text, padding: '22px', borderRadius: '20px', border: `2px solid ${activeTheme.accent}66` }}>
              <h3 style={{ margin: '0 0 10px 0', color: activeTheme.accent }}>📍 {currentSpace?.icon} {currentSpace?.name}</h3>
              {currentSpace?.color || currentSpace?.type === 'station' || currentSpace?.type === 'utility' ? (
                <>
                  <p style={{ fontSize: '16px', margin: '8px 0' }}>Price: <strong>₹{propertyPrice}</strong></p>
                  {!propertyOwner ? (
                    <button onClick={buyProperty} disabled={isAiMode && username === "PC Tycoon"} style={{ width: '100%', padding: '14px', background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #0f172a 100%)`, color: '#fff', border: `1px solid ${activeTheme.accent}88`, borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Buy Property</button>
                  ) : (
                    <div style={{ padding: '12px', backgroundColor: propertyOwner === username ? 'rgba(6, 78, 59, 0.8)' : 'rgba(127, 29, 29, 0.8)', borderRadius: '12px', color: propertyOwner === username ? '#34d399' : '#f87171', fontWeight: 'bold', textAlign: 'center' }}>
                      {propertyOwner === username ? '✅ Yours' : `🏠 Owned by ${propertyOwner}`}
                    </div>
                  )}
                </>
              ) : (
                <p style={{ color: '#94a3b8' }}>Action Space</p>
              )}
            </div>
            {isLocalMode && (
              <button onClick={endLocalTurn} disabled={isAiMode && username === "PC Tycoon"} style={{ width: '100%', padding: '16px', background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #0f172a 100%)`, color: '#fff', border: `1px solid ${activeTheme.accent}88`, fontWeight: 'bold', borderRadius: '16px', cursor: 'pointer' }}>End Your Turn ➡️</button>
            )}
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ width: '90%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#090d16', backdropFilter: 'blur(24px)', color: '#f8fafc', borderRadius: '28px', padding: '35px', position: 'relative', border: `1px solid ${activeTheme.border}`, boxShadow: '0 35px 90px rgba(0,0,0,0.95)' }}>
            <button onClick={() => setIsSettingsOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}>❌</button>
            <h2 style={{ marginTop: 0, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', color: activeTheme.accent, fontSize: '22px' }}>⚙️ Game Settings & Scores</h2>
            
            <div style={{ display: 'flex', gap: '4px', marginBottom: '25px', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
              <div onClick={() => setSettingsTab('profile')} style={settingsTab === 'profile' ? activeTabStyle : inactiveTabStyle}>🎨 Profile & Theme</div>
              <div onClick={() => setSettingsTab('scores')} style={settingsTab === 'scores' ? activeTabStyle : inactiveTabStyle}>📊 Scores</div>
              <div onClick={() => setSettingsTab('rules')} style={settingsTab === 'rules' ? activeTabStyle : inactiveTabStyle}>📜 Rules</div>
              <div onClick={() => setSettingsTab('maker')} style={settingsTab === 'maker' ? activeTabStyle : inactiveTabStyle}>🎥 About Maker</div>
              <div onClick={() => setSettingsTab('stats')} style={settingsTab === 'stats' ? activeTabStyle : inactiveTabStyle}>📈 Stats</div>
            </div>
            
            {settingsTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <label style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: '12px' }}>
                  <strong style={{ minWidth: '140px' }}>👑 Player Name:</strong> 
                  <input type="text" value={localNames[0] || username} onChange={(e) => { setUsername(e.target.value); setLocalNames([e.target.value, ...localNames.slice(1)])}} disabled={isLocalMode} style={{ padding: '14px', width: '260px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#020617', color: '#fff', fontSize: '15px' }}/>
                </label>

                <label style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: '12px' }}>
                  <strong style={{ minWidth: '140px' }}>🌐 Board Edition:</strong> 
                  <select value={boardEdition} onChange={(e) => setBoardEdition(e.target.value)} style={{ padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backgroundColor: '#020617', color: '#fff', fontSize: '15px' }}>
                    <option value="India">Business India (Default)</option>
                    <option value="Global">Global Monopoly</option>
                  </select>
                </label>

                <label style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: '12px' }}>
                  <strong style={{ minWidth: '140px' }}>🔊 Sound Effects:</strong> 
                  <button onClick={() => setSoundEnabled(!soundEnabled)} style={{ padding: '10px 18px', backgroundColor: soundEnabled ? '#10b981' : '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                    {soundEnabled ? 'Enabled 🔊' : 'Muted 🔇'}
                  </button>
                </label>

                <div style={{ marginTop: '10px' }}>
                  <strong style={{ display: 'block', marginBottom: '12px', fontSize: '16px' }}>🎨 Select App Theme:</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.keys(themes).map((key) => {
                      const t = themes[key];
                      const unlocked = isThemeUnlocked(key);
                      return (
                        <div key={key} onClick={() => unlocked && setCurrentTheme(key)} style={{ padding: '16px 20px', backgroundColor: currentTheme === key ? 'rgba(30, 41, 59, 0.7)' : '#020617', border: `2px solid ${currentTheme === key ? activeTheme.accent : 'rgba(255,255,255,0.05)'}`, borderRadius: '16px', cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}>
                          <div>
                            <span style={{ fontWeight: '600', color: t.text, fontSize: '15px' }}>{t.name}</span>
                            {!unlocked && <div style={{ fontSize: '12px', color: '#f87171', marginTop: '4px' }}>🔒 Locked (Requires winning more matches in online or pass & play)</div>}
                          </div>
                          {currentTheme === key && <span style={{ color: activeTheme.accent, fontWeight: 'bold', fontSize: '12px', background: 'rgba(255,255,255,0.08)', padding: '4px 12px', borderRadius: '8px' }}>ACTIVE</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'scores' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px' }}>📊 Detailed breakdown of your match history across all game modes:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: '#020617', padding: '20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: activeTheme.accent, fontSize: '16px' }}>🌐 Online Match</h4>
                    <p style={{ margin: '6px 0', color: '#4ade80', fontSize: '15px' }}>Wins: <strong>{scores.onlineWins}</strong></p>
                    <p style={{ margin: '6px 0', color: '#f87171', fontSize: '15px' }}>Losses: <strong>{scores.onlineLosses}</strong></p>
                  </div>
                  <div style={{ backgroundColor: '#020617', padding: '20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: activeTheme.accent, fontSize: '16px' }}>🏆 Pass & Play</h4>
                    <p style={{ margin: '6px 0', color: '#4ade80', fontSize: '15px' }}>Wins: <strong>{scores.passWins}</strong></p>
                    <p style={{ margin: '6px 0', color: '#f87171', fontSize: '15px' }}>Losses: <strong>{scores.passLosses}</strong></p>
                  </div>
                  <div style={{ backgroundColor: '#020617', padding: '20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: activeTheme.accent, fontSize: '16px' }}>🤖 Single Player (vs PC)</h4>
                    <p style={{ margin: '6px 0', color: '#4ade80', fontSize: '15px' }}>Wins: <strong>{scores.singleWins}</strong></p>
                    <p style={{ margin: '6px 0', color: '#f87171', fontSize: '15px' }}>Losses: <strong>{scores.singleLosses}</strong></p>
                  </div>
                </div>
                <button onClick={() => setScores({ onlineWins: 0, onlineLosses: 0, passWins: 0, passLosses: 0, singleWins: 0, singleLosses: 0 })} style={{ marginTop: '10px', padding: '14px 26px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '600', alignSelf: 'flex-start', fontSize: '14px', boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)' }}>
                  🔄 Reset Scores
                </button>
              </div>
            )}

            {settingsTab === 'rules' && (
              <div style={{ maxHeight: '280px', overflowY: 'auto', lineHeight: '1.8', color: '#cbd5e1', fontSize: '15px' }}>
                <p>💸 <strong>Starting Cash:</strong> Everyone begins with ₹15,000.</p>
                <p>➡️ <strong>Pass Go:</strong> Collect ₹1,500 every time you complete a lap around the board.</p>
                <p>🏠 <strong>Rent:</strong> 15% of the property base value.</p>
                <p>🏦 <strong>ATM Loans:</strong> Borrow ₹5,000 at any time with a flat interest structure.</p>
              </div>
            )}

            {settingsTab === 'maker' && (
              <div style={{ textAlign: 'center', paddingTop: '15px' }}>
                <div style={{ fontSize: '50px', marginBottom: '10px' }}>🎬💻</div>
                <h2 style={{ margin: '5px 0', color: activeTheme.accent, fontSize: '24px' }}>Abhinadan Studios</h2>
                <h4 style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '15px' }}>Directed & Engineered by Abhinandan</h4>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6', padding: '0 20px', fontSize: '14px' }}>Fusing technical architecture with digital storytelling. From full-stack multiplayer engines to short film production, this game bridges technology and creativity.</p>
                <div style={{ marginTop: '20px', fontSize: '13px', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '15px' }}>
                  App Version: 1.0.4 (Production Release)
                </div>
              </div>
            )}

            {settingsTab === 'stats' && (
              <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '30px', textAlign: 'center' }}>
                <div><h1 style={{ color: '#4ade80', margin: 0, fontSize: '48px', fontWeight: '800' }}>{totalMatches}</h1><p style={{ color: '#94a3b8', marginTop: '8px' }}>📈 Total Matches</p></div>
                <div><h1 style={{ color: activeTheme.accent, margin: 0, fontSize: '48px', fontWeight: '800' }}>{totalWins}</h1><p style={{ color: '#94a3b8', marginTop: '8px' }}>🏆 Total Wins</p></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;