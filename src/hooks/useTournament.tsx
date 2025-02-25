
import { useState } from "react";
import { Player, Match as MatchType, Tournament as TournamentType } from "../types/tournament";
import { createInitialMatches, calculateWinPercentage } from "../utils/tournamentUtils";
import { generateRandomPlayers } from "@/utils/playerGenerator";
import { toast } from "@/components/ui/use-toast";
import { updateMatchScores, updatePlayersAfterMatch, isMatchComplete, isRoundComplete } from "@/utils/matchUtils";
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
    roundStarted: false,
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
      
      // Aktualisiere die Spieler nach jedem gespielten Spiel
      const updatedPlayers = updatePlayersAfterMatch(match, prev.players, newMatches);
      
      if (isMatchComplete(match)) {
        match.completed = true;
        
        const updatedPlayer1 = updatedPlayers.find(p => p.id === match.player1.id);
        const updatedPlayer2 = updatedPlayers.find(p => p.id === match.player2.id);
        
        if (updatedPlayer1 && updatedPlayer2) {
          match.player1 = updatedPlayer1;
          match.player2 = updatedPlayer2;
        }
      }

      newMatches[matchIndex] = match;

      // Prüfe, ob die Runde komplett ist
      const roundComplete = isRoundComplete(newMatches, prev.currentRound);
      
      return {
        ...prev,
        matches: newMatches,
        players: updatedPlayers,
        winnersBracketMatches: newMatches.filter(m => m.bracket === "winners"),
        losersBracketMatches: newMatches.filter(m => m.bracket === "losers"),
        finalMatches: newMatches.filter(m => m.bracket === "final"),
        roundStarted: !roundComplete // Setze roundStarted auf false, wenn die Runde komplett ist
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
    if (!tournament.started) {
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
        roundStarted: true,
        winnersBracketMatches: initialMatches,
        losersBracketMatches: [],
        finalMatches: []
      }));

      toast({
        title: "Turnier gestartet",
        description: "Die erste Runde wurde gestartet"
      });
    } else {
      // Prüfen ob aktuelle Runde abgeschlossen ist
      if (!isRoundComplete(tournament.matches, tournament.currentRound)) {
        toast({
          title: "Runde nicht abgeschlossen",
          description: "Bitte spielen Sie erst alle Matches der aktuellen Runde zu Ende",
          variant: "destructive"
        });
        return;
      }

      // Starte nächste Runde
      setTournament(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        roundStarted: true
      }));

      toast({
        title: "Neue Runde gestartet",
        description: `Runde ${tournament.currentRound + 1} wurde gestartet`
      });
    }
  };

  return {
    tournament,
    handleScoreUpdate,
    generatePlayers,
    startTournament
  };
};
