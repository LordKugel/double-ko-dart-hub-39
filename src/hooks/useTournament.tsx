
import { useState, useEffect } from "react";
import { Tournament as TournamentType, Machine, Match } from "../types/tournament";
import { useMatchHandling } from "./useMatchHandling";
import { usePlayerManagement } from "./usePlayerManagement";
import { useTournamentFlow } from "./useTournamentFlow";

const STORAGE_KEY = "dart-tournament-state";

const createMachine = (id: number): Machine => ({
  id,
  quality: 3 as 1 | 2 | 3 | 4 | 5,
  isFavorite: false,
  isOutOfOrder: false,
  currentMatchId: null
});

const initialTournamentState: TournamentType = {
  id: "1",
  name: "Dart Tournament",
  players: [],
  matches: [],
  started: false,
  completed: false,
  currentRound: 0,
  roundStarted: false,
  winnersBracketMatches: [],
  losersBracketMatches: [],
  finalMatches: [],
  numberOfMachines: 3,
  machines: Array.from({ length: 3 }, (_, i) => createMachine(i + 1)),
  byePlayer: null
};

export const useTournament = () => {
  const [tournament, setTournament] = useState<TournamentType>(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error("Error parsing stored tournament data:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return initialTournamentState;
  });

  useEffect(() => {
    if (!tournament) {
      console.error("Tournament state is undefined, resetting to initial state");
      setTournament(initialTournamentState);
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tournament));
      console.log("Saved tournament state:", tournament);
    } catch (error) {
      console.error("Error saving tournament state:", error);
    }
  }, [tournament]);

  const { handleScoreUpdate } = useMatchHandling(
    tournament.matches,
    tournament.players,
    setTournament
  );

  const { generatePlayers } = usePlayerManagement(
    tournament.started,
    setTournament
  );

  const { startTournament } = useTournamentFlow(
    tournament,
    setTournament
  );

  const updateNumberOfMachines = (number: number) => {
    if (number < 1 || number > 10) {
      return;
    }

    setTournament(prev => {
      const currentMachines = prev.machines || [];
      let newMachines: Machine[];

      if (number > currentMachines.length) {
        const additionalMachines = Array.from(
          { length: number - currentMachines.length },
          (_, i) => createMachine(currentMachines.length + i + 1)
        );
        newMachines = [...currentMachines, ...additionalMachines];
      } else {
        newMachines = currentMachines.slice(0, number);
      }

      return {
        ...prev,
        numberOfMachines: number,
        machines: newMachines,
        matches: prev.matches.map(match => ({
          ...match,
          machineNumber: match.machineNumber && match.machineNumber >= number ? null : match.machineNumber
        }))
      };
    });
  };

  const updateMachine = (updatedMachine: Machine) => {
    setTournament(prev => ({
      ...prev,
      machines: prev.machines.map(machine =>
        machine.id === updatedMachine.id ? updatedMachine : machine
      )
    }));
  };

  const assignMatchToMachine = (machineId: number, matchId: string | null) => {
    console.log("Assigning match to machine", machineId, matchId);
    
    setTournament(prev => {
      const updatedMachines = prev.machines.map(machine => {
        if (machine.id === machineId) {
          return { ...machine, currentMatchId: matchId };
        }
        return machine;
      });

      const updatedMatches = prev.matches.map(match => {
        if (match.id === matchId) {
          return { ...match, machineNumber: machineId };
        }
        if (match.machineNumber === machineId && match.id !== matchId) {
          return { ...match, machineNumber: null };
        }
        return match;
      });

      return {
        ...prev,
        machines: updatedMachines,
        matches: updatedMatches
      };
    });
  };

  const confirmMatchResult = (machineId: number) => {
    setTournament(prev => {
      const machine = prev.machines.find(m => m.id === machineId);
      if (!machine || !machine.currentMatchId) return prev;

      const matchIndex = prev.matches.findIndex(m => m.id === machine.currentMatchId);
      if (matchIndex === -1) return prev;

      const match = prev.matches[matchIndex];
      
      const player1Wins = match.scores.filter(s => s.player1Won).length;
      const player2Wins = match.scores.filter(s => s.player2Won).length;
      
      if (player1Wins + player2Wins !== 3) {
        return prev;
      }
      
      // Sofort abschließen ohne Timer
      return finalizeMatch(prev, machineId);
    });
  };

  // Funktion zum finalen Abschließen des Matches - Korrigiert für korrekte Elimination-Logik
  const finalizeMatch = (currentState: TournamentType, machineId: number): TournamentType => {
    const machine = currentState.machines.find(m => m.id === machineId);
    if (!machine || !machine.currentMatchId) return currentState;
    
    const currentMatchIndex = currentState.matches.findIndex(m => m.id === machine.currentMatchId);
    if (currentMatchIndex === -1) return currentState;
    
    const currentMatch = currentState.matches[currentMatchIndex];
    
    const finalUpdatedMatch = { ...currentMatch, completed: true, countdownStarted: false };
    const finalUpdatedMatches = [...currentState.matches];
    finalUpdatedMatches[currentMatchIndex] = finalUpdatedMatch;
    
    // Bestimme Gewinner und Verlierer
    const p1Wins = currentMatch.scores.filter(s => s.player1Won).length;
    const p2Wins = currentMatch.scores.filter(s => s.player2Won).length;
    const player1IsWinner = p1Wins > p2Wins;
    const player2IsWinner = p2Wins > p1Wins;
    
    const updatedPlayers = currentState.players.map(player => {
      const isPlayer1 = player.id === currentMatch.player1.id;
      const isPlayer2 = player.id === currentMatch.player2.id;
      
      if (!isPlayer1 && !isPlayer2) return player;
      
      // Verlierer des Matches
      if ((isPlayer1 && !player1IsWinner) || (isPlayer2 && !player2IsWinner)) {
        const newLosses = player.losses + 1;
        const eliminated = player.bracket === "losers" || newLosses >= 2;
        
        // Aktualisiere auch die Spielerreferenz in allen Matches
        finalUpdatedMatches.forEach((m, idx) => {
          if (m.player1.id === player.id) {
            finalUpdatedMatches[idx] = {
              ...m,
              player1: {
                ...m.player1,
                losses: newLosses,
                eliminated,
                bracket: eliminated ? null : "losers" as "winners" | "losers" | null
              }
            };
          }
          if (m.player2.id === player.id) {
            finalUpdatedMatches[idx] = {
              ...m,
              player2: {
                ...m.player2,
                losses: newLosses,
                eliminated,
                bracket: eliminated ? null : "losers" as "winners" | "losers" | null
              }
            };
          }
        });
        
        return {
          ...player,
          losses: newLosses,
          eliminated,
          bracket: eliminated ? null : "losers" as "winners" | "losers" | null
        };
      }
      
      return player;
    });
    
    const updatedMachines = currentState.machines.map(m => {
      if (m.id === machineId) {
        return { ...m, currentMatchId: null };
      }
      return m;
    });
    
    const remainingPlayers = updatedPlayers.filter(p => !p.eliminated);
    const completed = remainingPlayers.length === 1;
    
    return {
      ...currentState,
      matches: finalUpdatedMatches,
      players: updatedPlayers,
      machines: updatedMachines,
      completed,
      roundStarted: !isRoundComplete(finalUpdatedMatches, currentState.currentRound),
      winnersBracketMatches: finalUpdatedMatches.filter(m => m.bracket === "winners"),
      losersBracketMatches: finalUpdatedMatches.filter(m => m.bracket === "losers"),
      finalMatches: finalUpdatedMatches.filter(m => m.bracket === "final")
    };
  };

  const isRoundComplete = (matches: Match[], round: number): boolean => {
    const roundMatches = matches.filter(m => m.round === round);
    return roundMatches.every(match => match.completed);
  };

  const exportTournamentData = (openInNewWindow: boolean = false) => {
    const dataStr = JSON.stringify(tournament, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    if (openInNewWindow) {
      window.open(url, '_blank');
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = `tournament-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    
    URL.revokeObjectURL(url);
  };

  const resetTournament = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTournament(initialTournamentState);
  };

  return {
    tournament,
    setTournament, // Wichtig: Hier exportiere ich jetzt die setTournament-Funktion
    handleScoreUpdate,
    generatePlayers,
    startTournament,
    exportTournamentData,
    updateNumberOfMachines,
    updateMachine,
    assignMatchToMachine,
    confirmMatchResult,
    resetTournament
  };
};

export default useTournament;
