
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RefreshCw } from "lucide-react";

interface PlayerCountControlsProps {
  onGeneratePlayers: (count: number) => void;
  onResetTournament: () => void;
}

export const PlayerCountControls = ({
  onGeneratePlayers,
  onResetTournament
}: PlayerCountControlsProps) => {
  const [playerCount, setPlayerCount] = useState<number>(8);

  const handleGeneratePlayers = () => {
    onGeneratePlayers(playerCount);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="2"
          max="16"
          value={playerCount}
          onChange={(e) => setPlayerCount(Number(e.target.value))}
          className="w-16 h-8 bg-[#1A2133] border-blue-900/50 text-white text-sm"
        />
        <Button 
          onClick={handleGeneratePlayers}
          className="h-8 text-xs"
          variant="outline"
        >
          Generate Players
        </Button>
      </div>
      
      <Button
        onClick={onResetTournament}
        variant="outline"
        className="h-8 text-xs flex items-center gap-1 text-red-500 hover:bg-red-900/20 hover:text-red-400 border-red-800"
      >
        <RefreshCw className="h-3 w-3" />
        Turnier zurücksetzen
      </Button>
    </div>
  );
};
