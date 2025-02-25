
import { useState } from "react";
import { Tournament as TournamentType } from "../types/tournament";
import { useMatchHandling } from "./useMatchHandling";
import { usePlayerManagement } from "./usePlayerManagement";
import { useTournamentFlow } from "./useTournamentFlow";

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

  const { handleScoreUpdate } = useMatchHandling(
    tournament.matches,
    tournament.players,
    setTournament
  );

  const { generatePlayers } = usePlayerManagement(
    tournament.started,
    setTournament
  );

  const { startTournament } = useTournamentFlow(
    tournament,
    setTournament
  );

  return {
    tournament,
    handleScoreUpdate,
    generatePlayers,
    startTournament
  };
};
