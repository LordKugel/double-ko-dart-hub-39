
import { useState } from "react";
import { Player, Match as MatchType, Tournament as TournamentType } from "../types/tournament";
import { createInitialMatches, calculateWinPercentage } from "../utils/tournamentUtils";
import { generateRandomPlayers } from "@/utils/playerGenerator";
import { toast } from "@/components/ui/use-toast";
import { updateMatchScores, updatePlayersAfterMatch } from "@/utils/matchUtils";
import { processWinnersBracket, processLosersBracket } from "@/utils/bracketUtils";

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
      const match = updateMatchScores({ ...newMatches[matchIndex] }, gameIndex, player1Won);
      
      const player1Wins = match.scores.filter(s => s.player1Won).length;
      const player2Wins = match.scores.filter(s => s.player2Won).length;

      if (player1Wins === 2 || player2Wins === 2) {
        match.completed = true;
        
        const updatedPlayers = updatePlayersAfterMatch(match, prev.players, newMatches);
        
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
          m.round === match.round && m.bracket === "winners" && m.completed
        );
        
        const loserBracketMatches = newMatches.filter(m => 
          m.round === match.round && m.bracket === "losers" && m.completed
        );

        let updatedMatches = [...newMatches];

        // Verarbeite Winner's und Loser's Bracket getrennt
        if (match.bracket === "winners" && winnerBracketMatches.length === Math.floor(prev.winnersBracketMatches.length)) {
          updatedMatches = processWinnersBracket(match, winnerBracketMatches, updatedPlayers, updatedMatches);
        }
        
        if (match.bracket === "losers" && loserBracketMatches.length === Math.floor(prev.losersBracketMatches.length)) {
          updatedMatches = processLosersBracket(match, loserBracketMatches, updatedPlayers, updatedMatches);
        }

        return {
          ...prev,
          players: updatedPlayers,
          matches: updatedMatches,
          winnersBracketMatches: updatedMatches.filter(m => m.bracket === "winners"),
          losersBracketMatches: updatedMatches.filter(m => m.bracket === "losers"),
          finalMatches: updatedMatches.filter(m => m.bracket === "final")
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
