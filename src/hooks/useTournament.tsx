import { useState } from "react";
import { Player, Match as MatchType, Tournament as TournamentType } from "../types/tournament";
import { createInitialMatches, calculateWinPercentage, createNextRoundMatches } from "../utils/tournamentUtils";
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

      const roundComplete = isRoundComplete(newMatches, prev.currentRound);
      
      return {
        ...prev,
        matches: newMatches,
        players: updatedPlayers,
        winnersBracketMatches: newMatches.filter(m => m.bracket === "winners"),
        losersBracketMatches: newMatches.filter(m => m.bracket === "losers"),
        finalMatches: newMatches.filter(m => m.bracket === "final"),
        roundStarted: !roundComplete
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

  const createNextRound = (currentRound: number, players: Player[], allMatches: MatchType[]) => {
    const winnersPlayers = players.filter(p => p.bracket === "winners" && !p.eliminated);
    const losersPlayers = players.filter(p => p.bracket === "losers" && !p.eliminated);

    console.log("Winners für nächste Runde:", winnersPlayers);
    console.log("Losers für nächste Runde:", losersPlayers);

    let newMatches: MatchType[] = [];

    if (winnersPlayers.length >= 2) {
      const winnerMatches = createNextRoundMatches(
        winnersPlayers,
        [],
        currentRound,
        "winners"
      );
      newMatches = [...newMatches, ...winnerMatches];
    }

    if (losersPlayers.length >= 2) {
      const loserMatches = createNextRoundMatches(
        losersPlayers,
        [],
        currentRound,
        "losers"
      );
      newMatches = [...newMatches, ...loserMatches];
    }

    return newMatches;
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
      if (!isRoundComplete(tournament.matches, tournament.currentRound)) {
        toast({
          title: "Runde nicht abgeschlossen",
          description: "Bitte spielen Sie erst alle Matches der aktuellen Runde zu Ende",
          variant: "destructive"
        });
        return;
      }

      const nextRoundMatches = createNextRound(
        tournament.currentRound + 1,
        tournament.players,
        tournament.matches
      );

      if (nextRoundMatches.length === 0) {
        toast({
          title: "Turnier beendet",
          description: "Alle Runden wurden gespielt",
          variant: "default"
        });
        return;
      }

      setTournament(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        roundStarted: true,
        matches: [...prev.matches, ...nextRoundMatches],
        winnersBracketMatches: nextRoundMatches.filter(m => m.bracket === "winners"),
        losersBracketMatches: nextRoundMatches.filter(m => m.bracket === "losers")
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
