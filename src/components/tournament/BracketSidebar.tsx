
import { Player, Match } from "@/types/tournament";
import { BracketPlayers } from "./BracketPlayers";

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
    <div className="w-full md:w-64 flex flex-col gap-4">
      {/* Winner's Bracket */}
      <div className="bg-[#0e1627] p-4 rounded-lg border border-[#0FA0CE]/30">
        <h2 className="text-xl font-bold mb-4 text-[#0FA0CE]">Winner's Bracket</h2>
        
        {/* Freilos-Spieler anzeigen */}
        {byePlayers.length > 0 && (
          <div className="mb-4 space-y-2">
            {byePlayers.map(player => (
              <div 
                key={player.id}
                className="p-2 bg-green-900/30 border border-green-700 rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-green-400">
                    {player.firstName} {player.lastName} (Freilos)
                  </span>
                  {player.team && (
                    <span className="text-xs text-green-400/70">
                      Team: {player.team}
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
          borderColorClass="border-[#0FA0CE]/20"
          textColorClass="text-white"
        />
      </div>
      
      {/* Loser's Bracket */}
      <div className="bg-[#1c1018] p-4 rounded-lg border border-red-900/30">
        <h2 className="text-xl font-bold mb-4 text-red-500">Loser's Bracket</h2>
        {/* Verfügbare Spieler im Loser-Bracket */}
        <BracketPlayers 
          title="Loser's Bracket Players"
          players={activeLoserPlayers}
          bgColorClass="bg-[#121824]"
          borderColorClass="border-red-900/20"
          textColorClass="text-[#FEF7CD]"
        />
      </div>
      
      {/* Finale */}
      {finalMatches.length > 0 && (
        <div className="bg-[#1e173a] p-4 rounded-lg border border-[#8B5CF6]/30">
          <h2 className="text-xl font-bold mb-4 text-[#8B5CF6]">Finale</h2>
        </div>
      )}
      
      {/* Ausgeschiedene Spieler */}
      {eliminatedPlayers.length > 0 && (
        <div className="bg-[#1A1721] p-4 rounded-lg border border-gray-700">
          <h2 className="text-lg font-bold mb-3 text-gray-400">Ausgeschieden</h2>
          <div className="space-y-2">
            {eliminatedPlayers.map(player => (
              <div 
                key={player.id} 
                className="text-sm text-[#ea384c] flex justify-between p-2 bg-[#121824] rounded border border-[#ea384c]/20"
              >
                <span>{player.firstName} {player.lastName}</span>
                {player.team && <span className="text-xs text-[#ea384c]/70">{player.team}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
