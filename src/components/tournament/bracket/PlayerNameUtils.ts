
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
      return "text-[#FFD700]";  // Spieler im Loser-Bracket bleiben gelb (auch wenn sie gewinnen)
    } else if (player.eliminated) {
      return "text-red-500";  // Ausgeschiedene Spieler werden rot
    }
    return "text-gray-400";  // Standardfall für Verlierer ohne Elimination
  }
  
  // Für alle Spieler am Anfang des Turniers: Blau, wenn im Winner-Bracket (Standardfarbe)
  if (player.bracket === "winners") {
    return "text-[#0FA0CE]";  // Alle Spieler im Winner-Bracket sind blau
  } else if (player.bracket === "losers") {
    return "text-[#FFD700]";  // Alle Spieler im Loser-Bracket sind gelb
  }
  
  // Standardfall
  return "text-white";
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
  
  // Für alle Spieler am Anfang des Turniers: Entsprechend dem Bracket
  if (player.bracket === "winners") {
    return "text-[#0FA0CE]/70";  // Winner-Bracket Teams sind blau
  } else if (player.bracket === "losers") {
    return "text-[#FFD700]/70";  // Loser-Bracket Teams sind gelb
  }
  
  // Standard für alle anderen Fälle
  return "text-gray-400";
};
