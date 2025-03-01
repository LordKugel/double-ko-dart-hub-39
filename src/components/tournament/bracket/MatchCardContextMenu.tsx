
import { Match, Machine } from "@/types/tournament";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { toast } from "@/components/ui/use-toast";

interface MatchCardContextMenuProps {
  match: Match;
  isCurrentRound: boolean;
  children: React.ReactNode;
  machines: Machine[];
  onAssignMatch?: (machineId: number, matchId: string) => void;
}

export const MatchCardContextMenu = ({
  match,
  isCurrentRound,
  children,
  machines,
  onAssignMatch
}: MatchCardContextMenuProps) => {
  // Filtere verfügbare Automaten (nicht belegt und nicht außer Betrieb)
  const availableMachines = machines.filter(m => !m.isOutOfOrder && !m.currentMatchId);

  const handleAssignToMachine = (machineId: number) => {
    if (onAssignMatch) {
      onAssignMatch(machineId, match.id);
      toast({
        title: "Match zugewiesen",
        description: `Match wurde Automat ${machineId} zugewiesen`
      });
    }
  };

  // Wenn das Match nicht spielbar ist (abgeschlossen oder bereits zugewiesen),
  // oder wenn keine Automaten verfügbar sind, gib einfach die Karte zurück
  if (match.completed || match.machineNumber || !isCurrentRound || availableMachines.length === 0 || !onAssignMatch) {
    return <>{children}</>;
  }

  // Ansonsten wickle die Karte in ein Kontextmenü ein
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="z-50 w-56 bg-[#1A2133] border-gray-700 text-white">
        <div className="px-2 py-1.5 text-xs font-semibold text-gray-300">
          Match zuweisen
        </div>
        {availableMachines.map((machine) => (
          <ContextMenuItem 
            key={machine.id}
            onClick={() => handleAssignToMachine(machine.id)}
            className="cursor-pointer hover:bg-[#2A3143] focus:bg-[#2A3143]"
          >
            Automat {machine.id}
            {machine.isFavorite && " ⭐"}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};
