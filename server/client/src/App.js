import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

// Connection limit added so your browser tab stops freezing
const socket = io.connect("http://localhost:5000", { reconnectionAttempts: 3 });

// --- 1. INDIA EDITION BOARD ---
const indiaBoardSpaces = [
  { name: "GO", type: "corner", icon: "➡️" },
  { name: "Guwahati", color: "#8B4513", icon: "🦏" },
  { name: "Community Chest", type: "chance", icon: "📦" },
  { name: "Bhubaneswar", color: "#8B4513", icon: "🛕" },
  { name: "Income Tax", type: "tax", icon: "📉" },
  { name: "Chennai Ctrl", type: "station", icon: "🚆" },
  { name: "Panaji", color: "#87CEEB", icon: "🏖️" },
  { name: "Chance", type: "chance", icon: "❓" },
  { name: "Agra", color: "#87CEEB", icon: "🕌" },
  { name: "Patna", color: "#87CEEB", icon: "🌾" },
  { name: "JAIL", type: "corner", icon: "⛓️" },
  { name: "Jaipur", color: "#FF1493", icon: "🏰" },
  { name: "💡 Electric", type: "utility", icon: "⚡" },
  { name: "Udaipur", color: "#FF1493", icon: "🌊" },
  { name: "Ludhiana", color: "#FF1493", icon: "🚜" },
  { name: "Howrah", type: "station", icon: "🌉" },
  { name: "Chandigarh", color: "#FFA500", icon: "🏙️" },
  { name: "Community Chest", type: "chance", icon: "📦" },
  { name: "Amritsar", color: "#FFA500", icon: "🛕" },
  { name: "Shimla", color: "#FFA500", icon: "🏔️" },
  { name: "FREE PARKING", type: "corner", icon: "🅿️" },
  { name: "Kochi", color: "#FF0000", icon: "🥥" },
  { name: "Chance", type: "chance", icon: "❓" },
  { name: "Bengaluru", color: "#FF0000", icon: "💻" },
  { name: "Hyderabad", color: "#FF0000", icon: "🍛" },
  { name: "New Delhi", type: "station", icon: "🏛️" },
  { name: "Kanpur", color: "#FFD700", icon: "🏭" },
  { name: "Lucknow", color: "#FFD700", icon: "🍢" },
  { name: "🚰 Water", type: "utility", icon: "💧" },
  { name: "Surat", color: "#FFD700", icon: "💎" },
  { name: "GO TO JAIL", type: "corner", icon: "🚨" },
  { name: "Pune", color: "#008000", icon: "🎓" },
  { name: "Ahmedabad", color: "#008000", icon: "🪢" },
  { name: "Community Chest", type: "chance", icon: "📦" },
  { name: "Kolkata", color: "#008000", icon: "🚊" },
  { name: "Mumbai CST", type: "station", icon: "🚉" },
  { name: "Chance", type: "chance", icon: "❓" },
  { name: "Chennai", color: "#00008B", icon: "🎬" },
  { name: "Luxury Tax", type: "tax", icon: "💍" },
  { name: "Mumbai", color: "#00008B", icon: "🌆" }
];

