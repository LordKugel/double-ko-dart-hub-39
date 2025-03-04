
import { Match, Machine } from "@/types/tournament";
import { TournamentBracket } from "./TournamentBracket";
import { BracketSidebar } from "./BracketSidebar";
import { PlayersList } from "./PlayersList";

interface TournamentContentProps {
  started: boolean;
  players: any[];
  matches: Match[];
  currentRound: number;
  winnersMatches: Match[];
  losersMatches: Match[];
  finalMatches: Match[];
  activeWinnerPlayers: any[];
  activeLoserPlayers: any[];
  byePlayers: any[];
  eliminatedPlayers: any[];
  machines: Machine[];
  onMatchClick: (matchId: string) => void;
  onAssignMatch: (machineId: number, matchId: string | null) => void;
}

export const TournamentContent = ({
  started,
  players,
  matches,
  currentRound,
  winnersMatches,
  losersMatches,
  finalMatches,
  activeWinnerPlayers,
  activeLoserPlayers,
  byePlayers,
  eliminatedPlayers,
  machines,
  onMatchClick,
  onAssignMatch
}: TournamentContentProps) => {
  if (!started) {
    return (
      <PlayersList 
        players={players}
        matches={matches}
        title="Alle Spieler"
      />
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      <BracketSidebar 
        byePlayers={byePlayers}
        activeWinnerPlayers={activeWinnerPlayers}
        activeLoserPlayers={activeLoserPlayers}
        eliminatedPlayers={eliminatedPlayers}
        winnersMatches={winnersMatches}
        losersMatches={losersMatches}
        finalMatches={finalMatches}
      />
      
      <div className="flex-1">
        <TournamentBracket 
          matches={matches}
          currentRound={currentRound}
          onMatchClick={onMatchClick}
          machines={machines}
          onAssignMatch={onAssignMatch}
          hideScoreControls={true}
        />
      </div>
    </div>
  );
};
