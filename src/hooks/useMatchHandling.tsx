
import { Match as MatchType, Player } from "../types/tournament";
import { updateMatchScores, updatePlayersAfterMatch, isMatchComplete, isRoundComplete } from "@/utils/matchUtils";
import { toast } from "@/components/ui/use-toast";

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
      newMatches[matchIndex] = match;

      return {
        ...prev,
        matches: newMatches
      };
    });
  };

  const handleMatchComplete = (matchId: string) => {
    setTournament(prevState => {
      const matchIndex = prevState.matches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) return prevState;

      const match = { ...prevState.matches[matchIndex], completed: true };
      const updatedMatches = [...prevState.matches];
      updatedMatches[matchIndex] = match;
      
      const updatedPlayers = updatePlayersAfterMatch(match, prevState.players, updatedMatches);
      
      // Prüfe auf einen Turniersieger
      const remainingPlayers = updatedPlayers.filter(p => !p.eliminated);
      let winner = null;
      if (remainingPlayers.length === 1) {
        winner = remainingPlayers[0];
        toast({
          title: "🏆 Turniersieger",
          description: `${winner.firstName} ${winner.lastName} hat das Turnier gewonnen!`,
          duration: 10000,
        });
      }
      
      return {
        ...prevState,
        matches: updatedMatches,
        players: updatedPlayers,
        winnersBracketMatches: updatedMatches.filter(m => m.bracket === "winners"),
        losersBracketMatches: updatedMatches.filter(m => m.bracket === "losers"),
        finalMatches: updatedMatches.filter(m => m.bracket === "final"),
        roundStarted: !isRoundComplete(updatedMatches, prevState.currentRound),
        completed: winner !== null
      };
    });
  };

  return { handleScoreUpdate, handleMatchComplete };
};
