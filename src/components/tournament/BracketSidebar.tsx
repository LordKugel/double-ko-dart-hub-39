
import { Player, Match } from "@/types/tournament";
import { BracketPlayers } from "./BracketPlayers";
import { cn } from "@/lib/utils";

interface BracketSidebarProps {
  byePlayers: Player[];
  activeWinnerPlayers: Player[];
  activeLoserPlayers: Player[];
  eliminatedPlayers: Player[];
  winnersMatches: Match[];
  losersMatches: Match[];
  finalMatches: Match[];
}

export const BracketSidebar = ({
  byePlayers,
  activeWinnerPlayers,
  activeLoserPlayers,
  eliminatedPlayers,
  winnersMatches,
  losersMatches,
  finalMatches
}: BracketSidebarProps) => {
  return (
    <div className="w-full md:w-40 flex flex-col gap-4">
      {/* Winner's Bracket */}
      <div className="bg-[#0e1627] p-4 rounded-lg border border-[#0FA0CE]">
        <h2 className="text-xl font-bold mb-4 text-[#0FA0CE]">Winner's Bracket</h2>
        
        {/* Freilos-Spieler anzeigen */}
        {byePlayers.length > 0 && (
          <div className="mb-4 space-y-2">
            <div className="text-sm font-semibold mb-1 text-green-400">Freilos-Spieler:</div>
            {byePlayers.map(player => (
              <div 
                key={player.id}
                className="p-2 bg-green-900/30 border border-green-500 rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-green-400">
                    {player.firstName} {player.lastName}
                  </span>
                  {player.team && (
                    <span className="text-xs text-green-400/70">
                      {player.team}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Verfügbare Spieler im Winner-Bracket */}
        <BracketPlayers 
          title="Winner's Bracket Players"
          players={activeWinnerPlayers}
          bgColorClass="bg-[#121824]"
          borderColorClass="border-[#0FA0CE]"
          textColorClass="text-[#0FA0CE]"
        />
      </div>
      
      {/* Loser's Bracket - mit kräftigerem Gelb */}
      <div className="bg-[#1c1917] p-4 rounded-lg border border-[#FFD700]">
        <h2 className="text-xl font-bold mb-4 text-[#FFD700]">Loser's Bracket</h2>
        {/* Verfügbare Spieler im Loser-Bracket */}
        <BracketPlayers 
          title="Loser's Bracket Players"
          players={activeLoserPlayers}
          bgColorClass="bg-[#121824]"
          borderColorClass="border-[#FFD700]"
          textColorClass="text-[#FFD700]"
        />
      </div>
      
      {/* Finale */}
      {finalMatches.length > 0 && (
        <div className="bg-[#1e173a] p-4 rounded-lg border border-[#8B5CF6]">
          <h2 className="text-xl font-bold mb-4 text-[#8B5CF6]">Finale</h2>
        </div>
      )}
      
      {/* Ausgeschiedene Spieler */}
      {eliminatedPlayers.length > 0 && (
        <div className="bg-[#1A1721] p-4 rounded-lg border border-red-500">
          <h2 className="text-lg font-bold mb-3 text-red-500">Ausgeschieden</h2>
          <div className="space-y-2">
            {eliminatedPlayers.map(player => (
              <div 
                key={player.id} 
                className={cn(
                  "text-sm flex justify-between p-2 rounded border",
                  "bg-[#121824]",
                  "border-red-500/50",
                  "text-red-500"
                )}
              >
                <span>{player.firstName} {player.lastName}</span>
                {player.team && <span className="text-xs text-red-500/70">{player.team}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
