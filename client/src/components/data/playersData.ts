export interface Player {
  player_name: string;
  performance_score: number;
  marker_score: number;
  geopolitical: number; // 0=LPL, 1=Ranji, 2=PSL (mapped from 0-5 range)
  was_selected: number; // 0 or 1
  team: string;
  role: string;
  tournament: string;
  news: string[];
  awards: string[];
}

// Raw data from the dataset screenshots (player_name, performance_score, marker_score, geopolitical, was_selected)
const rawData: [string, number, number, number, number][] = [
  ["Floriana Marsh", 9.974941, 3, 1, 0],
  ["Preston Scott", 4.618079, 5, 1, 0],
  ["Arturo Murray", 5.611068, 4, 0, 1],
  ["Tianna Keeling", 8.732049, 1, 1, 0],
  ["Kimberly Chen", 4.633956, 1, 0, 1],
  ["Danny Schaefer", 8.207107, 4, 0, 0],
  ["Alia Runoff", 5.363193, 3, 0, 1],
  ["Fidel Binsfeld", 2.748176, 4, 0, 1],
  ["Mr. Pierce", 4.640749, 4, 0, 1],
  ["Grace Troy", 4.659458, 5, 0, 0],
  ["Maya Sporn", 1.743871, 5, 0, 0],
  ["Albin Zborn", 8.341611, 0, 1, 1],
  ["Tatyana Patel", 5.853329, 5, 0, 1],
  ["Ms. Kyleigh", 3.518553, 2, 0, 1],
  ["Dr. Rick Ro", 4.494788, 4, 0, 1],
  ["Rebeka Arn", 6.385882, 1, 1, 0],
  ["Gloria Lucei", 0.829051, 4, 1, 0],
  ["Dallas O'Ke", 8.070499, 3, 0, 1],
  ["Marina Ward", 8.723376, 5, 1, 0],
  ["Miss Zion", 8.483884, 2, 0, 0],
  ["Karl Winth", 1.396068, 3, 0, 1],
  ["Mr. Carl Lo", 8.662659, 0, 1, 1],
  ["Mr. Maybe", 4.137942, 4, 0, 0],
  ["Dr. Tasha Ch", 6.999728, 5, 1, 1],
  ["Retha Reil", 0.365486, 4, 0, 0],
  ["Josephine", 3.528852, 3, 0, 0],
  ["Cedric Ker", 0.182435, 2, 0, 1],
  ["Brody Bogi", 2.844056, 2, 0, 0],
  ["Mitchell W", 1.768994, 2, 0, 1],
  ["Dr. Leora F", 3.618835, 5, 0, 1],
  ["Braeden H", 1.617172, 4, 1, 1],
  ["Jennyfer Ri", 5.520811, 3, 0, 0],
  ["Rudy Rose", 1.673995, 1, 0, 0],
  ["Arturo Ullri", 1.119638, 2, 0, 1],
  ["Mr. Rudolp", 7.171, 3, 0, 0],
  ["Mikel Hilpe", 6.058639, 0, 1, 1],
  ["Sonia Hauf", 4.127475, 4, 0, 0],
  ["Jeannette", 4.047246, 1, 0, 1],
  ["Imogene Si", 3.818156, 0, 1, 0],
  ["Miss Mand", 2.019667, 2, 1, 1],
  ["Vergie Dou", 1.076148, 1, 0, 0],
  ["Lucia Web", 0.5357, 3, 0, 0],
  ["Newell Str", 3.111152, 2, 1, 0],
  ["Marcia Ste", 3.475055, 0, 1, 1],
  ["Tara Langw", 3.309638, 4, 0, 1],
  ["Rhianna Ef", 9.197093, 1, 0, 1],
  ["Miss Franc", 0.598487, 5, 1, 0],
  ["Reilly Grea", 2.300402, 4, 0, 0],
  ["Jaydon Rue", 5.673513, 2, 0, 1],
  ["Rocky Mul", 8.480464, 1, 1, 1],
  ["Mildred Co", 1.044958, 1, 1, 1],
  ["Jeannette B", 0.489172, 3, 0, 1],
  ["Betty Willr", 7.086853, 4, 1, 1],
  ["Jarrod Wel", 4.237496, 5, 1, 0],
  ["Wendell Bl", 4.757896, 4, 0, 0],
  ["Carla Torp", 2.235048, 3, 0, 1],
  ["Cary Torph", 6.992095, 4, 1, 1],
  ["Alyssa Blic", 6.532687, 5, 1, 0],
  ["Kraig Stoke", 3.457926, 3, 0, 1],
  ["Ken Bogisi", 5.440693, 2, 0, 1],
  ["Jeannie Sk", 5.789148, 1, 1, 1],
  ["Aiyana Lab", 4.921414, 1, 1, 1],
  ["Miss Jude V", 9.677753, 4, 0, 1],
  ["Tamara Bli", 4.506311, 4, 0, 1],
  ["Eleonore H", 9.189011, 3, 0, 1],
  ["Harriet Re", 9.031423, 3, 1, 1],
  ["Turner Nic", 5.912851, 2, 0, 0],
  ["Bertrand H", 1.565404, 1, 0, 1],
  ["Amely Han", 1.374539, 0, 0, 0],
  ["Brittany Di", 3.960433, 2, 0, 0],
  ["Pauline Hi", 4.399996, 2, 0, 0],
  ["Annie Don", 4.178416, 5, 1, 1],
  ["Reid Little", 0.231957, 2, 0, 0],
  ["Mossie Gu", 9.367205, 0, 0, 1],
  ["Mr. Herta H", 8.82114, 4, 1, 1],
  ["Miranda Br", 1.064791, 2, 1, 1],
  ["Joyce Ande", 5.98568, 4, 1, 1],
  ["Jim Cartwr", 6.448238, 5, 1, 1],
  ["Mr. Randi E", 2.064843, 5, 1, 0],
  ["Calvin Sch", 3.126603, 2, 1, 0],
  ["Leigh Larki", 4.563454, 5, 0, 1],
  ["Ethel Deck", 4.604626, 2, 0, 0],
  ["Matteo Bro", 7.012173, 1, 1, 1],
  ["Ashlee Bin", 7.655068, 4, 1, 1],
  ["River Hern", 3.665948, 5, 1, 0],
  ["Brian Beat", 1.518298, 4, 0, 0],
  ["Hilario Sm", 2.43147, 3, 1, 0],
  ["Lucia Fishe", 2.394044, 4, 0, 0],
  ["Eliane Rath", 0.037655, 1, 0, 0],
  ["Evan Boyer", 5.792319, 0, 0, 1],
  ["Walter Ren", 3.860977, 2, 1, 1],
  ["Manuel Ma", 3.165844, 0, 1, 0],
  ["Crystel Nik", 2.248389, 1, 1, 0],
  ["Joe Medhu", 8.617651, 1, 1, 1],
  ["Lloyd Trem", 0.66588, 1, 1, 0],
  ["Melinda Pr", 6.828148, 5, 1, 1],
  ["Cindy Baur", 6.768189, 3, 0, 1],
  ["Frederic Bl", 6.380294, 3, 1, 0],
  ["Mack Orn", 5.120527, 3, 0, 0],
  ["Catharine", 4.687138, 5, 0, 0],
];

