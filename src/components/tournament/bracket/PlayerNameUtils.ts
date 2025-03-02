
import { Player } from "@/types/tournament";

/**
 * Bestimmt die Textfarbe basierend auf dem Spielerstatus und dem Spielergebnis
 * Farben werden nur für das aktuelle/letzte Spiel angepasst, um den Spielverlauf nachvollziehbar zu halten
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
  
  // Farbgebung nur für das aktuelle/letzte Spiel
  if (isMatchCompleted) {
    if (isFinalWinner) {
      return "text-[#0FA0CE]";  // Sieger bleibt blau
    } else if (player.bracket === "losers") {
      return "text-[#FFD700]";  // Spieler im Loser-Bracket werden kräftiger gelb
    } else if (player.eliminated) {
      return "text-red-500";  // Ausgeschiedene Spieler werden rot
    }
    return "text-gray-400";  // Standardfall für Verlierer ohne Elimination
  }
  
  // Standard für laufende Matches oder vergangene Matches (außer das letzte)
  return "text-white";  // Standardfarbe weiß für alle anderen Spieler
};

/**
 * Bestimmt die Textfarbe für den Teamnamen basierend auf dem Spielerstatus
 * Farben werden nur für das aktuelle/letzte Spiel angepasst
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
  
  // Farbgebung nur für das aktuelle/letzte Spiel
  if (isMatchCompleted) {
    if (isFinalWinner) {
      return "text-[#0FA0CE]/70";
    } else if (player.bracket === "losers") {
      return "text-[#FFD700]/70";  // Kräftigeres Gelb für Loser Bracket Teams
    } else if (player.eliminated) {
      return "text-red-500/70";
    }
    return "text-gray-400";  // Standard für Verlierer
  }
  
  // Standard für alle anderen Fälle
  return "text-gray-400";
};
