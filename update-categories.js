import mysql from "mysql2/promise";

const categoryMapping = {
  // TikTok & Social Media
  "Skibidi": "tiktok", "Sigma": "tiktok", "Gyatt": "tiktok", "No Shot": "tiktok",
  "Slay": "tiktok", "Understood the Assignment": "tiktok", "It's Giving": "tiktok",
  "Sheesh": "tiktok", "Nah Fam": "tiktok", "Bussin": "tiktok", "Slaps": "tiktok",
  "Hits Different": "tiktok", "Ate and Left No Crumbs": "tiktok", "Periodt": "tiktok",
  "Snatched": "tiktok", "Serving": "tiktok", "Ate": "tiktok", "Unhinged": "tiktok",
  "Rent Free": "tiktok", "Main Character Energy": "tiktok", "That's a Vibe": "tiktok",
  "Lowkey": "tiktok", "Fanum Tax": "tiktok", "Bet": "tiktok",

  // Gaming & Streaming
  "Clutch": "gaming", "Noob": "gaming", "Pwned": "gaming", "Rage Quit": "gaming",
  "Respawn": "gaming", "Camper": "gaming", "Speedrun": "gaming", "Glitch": "gaming",
  "Nerf": "gaming", "Buff": "gaming", "Carry": "gaming", "Toxic": "gaming",
  "Grind": "gaming", "Loot": "gaming", "Respawn Timer": "gaming", "Streaming": "gaming",
  "Poggers": "gaming", "Simp": "gaming", "Salty": "gaming", "Tilted": "gaming",
  "Gg": "gaming", "Fps": "gaming", "Rpg": "gaming", "Mmo": "gaming", "Afk": "gaming",

  // Fashion & Style
  "Fit": "fashion", "Drip": "fashion", "Flex": "fashion", "Slaying": "fashion",
  "Cheugy": "fashion", "Aesthetic": "fashion", "Boujee": "fashion", "Dripped Out": "fashion",
  "Fit Check": "fashion", "Lewk": "fashion", "Vibe Check": "fashion", "Giving Face": "fashion",
  "Slick": "fashion", "Fresh": "fashion", "Clean": "fashion", "Serving Looks": "fashion",

  // Emotions & Reactions
  "Shook": "emotions", "Gagged": "emotions", "Pressed": "emotions", "Heated": "emotions",
  "Vibe": "emotions", "Mood": "emotions", "Ick": "emotions", "Cringe": "emotions",
  "Awkward": "emotions", "Ded": "emotions", "Crying": "emotions", "Dying": "emotions",
  "Hyped": "emotions", "Stoked": "emotions", "Pumped": "emotions", "Vibe Check Failed": "emotions",
  "Giving": "emotions",

  // General/Everyday
  "Finna": "general", "Gonna": "general", "Wanna": "general", "Gotta": "general",
  "Bruh": "general", "Homie": "general", "Bestie": "general", "Fam": "general",
  "Bro": "general", "Sis": "general", "Lit": "general", "Fire": "general",
  "Dope": "general", "Vibe": "general", "Tea": "general", "Stan": "general",
  "Ghosting": "general", "Rizz": "general", "Drip": "general", "Flex": "general",
  "Bae": "general", "Basic": "general", "Highkey": "general", "Aura": "general",
  "Baddie": "general", "Based": "general", "Bop": "general", "Brainrot": "general",
  "Caught in 4K": "general", "Clapback": "general", "Cook": "general", "Cooked": "general",
  "Crash Out": "general", "Dank": "general", "Dead": "general", "Face Card": "general",
  "Glow-up": "general", "Glow Up": "general", "GOAT": "general"
};

async function updateCategories() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    console.log("Updating slang terms with categories...");
    
    let updated = 0;
    
    for (const [term, category] of Object.entries(categoryMapping)) {
      try {
        const result = await connection.execute(
          'UPDATE slang_terms SET category = ? WHERE term = ?',
          [category, term]
        );
        if (result[0].affectedRows > 0) {
          updated++;
        }
      } catch (err) {
        console.error(`Error updating ${term}:`, err.message);
      }
    }
    
    await connection.end();
    console.log(`✓ Successfully updated ${updated} slang terms with categories!`);
    process.exit(0);
  } catch (error) {
    console.error("Update failed:", error);
    process.exit(1);
  }
}

updateCategories();
