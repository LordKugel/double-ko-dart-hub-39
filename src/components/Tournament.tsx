
import { useState } from "react";
import { Player, Match as MatchType, Tournament as TournamentType } from "../types/tournament";
import { Match } from "./Match";
import { Button } from "@/components/ui/button";
import { generateRandomPlayers } from "@/utils/playerGenerator";
import { toast } from "@/components/ui/use-toast";

const createInitialMatches = (players: Player[]): MatchType[] => {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const matches: MatchType[] = [];
  
  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      matches.push({
        id: `match-${i/2}`,
        player1: shuffled[i],
        player2: shuffled[i + 1],
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round: 1
      });
    }
  }
  
  return matches;
};

export const Tournament = () => {
  const [tournament, setTournament] = useState<TournamentType>({
    id: "1",
    name: "Dart Tournament",
    players: [],
    matches: [],
    started: false,
    completed: false,
    currentRound: 0
  });

  const generatePlayers = () => {
    if (tournament.started) {
      toast({
        title: "Tournament already started",
        description: "Cannot generate new players after tournament has started",
        variant: "destructive"
      });
      return;
    }
    
    const players = generateRandomPlayers(50);
    setTournament(prev => ({
      ...prev,
      players,
      matches: []
    }));
    
    toast({
      title: "Players Generated",
      description: "50 random players have been generated"
    });
  };

  const startTournament = () => {
    if (tournament.players.length < 2) {
      toast({
        title: "Not enough players",
        description: "Please generate players first",
        variant: "destructive"
      });
      return;
    }

    const matches = createInitialMatches(tournament.players);
    setTournament(prev => ({
      ...prev,
      started: true,
      matches,
      currentRound: 1
    }));

    toast({
      title: "Tournament Started",
      description: "First round matches have been generated"
    });
  };

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

      // Check if match is complete
      const player1Wins = match.scores.filter(s => s.player1Won).length;
      const player2Wins = match.scores.filter(s => s.player2Won).length;
      
      if (player1Wins > match.scores.length / 2 || player2Wins > match.scores.length / 2) {
        match.completed = true;
      }

      newMatches[matchIndex] = match;
      
      return {
        ...prev,
        matches: newMatches
      };
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-8">Dart Tournament</h1>
      
      <div className="flex justify-center gap-4 mb-8">
        <Button 
          onClick={generatePlayers}
          disabled={tournament.started}
          className="transition-all duration-200 hover:scale-105"
        >
          Generate Players
        </Button>
        <Button 
          onClick={startTournament}
          disabled={tournament.started || tournament.players.length === 0}
          className="transition-all duration-200 hover:scale-105"
        >
          Start Tournament
        </Button>
      </div>

      <div className="grid gap-6">
        {tournament.matches.map(match => (
          <Match
            key={match.id}
            match={match}
            onScoreUpdate={handleScoreUpdate}
          />
        ))}
      </div>

      {!tournament.started && tournament.players.length > 0 && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Player List ({tournament.players.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournament.players.map(player => (
              <div key={player.id} className="p-2 bg-gray-50 rounded">
                {player.firstName} {player.lastName}
                {player.team && <span className="text-sm text-gray-500 ml-2">({player.team})</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
