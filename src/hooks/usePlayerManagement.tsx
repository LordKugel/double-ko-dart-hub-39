
import { generatePlayers } from "@/utils/playerGenerator";
import { Player } from "@/types/tournament";

export const usePlayerManagement = (
  isStarted: boolean,
  setTournament: (value: any) => void
) => {
  const generateTournamentPlayers = (count?: number) => {
    if (isStarted) {
      // Toast entfernt
      return;
    }
    
    const players = generatePlayers(count);
    setTournament(prev => ({
      ...prev,
      players,
      matches: []
    }));
    
    // Toast entfernt
  };

  return { generatePlayers: generateTournamentPlayers };
};
