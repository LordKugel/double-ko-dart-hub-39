
import { useState } from "react";
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
      
      if (isMatchComplete(match) && !match.completed && !match.countdownStarted) {
        match.countdownStarted = true;
        
        setTimeout(() => {
          setTournament(prevState => {
            const updatedMatch = { ...match, completed: true, countdownStarted: false };
            const updatedMatches = [...prevState.matches];
            updatedMatches[matchIndex] = updatedMatch;
            
            const updatedPlayers = updatePlayersAfterMatch(updatedMatch, prevState.players, updatedMatches);
            
            return {
              ...prevState,
              matches: updatedMatches,
              players: updatedPlayers,
              winnersBracketMatches: updatedMatches.filter(m => m.bracket === "winners"),
              losersBracketMatches: updatedMatches.filter(m => m.bracket === "losers"),
              finalMatches: updatedMatches.filter(m => m.bracket === "final"),
              roundStarted: !isRoundComplete(updatedMatches, prevState.currentRound)
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
