import { drizzle } from "drizzle-orm/mysql2";
import { slangTerms } from "./drizzle/schema.ts";

const slangData = [
  { term: "Slay", meaning: "To do something really well; to succeed or dominate", pronunciation: "SLAY", example: "You slayed that presentation!" },
  { term: "Lit", meaning: "Something that is exciting, awesome, or amazing", pronunciation: "LIT", example: "That party was lit!" },
  { term: "Bet", meaning: "Agreement; yes; okay; sure", pronunciation: "BET", example: "Want to grab lunch? Bet!" },
  { term: "No Cap", meaning: "No lie; telling the truth", pronunciation: "NO CAP", example: "That's crazy, no cap!" },
  { term: "Bussin'", meaning: "Something is really good or excellent", pronunciation: "BUS-IN", example: "This pizza is bussin'!" },
  { term: "Drip", meaning: "Trendy, high-class fashion or style", pronunciation: "DRIP", example: "Check out my new drip!" },
  { term: "Rizz", meaning: "Charisma; charm; ability to attract others", pronunciation: "RIZ", example: "He's got mad rizz!" },
  { term: "Vibe Check", meaning: "Assessing someone's mood or energy", pronunciation: "VIBE CHECK", example: "Let me get a vibe check before we go out." },
  { term: "Ghosting", meaning: "Suddenly ending communication with someone", pronunciation: "GHOST-ING", example: "He ghosted me after our first date." },
  { term: "Flex", meaning: "To show off or boast about something", pronunciation: "FLEX", example: "Stop flexing your new car!" },
  { term: "Salty", meaning: "Being bitter, upset, or resentful", pronunciation: "SAWL-TEE", example: "Don't be salty about losing the game." },
  { term: "Vibe", meaning: "A feeling, mood, or atmosphere", pronunciation: "VIBE", example: "I'm getting good vibes from this place." },
  { term: "Tea", meaning: "Gossip or juicy information", pronunciation: "TEE", example: "Spill the tea! What happened?" },
  { term: "Shook", meaning: "Shocked, surprised, or deeply affected", pronunciation: "SHOOK", example: "I was shook when I found out!" },
  { term: "Glow Up", meaning: "A major improvement in appearance or lifestyle", pronunciation: "GLOW UP", example: "She had such a glow up over the summer!" },
  { term: "Stan", meaning: "To be a big fan of someone; to support strongly", pronunciation: "STAN", example: "I stan that artist so much!" },
  { term: "Cringe", meaning: "Something embarrassing or uncomfortable", pronunciation: "KRINJ", example: "That joke was so cringe!" },
  { term: "Fire", meaning: "Something that is impressive, good, or cool", pronunciation: "FY-ER", example: "That new song is fire!" },
  { term: "Mood", meaning: "Relatable; expressing agreement with someone's feeling", pronunciation: "MOOD", example: "I'm tired. Mood." },
  { term: "Dope", meaning: "Cool, awesome, or excellent", pronunciation: "DOPE", example: "That's a dope idea!" },
  { term: "Cheugy", meaning: "Out-of-date, unfashionable, or trying too hard", pronunciation: "CHOO-GEE", example: "Those skinny jeans are so cheugy!" },
  { term: "Fam", meaning: "Family; close friends", pronunciation: "FAM", example: "Hey fam, what's up?" },
  { term: "Bae", meaning: "Boyfriend or girlfriend; term of endearment", pronunciation: "BAY", example: "My bae is so sweet!" },
  { term: "Basic", meaning: "Unoriginal; only interested in mainstream things", pronunciation: "BAY-SIK", example: "She's so basic with her pumpkin spice latte." },
  { term: "Lowkey", meaning: "Secretly; somewhat; kind of", pronunciation: "LOW-KEY", example: "I'm lowkey excited about this." },
  { term: "Highkey", meaning: "Obviously; openly; clearly", pronunciation: "HY-KEY", example: "I'm highkey obsessed with this show!" },
  { term: "Boujee", meaning: "Fancy, luxurious, or expensive", pronunciation: "BOO-ZHEE", example: "That restaurant is so boujee!" },
  { term: "Periodt", meaning: "Full stop; end of discussion", pronunciation: "PEER-EE-ODD", example: "I'm done with this, periodt!" },
  { term: "Ate", meaning: "Did something really well; succeeded", pronunciation: "ATE", example: "She ate and left no crumbs!" },
  { term: "Slaps", meaning: "A song that is really good", pronunciation: "SLAPS", example: "This beat slaps!" },
  { term: "Aura", meaning: "Overall vibe, energy, or personality", pronunciation: "OR-uh", example: "She has a positive aura." },
  { term: "Baddie", meaning: "A confident, stylish, and attractive woman", pronunciation: "BAD-EE", example: "She's a total baddie!" },
  { term: "Based", meaning: "Being yourself; not scared of what people think", pronunciation: "BAYST", example: "That's a based take." },
  { term: "Bestie", meaning: "Best friend", pronunciation: "BES-TEE", example: "My bestie and I are inseparable." },
  { term: "Bop", meaning: "An exceptionally good song", pronunciation: "BOP", example: "That new track is a bop!" },
  { term: "Brainrot", meaning: "Losing touch with reality from consuming too much online content", pronunciation: "BRAYN-ROT", example: "I have major brainrot from TikTok." },
  { term: "Caught in 4K", meaning: "Being caught doing something wrong with evidence", pronunciation: "KAWT IN FOR-KAY", example: "You got caught in 4K!" },
  { term: "Clapback", meaning: "A swift and witty response to an insult", pronunciation: "KLAP-BAK", example: "Her clapback was legendary." },
  { term: "Cook", meaning: "To perform or do well", pronunciation: "COOK", example: "He's cooking in this game!" },
  { term: "Cooked", meaning: "In trouble; done for", pronunciation: "COOKD", example: "If my parents find out, I'm cooked." },
  { term: "Crash Out", meaning: "To make a reckless decision after getting upset", pronunciation: "KRASH OWT", example: "Don't crash out over this." },
  { term: "Dank", meaning: "Excellent, high-quality", pronunciation: "DANGK", example: "That meme is dank!" },
  { term: "Dead", meaning: "Humorous to such an extent as to kill you", pronunciation: "DED", example: "That joke had me dead!" },
  { term: "Face Card", meaning: "An attractive face", pronunciation: "FAYS KARD", example: "She's got a strong face card." },
  { term: "Fanum Tax", meaning: "Theft of food between friends", pronunciation: "FAH-NUM TAKS", example: "He took my fries - fanum tax!" },
  { term: "Finna", meaning: "Short for fixing to; getting ready to", pronunciation: "FIN-uh", example: "I'm finna head out." },
  { term: "Fit Check", meaning: "Highlighting or bringing attention to one's outfit", pronunciation: "FIT CHEK", example: "Let me do a fit check." },
  { term: "For Real", meaning: "Truthfully; honestly", pronunciation: "FOR REEL", example: "For real though, that was crazy." },
  { term: "Gagged", meaning: "Shocked, amazed, or at a loss for words", pronunciation: "GAGD", example: "I was gagged by that plot twist!" },
  { term: "Gas", meaning: "Something cool, dope, or awesome", pronunciation: "GAS", example: "Your fit is gas!" },
  { term: "Glow-up", meaning: "A major improvement in appearance or lifestyle", pronunciation: "GLOW-UP", example: "She had a major glow-up!" },
  { term: "GOAT", meaning: "Greatest of all time", pronunciation: "GOAT", example: "He's the GOAT of basketball." }
];

async function seed() {
  try {
    const db = drizzle(process.env.DATABASE_URL);
    
    console.log("Seeding database with slang terms...");
    
    for (const term of slangData) {
      await db.insert(slangTerms).values(term).catch(err => {
        if (err.code !== "ER_DUP_ENTRY") {
          console.error(`Error inserting ${term.term}:`, err);
        }
      });
    }
    
    console.log(`✓ Successfully seeded ${slangData.length} slang terms!`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
