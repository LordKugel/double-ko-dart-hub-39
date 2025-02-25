
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
      
      // Starte den Countdown nur wenn alle drei Spiele gespielt wurden
      const allGamesPlayed = match.scores.every(score => score.player1Won !== null && score.player2Won !== null);
      
      if (allGamesPlayed && !match.completed && !match.countdownStarted) {
        match.countdownStarted = true;
        toast({
          title: "Match vollständig",
          description: "Ergebnisse können noch 10 Sekunden lang geändert werden"
        });
        
        setTimeout(() => {
          setTournament(prevState => {
            const updatedMatch = { ...match, completed: true, countdownStarted: false };
            const updatedMatches = [...prevState.matches];
            updatedMatches[matchIndex] = updatedMatch;
            
            const updatedPlayers = updatePlayersAfterMatch(updatedMatch, prevState.players, updatedMatches);
            
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
        }, 10000);
      }

      newMatches[matchIndex] = match;
      
      return {
        ...prev,
        matches: newMatches
      };
    });
  };

  return { handleScoreUpdate };
};
