
import { Match as MatchType, Player } from "../types/tournament";
import { updateMatchScores, updatePlayersAfterMatch, isMatchComplete, isRoundComplete } from "@/utils/matchUtils";

export const useMatchHandling = (
  matches: MatchType[],
  players: Player[],
  setTournament: (value: any) => void
) => {
  const handleScoreUpdate = (matchId: string, gameIndex: number, player1Won: boolean) => {
    setTournament(prev => {
      const matchIndex = prev.matches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) return prev;

      const newMatches = [...prev.matches];
      const match = updateMatchScores({ ...newMatches[matchIndex] }, gameIndex, player1Won);
      
      // Es wird kein Countdown mehr automatisch gestartet
      // Die Bestätigung des Ergebnisses muss manuell erfolgen
      
      newMatches[matchIndex] = match;
      
      return {
        ...prev,
        matches: newMatches
      };
    });
  };

  return { handleScoreUpdate };
};
