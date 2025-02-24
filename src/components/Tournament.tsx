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
  const premiumPlayers = players.filter(p => p.group === "Premium");
  const professionalPlayers = players.filter(p => p.group === "Professional");
  
  const shuffledPremium = [...premiumPlayers].sort(() => Math.random() - 0.5);
  const shuffledProfessional = [...professionalPlayers].sort(() => Math.random() - 0.5);
  
  const matches: MatchType[] = [];
  
  // Premium-Matches erstellen
  for (let i = 0; i < shuffledPremium.length; i += 2) {
    if (i + 1 < shuffledPremium.length) {
      matches.push({
        id: `match-premium-${i/2}`,
        player1: shuffledPremium[i],
        player2: shuffledPremium[i + 1],
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round: 1
      });
    }
  }
  
  // Professional-Matches erstellen
  for (let i = 0; i < shuffledProfessional.length; i += 2) {
    if (i + 1 < shuffledProfessional.length) {
      matches.push({
        id: `match-prof-${i/2}`,
        player1: shuffledProfessional[i],
        player2: shuffledProfessional[i + 1],
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round: 1
      });
    }
  }

  const totalRounds = Math.ceil(Math.log2(Math.max(premiumPlayers.length, professionalPlayers.length)));
  let premiumMatchesInRound = Math.floor(premiumPlayers.length / 4);
  let professionalMatchesInRound = Math.floor(professionalPlayers.length / 4);

  for (let round = 2; round <= totalRounds; round++) {
    // Premium-Gruppe zukünftige Matches
    for (let i = 0; i < premiumMatchesInRound; i++) {
      matches.push({
        id: `match-premium-r${round}-${i}`,
        player1: { id: "tbd", firstName: "TBD", lastName: "", winPercentage: 0 },
        player2: { id: "tbd", firstName: "TBD", lastName: "", winPercentage: 0 },
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round: round
      });
    }
    
    // Professional-Gruppe zukünftige Matches
    for (let i = 0; i < professionalMatchesInRound; i++) {
      matches.push({
        id: `match-prof-r${round}-${i}`,
        player1: { id: "tbd", firstName: "TBD", lastName: "", winPercentage: 0 },
        player2: { id: "tbd", firstName: "TBD", lastName: "", winPercentage: 0 },
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round: round
      });
    }
    
    premiumMatchesInRound = Math.floor(premiumMatchesInRound / 2);
    professionalMatchesInRound = Math.floor(professionalMatchesInRound / 2);
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

  const updatePlayerStats = (
    players: Player[],
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
    playerId: string,
    won: boolean
  ) => {
    setPlayers(prev => {
      const player = prev.find(p => p.id === playerId);
      if (!player) return prev;

      const totalMatches = tournament.matches.filter(m => 
        (m.player1.id === playerId || m.player2.id === playerId) &&
        m.completed
      ).length;

      const wonMatches = tournament.matches.filter(m => {
        if (!m.completed) return false;
        const player1Wins = m.scores.filter(s => s.player1Won).length;
        if (m.player1.id === playerId) return player1Wins > 1;
        if (m.player2.id === playerId) return player1Wins < 2;
        return false;
      }).length;

      const winPercentage = (wonMatches / totalMatches) * 100;

      return prev.map(p =>
        p.id === playerId
          ? { ...p, winPercentage }
          : p
      );
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

    const shuffledPlayers = [...tournament.players].sort(() => Math.random() - 0.5);
    const initialMatches: MatchType[] = [];
    
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (i + 1 < shuffledPlayers.length) {
        initialMatches.push({
          id: `match-${i/2}`,
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i + 1],
          scores: Array(3).fill({ player1Won: null, player2Won: null }),
          completed: false,
          round: 1
        });
      }
    }

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

      const gamesPlayed = match.scores.filter(s => s.player1Won !== null).length;
      if (gamesPlayed === 3) {
        match.completed = true;

        const player1Wins = match.scores.filter(s => s.player1Won).length;
        const winner = player1Wins > 1 ? match.player1 : match.player2;
        const loser = player1Wins > 1 ? match.player2 : match.player1;

        if (!premiumPlayers.find(p => p.id === winner.id) && 
            !professionalPlayers.find(p => p.id === winner.id)) {
          setPremiumPlayers(prev => [...prev, {...winner, group: "Premium", winPercentage: 0}]);
        } else {
          updatePlayerStats(premiumPlayers, setPremiumPlayers, winner.id, true);
          updatePlayerStats(premiumPlayers, setPremiumPlayers, loser.id, false);
        }

        if (!premiumPlayers.find(p => p.id === loser.id) && 
            !professionalPlayers.find(p => p.id === loser.id)) {
          setProfessionalPlayers(prev => [...prev, {...loser, group: "Professional", winPercentage: 0}]);
        } else {
          updatePlayerStats(professionalPlayers, setProfessionalPlayers, winner.id, true);
          updatePlayerStats(professionalPlayers, setProfessionalPlayers, loser.id, false);
        }
      }

      newMatches[matchIndex] = match;
      
      return {
        ...prev,
        matches: newMatches
      };
    });
  };

  const premiumMatches = tournament.matches.filter(m => 
    m.player1.group === "Premium" || m.player2.group === "Premium"
  );

  const professionalMatches = tournament.matches.filter(m => 
    m.player1.group === "Professional" || m.player2.group === "Professional"
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl animate-fade-in pb-[400px]">
      <h1 className="text-3xl font-bold text-center mb-8">Dart Tournament</h1>
      
      {tournament.started && (
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
      
      <TournamentControls
        onGeneratePlayers={generatePlayers}
        onStartTournament={startTournament}
        isStarted={tournament.started}
        hasPlayers={tournament.players.length > 0}
        matches={tournament.matches}
      />

      <div className="mt-8">
        {tournament.matches.map(match => (
          <Match
            key={match.id}
            match={match}
            onScoreUpdate={handleScoreUpdate}
          />
        ))}
      </div>

      {!tournament.started && (
        <PlayersList players={tournament.players} />
      )}

      <MatchesTable matches={tournament.matches} />
    </div>
  );
};