// --- 2. GLOBAL EDITION BOARD ---
const globalBoardSpaces = [
  { name: "GO", type: "corner", icon: "➡️" },
  { name: "Havana", color: "#8B4513", icon: "🇨🇺" },
  { name: "Community Chest", type: "chance", icon: "📦" },
  { name: "Madrid", color: "#8B4513", icon: "🇪🇸" },
  { name: "Income Tax", type: "tax", icon: "📉" },
  { name: "North Station", type: "station", icon: "🚆" },
  { name: "Athens", color: "#87CEEB", icon: "🇬🇷" },
  { name: "Chance", type: "chance", icon: "❓" },
  { name: "Dublin", color: "#87CEEB", icon: "🇮🇪" },
  { name: "Copenhagen", color: "#87CEEB", icon: "🇩🇰" },
  { name: "JAIL", type: "corner", icon: "⛓️" },
  { name: "Paris", color: "#FF1493", icon: "🇫🇷" },
  { name: "💡 Electric", type: "utility", icon: "⚡" },
  { name: "Rome", color: "#FF1493", icon: "🇮🇹" },
  { name: "Berlin", color: "#FF1493", icon: "🇩🇪" },
  { name: "West Station", type: "station", icon: "🚆" },
  { name: "Toronto", color: "#FFA500", icon: "🇨🇦" },
  { name: "Community Chest", type: "chance", icon: "📦" },
  { name: "Seoul", color: "#FFA500", icon: "🇰🇷" },
  { name: "Beijing", color: "#FFA500", icon: "🇨🇳" },
  { name: "FREE PARKING", type: "corner", icon: "🅿️" },
  { name: "Dubai", color: "#FF0000", icon: "🇦🇪" },
  { name: "Chance", type: "chance", icon: "❓" },
  { name: "Sydney", color: "#FF0000", icon: "🇦🇺" },
  { name: "Singapore", color: "#FF0000", icon: "🇸🇬" },
  { name: "South Station", type: "station", icon: "🚆" },
  { name: "London", color: "#FFD700", icon: "🇬🇧" },
  { name: "Tokyo", color: "#FFD700", icon: "🇯🇵" },
  { name: "🚰 Water", type: "utility", icon: "💧" },
  { name: "Hong Kong", color: "#FFD700", icon: "🇭🇰" },
  { name: "GO TO JAIL", type: "corner", icon: "🚨" },
  { name: "San Francisco", color: "#008000", icon: "🌉" },
  { name: "Los Angeles", color: "#008000", icon: "🌴" },
  { name: "Community Chest", type: "chance", icon: "📦" },
  { name: "Chicago", color: "#008000", icon: "🍕" },
  { name: "East Station", type: "station", icon: "🚆" },
  { name: "Chance", type: "chance", icon: "❓" },
  { name: "Washington DC", color: "#00008B", icon: "🦅" },
  { name: "Luxury Tax", type: "tax", icon: "💍" },
  { name: "New York", color: "#00008B", icon: "🗽" }
];

const getGridPosition = (index) => {
  if (index === 0) return { gridColumn: 11, gridRow: 11 }; 
  if (index > 0 && index < 10) return { gridColumn: 11 - index, gridRow: 11 };
  if (index === 10) return { gridColumn: 1, gridRow: 11 };
  if (index > 10 && index < 20) return { gridColumn: 1, gridRow: 11 - (index - 10) };
  if (index === 20) return { gridColumn: 1, gridRow: 1 };
  if (index > 20 && index < 30) return { gridColumn: 1 + (index - 20), gridRow: 1 };
  if (index === 30) return { gridColumn: 11, gridRow: 1 };
  if (index > 30 && index < 40) return { gridColumn: 11, gridRow: 1 + (index - 30) };
};

const getTileDirection = (index) => {
  if (index > 20 && index < 30) return 'column'; 
  if (index > 0 && index < 10) return 'column-reverse'; 
  if (index > 10 && index < 20) return 'row-reverse'; 
  if (index > 30 && index < 40) return 'row'; 
  return 'column'; 
};

const getColorStyle = (index, color) => {
  if (!color) return null;
  if (index > 20 && index < 30) return { height: '15px', width: '100%', backgroundColor: color, marginTop: 'auto' };
  if (index > 0 && index < 10) return { height: '15px', width: '100%', backgroundColor: color, marginBottom: 'auto' };
  if (index > 10 && index < 20) return { width: '15px', height: '100%', backgroundColor: color, marginRight: 'auto' };
  if (index > 30 && index < 40) return { width: '15px', height: '100%', backgroundColor: color, marginLeft: 'auto' };
  return { height: '15px', width: '100%', backgroundColor: color };
};

const tokenColors = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71"];
const nonBuyable = [0, 2, 4, 7, 10, 17, 20, 22, 30, 33, 36, 38]; 
const isBuyable = (pos) => !nonBuyable.includes(pos);

