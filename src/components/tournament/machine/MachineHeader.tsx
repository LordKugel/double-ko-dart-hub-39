
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface MachineHeaderProps {
  maxMachines: number;
  activeMatchesCount: number;
  onDecreaseMaxMachines?: () => void;
  onIncreaseMaxMachines?: () => void;
}

export const MachineHeader = ({
  maxMachines,
  activeMatchesCount,
  onDecreaseMaxMachines,
  onIncreaseMaxMachines
}: MachineHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-[#0FA0CE]">Aktive Automaten</h3>
        <div className="flex items-center gap-1 ml-4">
          {onDecreaseMaxMachines && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 bg-[#2A2631]/50 hover:bg-[#2A2631]"
              onClick={onDecreaseMaxMachines}
              disabled={maxMachines <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
          )}
          <span className="text-xs text-gray-400 px-2">{maxMachines}</span>
          {onIncreaseMaxMachines && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 bg-[#2A2631]/50 hover:bg-[#2A2631]"
              onClick={onIncreaseMaxMachines}
              disabled={maxMachines >= 10}
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      <span className="text-xs text-gray-400">
        {activeMatchesCount} / {maxMachines} belegt
      </span>
    </div>
  );
};
