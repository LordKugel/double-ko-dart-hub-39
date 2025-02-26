
import { useState, useEffect } from "react";
import { Tournament as TournamentType, Machine, Match } from "../types/tournament";
import { useMatchHandling } from "./useMatchHandling";
import { usePlayerManagement } from "./usePlayerManagement";
import { useTournamentFlow } from "./useTournamentFlow";
import { toast } from "@/components/ui/use-toast";

const STORAGE_KEY = "dart-tournament-state";

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
  machines: Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    quality: 3,
    isFavorite: false,
    isOutOfOrder: false,
    currentMatchId: null
  }))
};

export const useTournament = () => {
  const [tournament, setTournament] = useState<TournamentType>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : initialTournamentState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tournament));
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
        // Füge neue Automaten hinzu
        const additionalMachines = Array.from(
          { length: number - currentMachines.length },
          (_, i) => ({
            id: currentMachines.length + i + 1,
            quality: 3,
            isFavorite: false,
            isOutOfOrder: false,
            currentMatchId: null
          })
        );
        newMachines = [...currentMachines, ...additionalMachines];
      } else {
        // Reduziere die Anzahl der Automaten
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
    setTournament(prev => ({
      ...prev,
      machines: prev.machines.map(machine => {
        if (machine.id === machineId) {
          return { ...machine, currentMatchId: matchId };
        }
        return machine;
      }),
      matches: prev.matches.map(match => ({
        ...match,
        machineNumber: match.id === matchId ? machineId : match.machineNumber
      }))
    }));

    if (matchId) {
      toast({
        title: "Match zugewiesen",
        description: `Match wurde Automat ${machineId} zugewiesen`
      });
    }
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

  return {
    tournament,
    handleScoreUpdate,
    generatePlayers,
    startTournament,
    exportTournamentData,
    updateNumberOfMachines,
    updateMachine,
    assignMatchToMachine
  };
};
