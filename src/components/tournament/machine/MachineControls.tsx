
import { Machine } from "@/types/tournament";
import { Button } from "@/components/ui/button";
import { Star, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface MachineControlsProps {
  machine: Machine;
  onToggleFavorite: (machine: Machine) => void;
  onToggleOutOfOrder: (machine: Machine) => void;
}

export const MachineControls = ({
  machine,
  onToggleFavorite,
  onToggleOutOfOrder
}: MachineControlsProps) => {
  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(machine)}
              className={cn(
                "hover:text-yellow-500 p-1",
                machine.isFavorite && "text-yellow-500"
              )}
            >
              <Star className={cn(
                "h-3 w-3",
                machine.isFavorite && "fill-current"
              )} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{machine.isFavorite ? 'Favorit entfernen' : 'Als Favorit markieren'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleOutOfOrder(machine)}
              className={cn(
                "hover:text-red-500 p-1",
                machine.isOutOfOrder && "text-red-500"
              )}
            >
              <AlertTriangle className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{machine.isOutOfOrder ? 'Verfügbar' : 'Außer Betrieb'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
