
import { Match } from "@/types/tournament";

// Gibt die Rahmenfarbe basierend auf dem Match-Bracket zurück
export const getMachineBorderColor = (match: Match | null) => {
  if (!match) return "border-[#403E43]/50";
  
  switch(match.bracket) {
    case "winners":
      return "border-[#0FA0CE]";
    case "losers":
      return "border-[#FFD700]";
    case "final":
      return "border-[#8B5CF6]";
    default:
      return "border-[#403E43]";
  }
};

// Gibt die Textfarbe basierend auf dem Bracket zurück
export const getBracketTextColor = (bracket: "winners" | "losers" | "final" | null) => {
  switch(bracket) {
    case "winners":
      return "text-[#0FA0CE]";
    case "losers":
      return "text-[#FFD700]";
    case "final":
      return "text-[#8B5CF6]";
    default:
      return "text-white";
  }
};