function App() {
  const [currentView, setCurrentView] = useState('menu'); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile');
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("Abhi"); 
  const [room, setRoom] = useState("");
  const [lastRoll, setLastRoll] = useState(null);
  
  const [players, setPlayers] = useState({});
  const [ownership, setOwnership] = useState({});
  
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(null); 
  const [boardEdition, setBoardEdition] = useState("India");
  const [isRolling, setIsRolling] = useState(false);

  // --- RESPONSIVE STATE ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  // --- LOCAL PLAY & AI STATES ---
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false); 
  const [localNames, setLocalNames] = useState(["Abhi", "Player 2", "", ""]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [hasRolledThisTurn, setHasRolledThisTurn] = useState(false);

  // Screen Resize Listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    
    socket.on("dice_result", (data) => {
      if(isLocalMode) return; 
      setIsRolling(true); 
      setTimeout(() => { setLastRoll(data); setIsRolling(false); }, 800);
    });

    socket.on("update_state", (roomState) => {
      if(isLocalMode) return;
      setPlayers(roomState.players);
      setOwnership(roomState.ownership);
    });
    return () => { 
      socket.off("connect"); socket.off("disconnect"); 
      socket.off("dice_result"); socket.off("update_state");
    };
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

  // --- THE AI BRAIN ---
  useEffect(() => {
    if (isAiMode && username === "PC Tycoon" && !hasRolledThisTurn) {
      const aiThinkingTimer = setTimeout(() => {
        rollDice();
      }, 1000);
      return () => clearTimeout(aiThinkingTimer);
    }
    // eslint-disable-next-line
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
    // eslint-disable-next-line
  }, [hasRolledThisTurn, isRolling, username, isAiMode]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
      else { audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e)); }
    }
  };

  const playMusicAndNavigate = (view) => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
    }
    setCurrentView(view);
  };

  const joinOnlineRoom = () => {
    if (username !== "" && room !== "") {
      setIsLocalMode(false);
      setIsAiMode(false);
      socket.emit("join_room", { username, room });
      setCountdown(3); 
    }
  };

  const startLocalGame = () => {
    const activePlayers = localNames.filter(n => n.trim() !== "");
    if (activePlayers.length < 2) return alert("You need at least 2 players!");
    
    setIsLocalMode(true);
    setIsAiMode(false);
    setTurnIndex(0);
    setUsername(activePlayers[0]); 
    setHasRolledThisTurn(false);
    setLastRoll(null);

    const initialPlayers = {};
    activePlayers.forEach(name => {
      initialPlayers[name] = { position: 0, cash: 15000, debt: 0 };
    });
    setPlayers(initialPlayers);
    setOwnership({});
    setCountdown(3);
  };

  const startAiGame = () => {
    setIsLocalMode(true);
    setIsAiMode(true);
    setTurnIndex(0);
    
    const playerName = localNames[0].trim() !== "" ? localNames[0] : "Abhi";
    setUsername(playerName); 
    setHasRolledThisTurn(false);
    setLastRoll(null);

    setPlayers({
      [playerName]: { position: 0, cash: 15000, debt: 0 },
      "PC Tycoon": { position: 0, cash: 15000, debt: 0 } 
    });
    setOwnership({});
    setCountdown(3);
  };

  const rollDice = () => {
    if (hasRolledThisTurn && isLocalMode) return; 
    
    if (!isLocalMode) {
      socket.emit("roll_dice", { username, room });
    } else {
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      const total = dice1 + dice2;
      
      setIsRolling(true);
      setHasRolledThisTurn(true);
      
      setTimeout(() => {
        setLastRoll({ username, dice1, dice2, total });
        setIsRolling(false);
        
        setPlayers(prev => {
          let updated = { ...prev };
          let p = { ...updated[username] };
          
          p.position += total;
          if (p.position > 39) {
            p.position = p.position % 40;
            p.cash += 1500; 
          }
          
          if (p.position === 4) p.cash -= 2000;
          if (p.position === 38) p.cash -= 1000;
          
          const owner = ownership[p.position];
          if (owner && owner !== username) {
            const rent = (p.position * 100 + 1000) * 0.15;
            p.cash -= rent;
            updated[owner].cash += rent;
          }
          
          updated[username] = p;
          return updated;
        });
      }, 800);
    }
  };

  const endLocalTurn = () => {
    const activePlayers = Object.keys(players);
    const currentIdx = activePlayers.indexOf(username);
    const nextIdx = (currentIdx + 1) % activePlayers.length;
    
    setUsername(activePlayers[nextIdx]); 
    setHasRolledThisTurn(false);
    setLastRoll(null);
  };

  const buyProperty = () => {
    if (!isLocalMode) {
      socket.emit("buy_property", { username, room });
    } else {
      const price = myPos * 100 + 1000;
      if (isBuyable(myPos) && !ownership[myPos] && players[username].cash >= price) {
        setPlayers(prev => ({ ...prev, [username]: { ...prev[username], cash: prev[username].cash - price } }));
        setOwnership(prev => ({ ...prev, [myPos]: username }));
      }
    }
  };

  const takeLoan = () => {
    if (!isLocalMode) {
      socket.emit("take_loan", { username, room });
    } else {
      setPlayers(prev => ({ ...prev, [username]: { ...prev[username], cash: prev[username].cash + 5000, debt: prev[username].debt + 5400 } }));
    }
  };

  const repayLoan = () => {
    if (!isLocalMode) {
      socket.emit("repay_loan", { username, room });
    } else {
      const p = players[username];
      if (p.cash >= p.debt) {
        setPlayers(prev => ({ ...prev, [username]: { ...prev[username], cash: prev[username].cash - prev[username].debt, debt: 0 } }));
      }
    }
  };

  const activeBoard = boardEdition === "Global" ? globalBoardSpaces : indiaBoardSpaces;
  const myPlayer = players[username];
  const myPos = myPlayer ? myPlayer.position : 0;
  const currentSpace = activeBoard[myPos];
  const propertyPrice = myPos * 100 + 1000;
  const propertyOwner = ownership[myPos];

  const menuBtnStyle = {
    padding: '15px 40px', fontSize: '20px', fontWeight: 'bold', width: '300px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#2c3e50', border: '3px solid #f1c40f', 
    borderRadius: '50px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', zIndex: 10
  };
  const activeTabStyle = { padding: '10px 20px', borderBottom: '3px solid #f1c40f', fontWeight: 'bold', cursor: 'pointer', color: '#f1c40f' };
  const inactiveTabStyle = { padding: '10px 20px', color: '#ccc', cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: currentView === 'menu' ? '#0a0a0a' : '#e9ecef', fontFamily: 'sans-serif', position: 'relative', overflow: isMobile ? 'auto' : 'hidden' }}>
      
      <style>{`
        @keyframes flip-dice { 0% { transform: rotateX(0deg) rotateY(0deg) scale(1); } 50% { transform: rotateX(360deg) rotateY(180deg) scale(1.4); } 100% { transform: rotateX(720deg) rotateY(360deg) scale(1); } }
        .rolling-dice { animation: flip-dice 0.8s ease-in-out; display: inline-block; }
      `}</style>

      {/* WEB MUSIC LINK ADDED HERE */}
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" loop preload="auto" />

      {/* TOP CONTROLS */}
      <div style={{ position: 'absolute', top: '20px', right: '30px', display: 'flex', gap: '15px', zIndex: 50 }}>
        {currentView !== 'board' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '18px', color: currentView === 'menu' ? '#f1c40f' : 'black' }}>
            👤 {username}
          </div>
        )}
        <button onClick={toggleAudio} style={{ fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer', filter: currentView === 'menu' ? 'drop-shadow(0 0 5px #f1c40f)' : 'none' }}>
          {isPlaying ? '🔊' : '🔇'}
        </button>
        {currentView !== 'board' && (
          <button onClick={() => setIsSettingsOpen(true)} style={{ fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer', filter: 'drop-shadow(0 0 5px #f1c40f)' }}>⚙️</button>
        )}
      </div>

      {/* COUNTDOWN */}
      {countdown !== null && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <h1 style={{ color: '#f1c40f', fontSize: '150px', margin: 0, animation: 'pulse 1s infinite' }}>{countdown}</h1>
        </div>
      )}

      {/* MENU */}
      {currentView === 'menu' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '8vh', height: '100vh', background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)' }}>
          <h1 style={{ fontSize: '90px', color: '#f1c40f', margin: '0 0 10px 0', textShadow: '0 0 25px rgba(241, 196, 15, 0.7)', fontFamily: 'serif', textAlign: 'center' }}>ব্যবসায়ী</h1>
          <h2 style={{ color: '#fff', marginTop: 0, letterSpacing: isMobile ? '5px' : '10px', textShadow: '2px 2px 4px #000', zIndex: 10, textAlign: 'center' }}>{boardEdition === "Global" ? "GLOBAL EDITION" : "BUSINESS INDIA"}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px', zIndex: 10 }}>
            <button onClick={() => playMusicAndNavigate('lobby')} style={{ ...menuBtnStyle, backgroundColor: '#f1c40f' }}>Online Multiplayer</button>
            <button onClick={() => { playMusicAndNavigate('menu'); startAiGame(); }} style={menuBtnStyle}>Single Player (vs PC)</button>
            <button onClick={() => playMusicAndNavigate('localLobby')} style={menuBtnStyle}>Local Pass & Play</button>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100vw', display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 5 }}>
            {/* WEB IMAGE LINK ADDED HERE */}
            <img src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80" alt="Business Tycoons" style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'cover', objectPosition: 'bottom', filter: 'drop-shadow(0 -10px 25px rgba(0,0,0,0.8))', mixBlendMode: 'lighten' }} />
          </div>
        </div>
      )}

      {/* ONLINE LOBBY */}
      {currentView === 'lobby' && countdown === null && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15vh' }}>
          <button onClick={() => setCurrentView('menu')} style={{ position: 'absolute', top: '20px', left: '30px', padding: '10px 20px', cursor: 'pointer' }}>⬅️ Back</button>
          <div style={{ padding: isMobile ? '20px' : '40px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', textAlign: 'center', width: isMobile ? '90%' : 'auto' }}>
            <h2 style={{ marginTop: 0 }}>Join an Online Match</h2>
            <input type="text" placeholder="Your Name" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '12px', margin: '10px', width: '80%', fontSize: '16px' }} /><br />
            <input type="text" placeholder="Room Code (e.g., INDIA)" onChange={(e) => setRoom(e.target.value)} style={{ padding: '12px', margin: '10px', width: '80%', fontSize: '16px' }} /><br />
            <button onClick={joinOnlineRoom} style={{ marginTop: '20px', padding: '15px 40px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' }}>Enter Board</button>
          </div>
        </div>
      )}

      {/* LOCAL LOBBY */}
      {currentView === 'localLobby' && countdown === null && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10vh' }}>
          <button onClick={() => setCurrentView('menu')} style={{ position: 'absolute', top: '20px', left: '30px', padding: '10px 20px', cursor: 'pointer' }}>⬅️ Back</button>
          <div style={{ padding: isMobile ? '20px' : '40px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', textAlign: 'center', width: isMobile ? '90%' : 'auto' }}>
            <h2 style={{ marginTop: 0, color: '#d32f2f' }}>Local Pass & Play</h2>
            <p>Enter 2 to 4 player names:</p>
            {[0, 1, 2, 3].map(i => (
              <div key={i}>
                <input type="text" placeholder={`Player ${i+1} Name`} value={localNames[i]} 
                  onChange={(e) => { const newNames = [...localNames]; newNames[i] = e.target.value; setLocalNames(newNames); }} 
                  style={{ padding: '12px', margin: '5px', width: '80%', fontSize: '16px' }} 
                />
              </div>
            ))}
            <button onClick={startLocalGame} style={{ marginTop: '20px', padding: '15px 40px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' }}>Start Offline Match</button>
          </div>
        </div>
      )}

      {/* BOARD: UPDATED WITH RESPONSIVE FLEXBOX */}
      {currentView === 'board' && (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', alignItems: isMobile ? 'center' : 'flex-start', gap: '20px', padding: '10px', marginTop: (isLocalMode && isMobile) ? '40px' : '0' }}>
          
          {isLocalMode && (
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', backgroundColor: username === "PC Tycoon" ? '#e74c3c' : '#f1c40f', color: username === "PC Tycoon" ? 'white' : 'black', textAlign: 'center', padding: '10px', fontSize: isMobile ? '16px' : '20px', fontWeight: 'bold', zIndex: 10, transition: 'background-color 0.5s' }}>
                 {username === "PC Tycoon" ? "🤖 PC Tycoon is thinking..." : `It is ${username}'s Turn!`}
             </div>
          )}

          <div style={{ width: isMobile ? '100%' : '250px', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: (isLocalMode && !isMobile) ? '40px' : '0' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0, borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Players</h3>
              {Object.keys(players).map((p, i) => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '5px', backgroundColor: (isLocalMode && p === username) ? '#fdf3d1' : 'transparent', borderRadius: '5px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: tokenColors[i % 4], marginRight: '10px', border: '2px solid #333' }}></div>
                  <strong style={{ flex: 1 }}>{p}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC BOARD SIZING */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(11, 8.5vw)' : 'repeat(11, 75px)', gridTemplateRows: isMobile ? 'repeat(11, 8.5vw)' : 'repeat(11, 75px)', gap: '2px', backgroundColor: '#2c3e50', padding: '4px', border: '4px solid #111', borderRadius: '5px', marginTop: (isLocalMode && !isMobile) ? '40px' : '0' }}>
            <div style={{ gridColumn: '2 / 11', gridRow: '2 / 11', backgroundColor: '#fdf3d1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', margin: '10px', border: '3px dashed #ccc', padding: '10px' }}>
              <h1 style={{ color: '#d32f2f', fontSize: isMobile ? '30px' : '50px', margin: 0, textAlign: 'center' }}>
                {boardEdition === "Global" ? "GLOBAL" : "ব্যবসায়ী"}
              </h1>
              
              <button onClick={rollDice} disabled={(isLocalMode && hasRolledThisTurn) || (isAiMode && username === "PC Tycoon")} style={{ marginTop: isMobile ? '15px' : '30px', padding: isMobile ? '10px 20px' : '15px 40px', fontSize: isMobile ? '18px' : '24px', cursor: ((isLocalMode && hasRolledThisTurn) || (isAiMode && username === "PC Tycoon")) ? 'not-allowed' : 'pointer', backgroundColor: ((isLocalMode && hasRolledThisTurn) || (isAiMode && username === "PC Tycoon")) ? '#bdc3c7' : '#e74c3c', color: 'white', border: 'none', borderRadius: '50px', boxShadow: '0 5px 0 #c0392b' }}>
                ROLL DICE 🎲
              </button>
              
              <div style={{ marginTop: '20px', fontSize: isMobile ? '16px' : '20px', textAlign: 'center', height: isMobile ? '80px' : '100px' }}>
                {lastRoll && !isRolling && <strong>{lastRoll.username} rolled {lastRoll.total}</strong>}
                {isRolling && <strong>Rolling...</strong>}
                <div style={{ fontSize: isMobile ? '24px' : '30px', marginTop: '10px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <span className={isRolling ? "rolling-dice" : ""} style={{ width: isMobile ? '40px' : '60px', height: isMobile ? '40px' : '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #333', backgroundColor: 'white', borderRadius: '10px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}>{isRolling ? '🎲' : (lastRoll ? lastRoll.dice1 : '?')}</span>
                  <span className={isRolling ? "rolling-dice" : ""} style={{ width: isMobile ? '40px' : '60px', height: isMobile ? '40px' : '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #333', backgroundColor: 'white', borderRadius: '10px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}>{isRolling ? '🎲' : (lastRoll ? lastRoll.dice2 : '?')}</span>
                </div>
              </div>
            </div>

            {activeBoard.map((space, index) => {
              const pos = getGridPosition(index);
              const direction = getTileDirection(index);
              const colorStyle = getColorStyle(index, space.color);
              const playersHere = Object.keys(players).filter(p => players[p].position === index);

              return (
                <div key={index} style={{ ...pos, backgroundColor: '#fff', border: '1px solid #999', display: 'flex', flexDirection: direction, fontSize: isMobile ? '2vw' : '10px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  {space.color && <div style={{...colorStyle, height: isMobile ? '10px' : colorStyle.height}}></div>}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
                    <div style={{ fontSize: isMobile ? '3vw' : '16px', marginBottom: '1px' }}>{space.icon}</div>
                    <div style={{ fontWeight: 'bold', lineHeight: '1.1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '90%' }}>{space.name}</div>
                  </div>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '2px', pointerEvents: 'none' }}>
                    {playersHere.map((p, i) => (
                      <div key={i} style={{ width: isMobile ? '12px' : '18px', height: isMobile ? '12px' : '18px', borderRadius: '50%', backgroundColor: tokenColors[Object.keys(players).indexOf(p) % 4], border: '1px solid white', boxShadow: '0 1px 2px rgba(0,0,0,0.5)' }} title={p} />
                    ))}
                  </div>
                  {ownership[index] && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.2)', pointerEvents: 'none' }} />}
                </div>
              );
            })}
          </div>

          <div style={{ width: isMobile ? '100%' : '300px', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: (isLocalMode && !isMobile) ? '40px' : '0', marginBottom: isMobile ? '30px' : '0' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>💰 Your Bank</h3>
              <h2 style={{ fontSize: '40px', margin: '10px 0', color: '#2ecc71' }}>₹{myPlayer ? Math.floor(myPlayer.cash) : 0}</h2>
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f4f4f9', borderRadius: '10px', border: '1px solid #ddd' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>🏦 ATM</h4>
                {myPlayer && myPlayer.debt > 0 ? (
                  <>
                    <p style={{ color: '#e74c3c', fontWeight: 'bold', margin: '5px 0' }}>Debt: ₹{Math.floor(myPlayer.debt)}</p>
                    <button onClick={repayLoan} disabled={isAiMode && username === "PC Tycoon"} style={{ width: '100%', padding: '8px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Repay Loan</button>
                  </>
                ) : (
                  <button onClick={takeLoan} disabled={isAiMode && username === "PC Tycoon"} style={{ width: '100%', padding: '8px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Take ₹5,000 Loan</button>
                )}
              </div>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', border: '2px solid #f1c40f' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>📍 {currentSpace?.icon} {currentSpace?.name}</h3>
              {currentSpace?.color || currentSpace?.type === 'station' || currentSpace?.type === 'utility' ? (
                <>
                  <p style={{ fontSize: '18px' }}>Price: <strong>₹{propertyPrice}</strong></p>
                  {!propertyOwner ? (
                    <button onClick={buyProperty} disabled={isAiMode && username === "PC Tycoon"} style={{ width: '100%', padding: '15px', backgroundColor: (isAiMode && username === "PC Tycoon") ? '#eee' : '#f1c40f', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: (isAiMode && username === "PC Tycoon") ? 'not-allowed' : 'pointer', borderRadius: '5px' }}>BUY PROPERTY</button>
                  ) : (
                    <div style={{ padding: '15px', backgroundColor: propertyOwner === username ? '#e8f8f5' : '#fdedec', borderRadius: '5px', color: propertyOwner === username ? 'green' : 'red', fontWeight: 'bold', textAlign: 'center' }}>
                      {propertyOwner === username ? '✅ Yours' : `🏠 Owned by ${propertyOwner}`}
                    </div>
                  )}
                </>
              ) : (
                <p style={{ color: '#7f8c8d' }}>Action Space</p>
              )}
            </div>

            {isLocalMode && (
              <button onClick={endLocalTurn} disabled={isAiMode && username === "PC Tycoon"} style={{ width: '100%', padding: '20px', backgroundColor: (isAiMode && username === "PC Tycoon") ? '#7f8c8d' : '#2c3e50', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '20px', cursor: (isAiMode && username === "PC Tycoon") ? 'not-allowed' : 'pointer', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
                END YOUR TURN ➡️
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODAL */}
      {isSettingsOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ width: '90%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#1a1a1a', color: '#fff', borderRadius: '15px', padding: '30px', position: 'relative', border: '2px solid #f1c40f', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            <button onClick={() => setIsSettingsOpen(false)} style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#fff' }}>❌</button>
            <h2 style={{ marginTop: 0, borderBottom: '2px solid #333', paddingBottom: '10px', color: '#f1c40f' }}>Game Settings</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <div onClick={() => setSettingsTab('profile')} style={settingsTab === 'profile' ? activeTabStyle : inactiveTabStyle}>Profile</div>
              <div onClick={() => setSettingsTab('rules')} style={settingsTab === 'rules' ? activeTabStyle : inactiveTabStyle}>Rules</div>
              <div onClick={() => setSettingsTab('maker')} style={settingsTab === 'maker' ? activeTabStyle : inactiveTabStyle}>About Maker</div>
              <div onClick={() => setSettingsTab('stats')} style={settingsTab === 'stats' ? activeTabStyle : inactiveTabStyle}>Stats</div>
            </div>
            
            {settingsTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <label style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center' }}>
                  <strong>Player Name:</strong> 
                  <input type="text" value={localNames[0] || username} onChange={(e) => { setUsername(e.target.value); setLocalNames([e.target.value, ...localNames.slice(1)])}} disabled={isLocalMode} style={{ padding: '10px', width: '250px', marginLeft: isMobile ? '0' : '15px', marginTop: isMobile ? '10px' : '0', borderRadius: '5px', border: 'none' }}/>
                </label>
                <label style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center' }}>
                  <strong>Board Edition:</strong> 
                  <select value={boardEdition} onChange={(e) => setBoardEdition(e.target.value)} style={{ padding: '10px', marginLeft: isMobile ? '0' : '10px', marginTop: isMobile ? '10px' : '0', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
                    <option value="India">Business India (Default)</option>
                    <option value="Global">Global Monopoly</option>
                  </select>
                </label>
              </div>
            )}
            {settingsTab === 'rules' && (
              <div style={{ maxHeight: '250px', overflowY: 'auto', lineHeight: '1.8' }}>
                <p>💸 <strong>Starting Cash:</strong> Everyone begins with ₹15,000.</p>
                <p>➡️ <strong>Pass Go:</strong> Collect ₹1,500 every time you complete a lap.</p>
                <p>🏠 <strong>Rent:</strong> 15% of the property base value.</p>
                <p>🏦 <strong>ATM Loans:</strong> Borrow ₹5,000 at any time for an 8% flat interest rate.</p>
              </div>
            )}
            {settingsTab === 'maker' && (
              <div style={{ textAlign: 'center', paddingTop: '10px' }}>
                <div style={{ fontSize: '60px', marginBottom: '10px' }}>🎬💻</div>
                <h2 style={{ margin: '5px 0', color: '#f1c40f' }}>Abhinadan Studios</h2>
                <h4 style={{ margin: '0 0 15px 0', color: '#aaa' }}>Directed & Engineered by Abhinandan</h4>
                <p style={{ color: '#ddd', lineHeight: '1.6', padding: '0 30px' }}>Fusing the technical architecture of a B.Tech background with a deep passion for digital storytelling... From developing full-stack multiplayer engines to producing engaging short films and acting, this game is a reflection of bridging tech and creative arts.</p>
              </div>
            )}
            {settingsTab === 'stats' && (
              <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '30px', textAlign: 'center' }}>
                <div><h1 style={{ color: '#2ecc71', margin: 0, fontSize: '50px' }}>14</h1><p>Matches</p></div>
                <div><h1 style={{ color: '#f1c40f', margin: 0, fontSize: '50px' }}>8</h1><p>Wins</p></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;