
import { Player } from '../types/tournament';

// Vornamen für Spieler
const firstNames = [
  'Max', 'Anna', 'Tim', 'Lisa', 'Tom', 'Julia', 'Felix', 'Laura', 'Jan', 'Sophie',
  'David', 'Emma', 'Lukas', 'Sarah', 'Paul', 'Hannah', 'Jonas', 'Lea', 'Moritz', 'Clara',
  'Daniel', 'Lena', 'Benjamin', 'Marie', 'Simon', 'Sophia', 'Jakob', 'Johanna', 'Fabian', 'Lara',
  'Florian', 'Mia', 'Matthias', 'Alina', 'Nico', 'Lilly', 'Philipp', 'Emily', 'Julian', 'Nina'
];

// Nachnamen für Spieler
const lastNames = [
  'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
  'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann',
  'Braun', 'Krüger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier',
  'Lehmann', 'Schmid', 'Schulze', 'Maier', 'Köhler', 'Herrmann', 'König', 'Walter', 'Mayer', 'Huber'
];

// Teamnamen für Spieler
const teamNames = [
  'Red Dragons', 'Blue Sharks', 'Green Vipers', 'Yellow Eagles', 'Black Panthers',
  'White Tigers', 'Golden Lions', 'Silver Wolves', 'Crimson Hawks', 'Purple Cobras',
  'Emerald Knights', 'Azure Dolphins', 'Scarlet Foxes', 'Jade Rhinos', 'Ivory Falcons'
];

// Generiere einen zufälligen Spieler
function generateRandomPlayer(id: string): Player {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  // Nur 70% der Spieler haben Teams
  const team = Math.random() > 0.3 ? teamNames[Math.floor(Math.random() * teamNames.length)] : undefined;

  return {
    id,
    firstName,
    lastName,
    team,
    winPercentage: 0,
    losses: 0,
    eliminated: false,
    bracket: null
  };
}

// Generiere eine Liste von Spielern
export function generatePlayers(count: number = 9): Player[] {
  return Array.from({ length: count }, (_, i) => {
    const id = Math.random().toString(36).substring(2, 12);
    return generateRandomPlayer(id);
  });
}
