
import { Player } from "@/types/tournament";

/**
 * Bestimmt die Textfarbe basierend auf dem Spielerstatus und dem Spielergebnis
 */
export const getPlayerNameColor = (
  player: Player, 
  isMatchCompleted?: boolean, 
  isFinalWinner?: boolean
) => {
  // Freilos-Spieler werden immer grün dargestellt
  if (player.hasBye) {
    return "text-green-400";
  }
  
  if (isMatchCompleted) {
    if (isFinalWinner) {
      return "text-[#0FA0CE]";  // Sieger bleibt blau
    } else if (player.bracket === "losers") {
      return "text-[#FEF7CD]";  // Spieler im Loser-Bracket werden gelb
    } else if (player.eliminated) {
      return "text-red-500";  // Ausgeschiedene Spieler werden rot
    }
    return "text-gray-400";  // Standardfall für Verlierer ohne Elimination
  }
  
  if (player.bracket === "losers") {
    return "text-[#FEF7CD]";  // Spieler im Loser-Bracket werden gelb
  } else if (player.eliminated) {
    return "text-red-500";  // Ausgeschiedene Spieler werden rot
  }
  
  return "text-white";  // Standard für laufende Matches
};

/**
 * Bestimmt die Textfarbe für den Teamnamen basierend auf dem Spielerstatus
 */
export const getTeamNameColor = (
  player: Player, 
  isMatchCompleted?: boolean, 
  isFinalWinner?: boolean
) => {
  // Freilos-Spieler haben grüne Teamnamen
  if (player.hasBye) {
    return "text-green-400/70";
  }
  
  if (isMatchCompleted && isFinalWinner) {
    return "text-[#0FA0CE]/70";
  } else if (isMatchCompleted && player.bracket === "losers") {
    return "text-[#FEF7CD]/70";
  } else if (isMatchCompleted && player.eliminated) {
    return "text-red-500/70";
  }
  
  return "text-gray-400";
};
