
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
              bracket: newLosses === 1 ? "losers" : p.bracket,
              winPercentage: calculateWinPercentage(newMatches, p.id)
            };
          }
          if (p.id === winner.id) {
            return {
              ...p,
              winPercentage: calculateWinPercentage(newMatches, p.id)
            };
          }
          return p;
        });
        
        // Aktualisiere die Spieler im Match
        const updatedPlayer1 = updatedPlayers.find(p => p.id === match.player1.id);
        const updatedPlayer2 = updatedPlayers.find(p => p.id === match.player2.id);
        
        if (updatedPlayer1 && updatedPlayer2) {
          match.player1 = updatedPlayer1;
          match.player2 = updatedPlayer2;
        }

        newMatches[matchIndex] = match;
        
        // Sammle alle Matches der aktuellen Runde für beide Brackets
        const winnerBracketMatches = newMatches.filter(m => 
          m.round === match.round && m.bracket === "winners"
        );
        
        const loserBracketMatches = newMatches.filter(m => 
          m.round === match.round && m.bracket === "losers"
        );

        // Prüfe beide Brackets separat
        if (match.bracket === "winners" && winnerBracketMatches.every(m => m.completed)) {
          const results = winnerBracketMatches.reduce<{ winners: Player[]; losers: Player[] }>(
            (acc, m) => {
              const wins1 = m.scores.filter(s => s.player1Won).length;
              const winner = wins1 > 1 ? m.player1 : m.player2;
              const loser = wins1 > 1 ? m.player2 : m.player1;
              
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

          if (results.winners.length > 1) {
            const nextWinnersMatches = createNextRoundMatches(
              results.winners,
              [],
              match.round + 1,
              "winners"
            );
            newMatches.push(...nextWinnersMatches);
          }

          if (results.losers.length > 1) {
            const nextLosersMatches = createNextRoundMatches(
              results.losers,
              [],
              match.round,
              "losers"
            );
            newMatches.push(...nextLosersMatches);
          }

          if (results.winners.length === 1) {
            const finalMatch: MatchType = {
              id: `final-1`,
              player1: results.winners[0],
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
        
        // Handle Loser's Bracket matches
        if (match.bracket === "losers" && loserBracketMatches.every(m => m.completed)) {
          const loserResults = loserBracketMatches.reduce<Player[]>((acc, m) => {
            const wins1 = m.scores.filter(s => s.player1Won).length;
            const winner = wins1 > 1 ? m.player1 : m.player2;
            const updatedWinner = updatedPlayers.find(p => p.id === winner.id);
            
            if (updatedWinner && !updatedWinner.eliminated) {
              acc.push(updatedWinner);
            }
            
            return acc;
          }, []);

          if (loserResults.length > 1) {
            const nextLosersMatches = createNextRoundMatches(
              loserResults,
              [],
              match.round + 1,
              "losers"
            );
            newMatches.push(...nextLosersMatches);
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
