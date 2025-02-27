
import { useState, useEffect } from "react";
import { Tournament as TournamentType, Machine, Match } from "../types/tournament";
import { useMatchHandling } from "./useMatchHandling";
import { usePlayerManagement } from "./usePlayerManagement";
import { useTournamentFlow } from "./useTournamentFlow";
import { toast } from "@/components/ui/use-toast";

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
  machines: Array.from({ length: 3 }, (_, i) => createMachine(i + 1))
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
      toast({
        title: "Ungültige Anzahl",
        description: "Die Anzahl der Automaten muss zwischen 1 und 10 liegen",
        variant: "destructive"
      });
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

    toast({
      title: "Anzahl aktualisiert",
      description: `Die Anzahl der Automaten wurde auf ${number} gesetzt`
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
      // Zuerst aktualisieren wir die Maschine
      const updatedMachines = prev.machines.map(machine => {
        if (machine.id === machineId) {
          return { ...machine, currentMatchId: matchId };
        }
        return machine;
      });

      // Dann aktualisieren wir das Match
      const updatedMatches = prev.matches.map(match => {
        if (match.id === matchId) {
          return { ...match, machineNumber: machineId };
        }
        // Wenn ein anderes Match bereits dieser Maschine zugewiesen war, entfernen wir die Zuweisung
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

    if (matchId) {
      toast({
        title: "Match zugewiesen",
        description: `Match wurde Automat ${machineId} zugewiesen`
      });
    }
  };

  const confirmMatchResult = (machineId: number) => {
    setTournament(prev => {
      const machine = prev.machines.find(m => m.id === machineId);
      if (!machine || !machine.currentMatchId) return prev;

      const matchIndex = prev.matches.findIndex(m => m.id === machine.currentMatchId);
      if (matchIndex === -1) return prev;

      const match = prev.matches[matchIndex];
      
      // Prüfen, ob alle drei Spiele gespielt wurden
      const player1Wins = match.scores.filter(s => s.player1Won).length;
      const player2Wins = match.scores.filter(s => s.player2Won).length;
      
      if (player1Wins + player2Wins !== 3) {
        toast({
          title: "Unvollständiges Match",
          description: "Es müssen alle drei Spiele gespielt werden.",
          variant: "destructive"
        });
        return prev;
      }

      // Starte den Countdown
      toast({
        title: "Match vollständig",
        description: "Ergebnisse können noch 10 Sekunden lang geändert werden"
      });
      
      // Markiere das Match als "countdownStarted"
      const updatedMatches = [...prev.matches];
      updatedMatches[matchIndex] = {
        ...match,
        countdownStarted: true
      };
      
      // Timer starten, der das Match nach 10 Sekunden abschließt
      setTimeout(() => {
        setTournament(currentState => {
          // Aktuelle Version des Matches holen
          const currentMatchIndex = currentState.matches.findIndex(m => m.id === machine.currentMatchId);
          if (currentMatchIndex === -1) return currentState;
          
          const currentMatch = currentState.matches[currentMatchIndex];
          
          // Match als abgeschlossen markieren
          const finalUpdatedMatch = { ...currentMatch, completed: true, countdownStarted: false };
          const finalUpdatedMatches = [...currentState.matches];
          finalUpdatedMatches[currentMatchIndex] = finalUpdatedMatch;
          
          // Spieler aktualisieren
          const updatedPlayers = currentState.players.map(player => {
            // Gewinner bestimmen
            const isPlayer1 = player.id === currentMatch.player1.id;
            const isPlayer2 = player.id === currentMatch.player2.id;
            
            if (!isPlayer1 && !isPlayer2) return player;
            
            const p1Wins = currentMatch.scores.filter(s => s.player1Won).length;
            const p2Wins = currentMatch.scores.filter(s => s.player2Won).length;
            const isWinner = isPlayer1 ? p1Wins > p2Wins : p2Wins > p1Wins;
            const isLoser = !isWinner;
            
            if (isLoser) {
              const newLosses = player.losses + 1;
              // Eliminiert, wenn im Verlierer-Bracket oder 2 Niederlagen
              const eliminated = player.bracket === "losers" || newLosses >= 2;
              
              return {
                ...player,
                losses: newLosses,
                eliminated,
                bracket: eliminated ? null : "losers" as "winners" | "losers" | null
              };
            }
            
            return player;
          });
          
          // Maschine freigeben
          const updatedMachines = currentState.machines.map(m => {
            if (m.id === machineId) {
              return { ...m, currentMatchId: null };
            }
            return m;
          });
          
          toast({
            title: "Match abgeschlossen",
            description: "Das Match wurde abgeschlossen und die Ergebnisse wurden gespeichert."
          });
          
          // Turnier auf Abschluss prüfen
          const remainingPlayers = updatedPlayers.filter(p => !p.eliminated);
          const completed = remainingPlayers.length === 1;
          
          // Wenn es einen Gewinner gibt, zeige eine spezielle Meldung
          if (completed && remainingPlayers.length === 1) {
            const winner = remainingPlayers[0];
            toast({
              title: "🏆 Turniersieger",
              description: `${winner.firstName} ${winner.lastName} hat das Turnier gewonnen!`,
              duration: 10000,
            });
          }
          
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
        });
      }, 10000);
      
      return {
        ...prev,
        matches: updatedMatches
      };
    });
  };

  // Hilfsfunktion, um zu prüfen, ob eine Runde abgeschlossen ist
  const isRoundComplete = (matches: Match[], round: number): boolean => {
    const roundMatches = matches.filter(m => m.round === round);
    return roundMatches.every(match => match.completed);
  };

  const exportTournamentData = () => {
    const dataStr = JSON.stringify(tournament, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tournament-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export erfolgreich",
      description: "Die Turnierdaten wurden erfolgreich exportiert"
    });
  };

  // Neue Funktion zum Zurücksetzen des Turniers
  const resetTournament = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTournament(initialTournamentState);
    
    toast({
      title: "Turnier zurückgesetzt",
      description: "Das Turnier wurde erfolgreich auf den Ausgangszustand zurückgesetzt"
    });
  };

  return {
    tournament,
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
