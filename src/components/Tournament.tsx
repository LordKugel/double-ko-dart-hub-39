
import { useState } from "react";
import { Player, Match as MatchType, Tournament as TournamentType } from "../types/tournament";
import { generateRandomPlayers } from "@/utils/playerGenerator";
import { toast } from "@/components/ui/use-toast";
import { TournamentControls } from "./tournament/TournamentControls";
import { PlayersList } from "./tournament/PlayersList";
import { MatchesTable } from "./tournament/MatchesTable";
import { Match } from "./tournament/Match";
import { TournamentBracket } from "./tournament/TournamentBracket";

const createInitialMatches = (players: Player[]): MatchType[] => {
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
  const matches: MatchType[] = [];
  
  // Erste Runde Matches erstellen
  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    if (i + 1 < shuffledPlayers.length) {
      matches.push({
        id: `match-${i/2}`,
        player1: shuffledPlayers[i],
        player2: shuffledPlayers[i + 1],
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

  const [premiumPlayers, setPremiumPlayers] = useState<Player[]>([]);
  const [professionalPlayers, setProfessionalPlayers] = useState<Player[]>([]);

  const calculateWinPercentage = (playerId: string): number => {
    const playerMatches = tournament.matches.filter(m => 
      (m.player1.id === playerId || m.player2.id === playerId) && m.completed
    );
    
    if (playerMatches.length === 0) return 0;
    
    const wonMatches = playerMatches.filter(m => {
      const player1Wins = m.scores.filter(s => s.player1Won).length;
      if (m.player1.id === playerId) return player1Wins > 1;
      if (m.player2.id === playerId) return player1Wins < 2;
      return false;
    }).length;
    
    return (wonMatches / playerMatches.length) * 100;
  };

  const updatePlayerStats = (playerId: string, isWinner: boolean) => {
    const winPercentage = calculateWinPercentage(playerId);
    
    setPremiumPlayers(prev => 
      prev.map(p => p.id === playerId ? { ...p, winPercentage } : p)
    );
    
    setProfessionalPlayers(prev => 
      prev.map(p => p.id === playerId ? { ...p, winPercentage } : p)
    );
  };

  const createNextRoundMatches = (winners: Player[], round: number, group: "Premium" | "Professional") => {
    const matches: MatchType[] = [];
    for (let i = 0; i < winners.length; i += 2) {
      if (i + 1 < winners.length) {
        matches.push({
          id: `match-${group}-${round}-${i/2}`,
          player1: winners[i],
          player2: winners[i + 1],
          scores: Array(3).fill({ player1Won: null, player2Won: null }),
          completed: false,
          round
        });
      }
    }
    return matches;
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

      const player1Wins = match.scores.filter(s => s.player1Won).length;
      const player2Wins = match.scores.filter(s => s.player2Won).length;

      if (player1Wins === 2 || player2Wins === 2) {
        match.completed = true;
        const winner = player1Wins > player2Wins ? match.player1 : match.player2;
        const loser = player1Wins > player2Wins ? match.player2 : match.player1;

        // Erste Runde: Gruppeneinteilung
        if (match.round === 1) {
          if (!premiumPlayers.find(p => p.id === winner.id) && 
              !professionalPlayers.find(p => p.id === winner.id)) {
            setPremiumPlayers(prev => [...prev, {...winner, group: "Premium"}]);
          }
          if (!premiumPlayers.find(p => p.id === loser.id) && 
              !professionalPlayers.find(p => p.id === loser.id)) {
            setProfessionalPlayers(prev => [...prev, {...loser, group: "Professional"}]);
          }
        }

        updatePlayerStats(winner.id, true);
        updatePlayerStats(loser.id, false);

        // Prüfen, ob alle Matches der aktuellen Runde beendet sind
        const currentRoundMatches = newMatches.filter(m => m.round === match.round);
        const allMatchesCompleted = currentRoundMatches.every(m => m.completed);

        if (allMatchesCompleted) {
          // Premium Gruppe
          const premiumWinners = currentRoundMatches
            .filter(m => m.player1.group === "Premium" || m.player2.group === "Premium")
            .map(m => {
              const wins1 = m.scores.filter(s => s.player1Won).length;
              return wins1 > 1 ? m.player1 : m.player2;
            });

          // Professional Gruppe
          const professionalWinners = currentRoundMatches
            .filter(m => m.player1.group === "Professional" || m.player2.group === "Professional")
            .map(m => {
              const wins1 = m.scores.filter(s => s.player1Won).length;
              return wins1 > 1 ? m.player1 : m.player2;
            });

          if (premiumWinners.length > 1) {
            const nextRoundPremium = createNextRoundMatches(premiumWinners, match.round + 1, "Premium");
            newMatches.push(...nextRoundPremium);
          }

          if (professionalWinners.length > 1) {
            const nextRoundProfessional = createNextRoundMatches(professionalWinners, match.round + 1, "Professional");
            newMatches.push(...nextRoundProfessional);
          }
        }
      }

      newMatches[matchIndex] = match;
      
      return {
        ...prev,
        matches: newMatches
      };
    });
  };

  const generatePlayers = () => {
    if (tournament.started) {
      toast({
        title: "Tournament already started",
        description: "Cannot generate new players after tournament has started",
        variant: "destructive"
      });
      return;
    }
    
    const players = generateRandomPlayers(12);
    setTournament(prev => ({
      ...prev,
      players,
      matches: []
    }));
    
    toast({
      title: "Players Generated",
      description: "12 random players have been generated"
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

    const initialMatches = createInitialMatches(tournament.players);
    setTournament(prev => ({
      ...prev,
      started: true,
      matches: initialMatches,
      currentRound: 1
    }));

    toast({
      title: "Tournament Started",
      description: "First round matches have been generated"
    });
  };

  const premiumMatches = tournament.matches.filter(m => 
    (m.player1.group === "Premium" || m.player2.group === "Premium") &&
    m.round > 1
  );

  const professionalMatches = tournament.matches.filter(m => 
    (m.player1.group === "Professional" || m.player2.group === "Professional") &&
    m.round > 1
  );

  const firstRoundMatches = tournament.matches.filter(m => m.round === 1);

  return (
    <div className="container mx-auto p-4 max-w-4xl animate-fade-in pb-[400px]">
      <h1 className="text-3xl font-bold text-center mb-8">Dart Tournament</h1>
      
      <TournamentControls
        onGeneratePlayers={generatePlayers}
        onStartTournament={startTournament}
        isStarted={tournament.started}
        hasPlayers={tournament.players.length > 0}
        matches={tournament.matches}
      />

      {!tournament.started ? (
        <PlayersList players={tournament.players} />
      ) : (
        <>
          <div className="mt-8">
            {firstRoundMatches.map(match => (
              <Match
                key={match.id}
                match={match}
                onScoreUpdate={handleScoreUpdate}
              />
            ))}
          </div>

          {(premiumMatches.length > 0 || professionalMatches.length > 0) && (
            <>
              <TournamentBracket 
                title="Premium Gruppe" 
                matches={premiumMatches}
                className="left-4"
              />
              <TournamentBracket 
                title="Professional Gruppe" 
                matches={professionalMatches}
                className="right-4"
              />
            </>
          )}
        </>
      )}

      <MatchesTable matches={tournament.matches} />
    </div>
  );
};
