
import { useState } from "react";
import { Player, Match as MatchType, Tournament as TournamentType } from "../types/tournament";
import { createInitialMatches, createNextRoundMatches, calculateWinPercentage } from "../utils/tournamentUtils";
import { generateRandomPlayers } from "@/utils/playerGenerator";
import { toast } from "@/components/ui/use-toast";

export const useTournament = () => {
  const [tournament, setTournament] = useState<TournamentType>({
    id: "1",
    name: "Dart Tournament",
    players: [],
    matches: [],
    started: false,
    completed: false,
    currentRound: 0,
    winnersBracketMatches: [],
    losersBracketMatches: [],
    finalMatches: []
  });

  const handleScoreUpdate = (matchId: string, gameIndex: number, player1Won: boolean) => {
    setTournament(prev => {
      const matchIndex = prev.matches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) return prev;

      const newMatches = [...prev.matches];
      const match = { ...newMatches[matchIndex] };
      
      match.scores[gameIndex] = {
        player1Won: player1Won,
        player2Won: !player1Won
      };

      const player1Wins = match.scores.filter(s => s.player1Won).length;
      const player2Wins = match.scores.filter(s => s.player2Won).length;

      if (player1Wins === 2 || player2Wins === 2) {
        match.completed = true;
        const winner = player1Wins > player2Wins ? match.player1 : match.player2;
        const loser = player1Wins > player2Wins ? match.player2 : match.player1;
        
        const updatedPlayers = prev.players.map(p => {
          if (p.id === loser.id) {
            const newLosses = p.losses + 1;
            return {
              ...p,
              losses: newLosses,
              eliminated: newLosses >= 2,
              bracket: newLosses === 1 ? "losers" : p.bracket
            };
          }
          if (p.id === winner.id) {
            return {
              ...p,
              winPercentage: calculateWinPercentage(prev.matches, p.id)
            };
          }
          return p;
        });
        
        // Aktualisiere die Spieler im Match mit den aktualisierten Daten
        const updatedPlayer1 = updatedPlayers.find(p => p.id === match.player1.id);
        const updatedPlayer2 = updatedPlayers.find(p => p.id === match.player2.id);
        
        if (updatedPlayer1 && updatedPlayer2) {
          match.player1 = updatedPlayer1;
          match.player2 = updatedPlayer2;
        }

        newMatches[matchIndex] = match;
        
        const currentBracketMatches = newMatches.filter(m => 
          m.round === match.round && m.bracket === match.bracket
        );
        
        if (currentBracketMatches.every(m => m.completed)) {
          // Sammle Gewinner und Verlierer mit Null-Check
          const bracketResults = currentBracketMatches.reduce<{ winners: Player[]; losers: Player[] }>(
            (acc, m) => {
              const wins1 = m.scores.filter(s => s.player1Won).length;
              const winner = wins1 > 1 ? m.player1 : m.player2;
              const loser = wins1 > 1 ? m.player2 : m.player1;
              
              // Finde die aktualisierten Spieler
              const updatedWinner = updatedPlayers.find(p => p.id === winner.id);
              const updatedLoser = updatedPlayers.find(p => p.id === loser.id);
              
              if (updatedWinner && !updatedWinner.eliminated) {
                acc.winners.push(updatedWinner);
              }
              if (updatedLoser && !updatedLoser.eliminated) {
                acc.losers.push(updatedLoser);
              }
              
              return acc;
            },
            { winners: [], losers: [] }
          );

          if (bracketResults.winners.length > 1) {
            const nextWinnersMatches = createNextRoundMatches(
              bracketResults.winners,
              [],
              match.round + 1,
              "winners"
            );
            newMatches.push(...nextWinnersMatches);
          }

          if (bracketResults.losers.length > 1 && match.bracket === "winners") {
            const nextLosersMatches = createNextRoundMatches(
              bracketResults.losers,
              [],
              match.round,
              "losers"
            );
            newMatches.push(...nextLosersMatches);
          }

          if (bracketResults.winners.length === 1 && match.bracket === "winners") {
            const finalMatch: MatchType = {
              id: `final-1`,
              player1: bracketResults.winners[0],
              player2: { 
                id: "tbd", 
                firstName: "TBD", 
                lastName: "", 
                winPercentage: 0, 
                losses: 0, 
                eliminated: false, 
                bracket: "losers" 
              },
              scores: Array(3).fill({ player1Won: null, player2Won: null }),
              completed: false,
              round: match.round + 1,
              bracket: "final",
              matchNumber: 1
            };
            newMatches.push(finalMatch);
          }
        }

        return {
          ...prev,
          players: updatedPlayers,
          matches: newMatches,
          winnersBracketMatches: newMatches.filter(m => m.bracket === "winners"),
          losersBracketMatches: newMatches.filter(m => m.bracket === "losers"),
          finalMatches: newMatches.filter(m => m.bracket === "final")
        };
      }

      newMatches[matchIndex] = match;
      
      return {
        ...prev,
        matches: newMatches,
        winnersBracketMatches: newMatches.filter(m => m.bracket === "winners"),
        losersBracketMatches: newMatches.filter(m => m.bracket === "losers"),
        finalMatches: newMatches.filter(m => m.bracket === "final")
      };
    });
  };

  const generatePlayers = () => {
    if (tournament.started) {
      toast({
        title: "Turnier bereits gestartet",
        description: "Es können keine neuen Spieler generiert werden",
        variant: "destructive"
      });
      return;
    }
    
    const players = generateRandomPlayers(8);
    setTournament(prev => ({
      ...prev,
      players,
      matches: []
    }));
    
    toast({
      title: "Spieler generiert",
      description: "8 zufällige Spieler wurden generiert"
    });
  };

  const startTournament = () => {
    if (tournament.players.length < 2) {
      toast({
        title: "Nicht genug Spieler",
        description: "Bitte generieren Sie zuerst Spieler",
        variant: "destructive"
      });
      return;
    }

    const playersWithBracket = tournament.players.map(player => ({
      ...player,
      bracket: "winners" as const,
      losses: 0,
      eliminated: false
    }));

    const initialMatches = createInitialMatches(playersWithBracket);
    
    setTournament(prev => ({
      ...prev,
      started: true,
      players: playersWithBracket,
      matches: initialMatches,
      currentRound: 1,
      winnersBracketMatches: initialMatches,
      losersBracketMatches: [],
      finalMatches: []
    }));

    toast({
      title: "Turnier gestartet",
      description: "Die ersten Runden wurden generiert"
    });
  };

  return {
    tournament,
    handleScoreUpdate,
    generatePlayers,
    startTournament
  };
};
