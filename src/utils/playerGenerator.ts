
import { Player } from "../types/tournament";

const firstNames = [
  "Max", "Tom", "Felix", "Lars", "Tim", "Jan", "Paul", "Lukas", "David", "Simon",
  "Anna", "Lisa", "Kai", "Nina", "Sarah", "Mark"
];

const lastNames = [
  "Schmidt", "Müller", "Weber", "Wagner", "Becker", "Schulz", "Hoffmann", "Koch",
  "Richter", "Wolf", "Schröder", "Klein", "Meyer", "Fischer", "Peters", "Berg"
];

const teams = [
  "Red Dragons", "Blue Eagles", "Green Vipers", "Black Panthers",
  "Golden Lions", "Silver Wolves", "Bronze Bears", "Purple Phoenix"
];

export function generateRandomPlayers(count: number = 8): Player[] {
  if (count < 2) count = 2; // Mindestens 2 Spieler
  if (count > 16) count = 16; // Maximal 16 Spieler
  
  return Array.from({ length: count }, () => ({
    id: Math.random().toString(36).substr(2, 9),
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    team: Math.random() > 0.3 ? teams[Math.floor(Math.random() * teams.length)] : undefined,
    winPercentage: 0,
    losses: 0,
    eliminated: false,
    bracket: null,
    matches: []
  }));
}