const teamNames = ["Mumbai Indians", "Chennai Super Kings", "Royal Challengers", "Delhi Capitals", "Rajasthan Royals", "Kolkata Knight Riders", "Punjab Kings", "Sunrisers Hyderabad"];
const roles = ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper", "Opener"];
const tournaments = ["Ranji Trophy", "Lanka Premier League", "Pakistan Super League"];
const awardsList = ["Man of the Match", "Best Bowler", "Wicket Milestone", "Century Scorer", "Most Valuable Player", "Best Fielder"];

const newsTemplates = [
  (name: string, score: number, t: string) => `${name} delivered a stellar performance in ${t}, scoring ${(score * 10).toFixed(0)} runs in a crucial match.`,
  (name: string, _s1: number, t: string) => `${name} was awarded Man of the Match in the recent ${t} fixture with an outstanding display.`,
  (name: string, _score: number, t: string) => `Selectors keep an eye on ${name} after consistent performances across ${t} matches this season.`,
  (name: string, score: number, _t: string) => `${name} claimed a five-wicket haul and finished with economy ${(score / 2).toFixed(2)} in the domestic game.`,
  (name: string, _score: number, t: string) => `${name}'s resilience in ${t} has made him a top contender for the upcoming IPL auction.`,
  (name: string, _score2: number, _t2: string) => `Analysts rate ${name} with a composite performance index of ${_score2.toFixed(2)}, placing him in the top tier.`,
];

function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const players: Player[] = rawData.map(([name, perf, marker, geo, selected], idx) => {
  const rand = seedRandom(idx * 137 + 42);
  const teamIdx = Math.floor(rand() * teamNames.length);
  const roleIdx = Math.floor(rand() * roles.length);
  const tournIdx = geo % 3;
  const numNews = 2 + Math.floor(rand() * 3);
  const newsItems: string[] = [];
  for (let i = 0; i < numNews; i++) {
    const template = newsTemplates[Math.floor(rand() * newsTemplates.length)];
    newsItems.push(template(name, perf, tournaments[tournIdx]));
  }
  const numAwards = Math.floor(rand() * 3);
  const awards: string[] = [];
  for (let i = 0; i < numAwards; i++) {
    awards.push(awardsList[Math.floor(rand() * awardsList.length)]);
  }
  return {
    player_name: name,
    performance_score: perf,
    marker_score: marker,
    geopolitical: geo,
    was_selected: selected,
    team: teamNames[teamIdx],
    role: roles[roleIdx],
    tournament: tournaments[tournIdx],
    news: newsItems,
    awards,
  };
});

export const teams = teamNames;
export const tournamentNames = tournaments;

export function getIPLProbability(player: Player): number {
  // Logistic-like function based on performance_score + marker_score + was_selected hint
  const raw = (player.performance_score * 0.6 + player.marker_score * 0.4 + (player.was_selected === 1 ? 3 : 0)) / 13;
  return Math.min(0.98, Math.max(0.02, raw));
}

export function getPerformanceTier(score: number): string {
  if (score >= 8) return "Elite";
  if (score >= 6) return "Strong";
  if (score >= 4) return "Average";
  if (score >= 2) return "Developing";
  return "Emerging";
}

export function getTierColor(tier: string): string {
  switch (tier) {
    case "Elite": return "text-emerald-400";
    case "Strong": return "text-blue-400";
    case "Average": return "text-yellow-400";
    case "Developing": return "text-orange-400";
    default: return "text-slate-400";
  }
}

export function getTierBg(tier: string): string {
  switch (tier) {
    case "Elite": return "bg-emerald-500/20 border-emerald-500/40";
    case "Strong": return "bg-blue-500/20 border-blue-500/40";
    case "Average": return "bg-yellow-500/20 border-yellow-500/40";
    case "Developing": return "bg-orange-500/20 border-orange-500/40";
    default: return "bg-slate-500/20 border-slate-500/40";
  }
}
