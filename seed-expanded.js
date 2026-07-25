import mysql from "mysql2/promise";

const expandedSlangData = [
  // TikTok & Social Media Slang (25 terms)
  { term: "Skibidi", meaning: "Something absurd or ridiculous; often used ironically", pronunciation: "SKIB-uh-DEE", example: "That TikTok trend is so skibidi!" },
  { term: "Sigma", meaning: "An independent, self-reliant person; often used for men who don't need validation", pronunciation: "SIG-muh", example: "He's a sigma male." },
  { term: "Gyatt", meaning: "An exclamation of surprise or attraction; often used when seeing something impressive", pronunciation: "GYAT", example: "Gyatt, did you see that?" },
  { term: "Skibidi Toilet", meaning: "A surreal internet meme involving animated toilets", pronunciation: "SKIB-uh-DEE TOY-let", example: "Skibidi Toilet is peak internet humor." },
  { term: "Fanum Tax", meaning: "Taking someone's food without permission", pronunciation: "FAH-num TAKS", example: "He hit me with the fanum tax!" },
  { term: "Bet", meaning: "Okay, I agree, or understood", pronunciation: "BET", example: "You coming to the party? Bet!" },
  { term: "No Shot", meaning: "No way, I don't believe that", pronunciation: "NO SHOT", example: "No shot that actually happened!" },
  { term: "Slay", meaning: "To do something exceptionally well", pronunciation: "SLAY", example: "You absolutely slayed that performance!" },
  { term: "Understood the Assignment", meaning: "Someone did exactly what was expected perfectly", pronunciation: "un-DER-STOOD thuh uh-SY-ment", example: "She understood the assignment with that outfit." },
  { term: "It's Giving", meaning: "Something has a certain vibe or energy", pronunciation: "Its GIV-ing", example: "This aesthetic is giving luxury." },
  { term: "Sheesh", meaning: "An exclamation of amazement or disbelief", pronunciation: "SHEESH", example: "Sheesh, that was wild!" },
  { term: "Nah Fam", meaning: "No way, I disagree", pronunciation: "NAH FAM", example: "Nah fam, that's not happening." },
  { term: "Bussin", meaning: "Really good, excellent, or impressive", pronunciation: "BUS-in", example: "That song is bussin!" },
  { term: "Slaps", meaning: "A song that is really good or catchy", pronunciation: "SLAPS", example: "This beat slaps hard!" },
  { term: "Hits Different", meaning: "Something is special or unique in a good way", pronunciation: "HITS DIF-ent", example: "That coffee hits different in the morning." },
  { term: "Ate and Left No Crumbs", meaning: "Someone did something perfectly with no room for criticism", pronunciation: "ATE and LEFT NO KRUMZ", example: "She ate and left no crumbs with that presentation!" },
  { term: "Periodt", meaning: "Full stop, end of discussion, period", pronunciation: "PEER-ee-ODD", example: "I'm done with this, periodt!" },
  { term: "Snatched", meaning: "Looking really good or attractive", pronunciation: "SNATCHD", example: "Your makeup looks snatched today!" },
  { term: "Serving", meaning: "Providing or displaying something excellently", pronunciation: "SER-ving", example: "She's serving looks in that outfit!" },
  { term: "Ate", meaning: "Did something really well", pronunciation: "ATE", example: "He ate on that test!" },
  { term: "Unhinged", meaning: "Chaotic, wild, or unpredictable in a funny way", pronunciation: "un-HINJD", example: "That video is completely unhinged!" },
  { term: "Rent Free", meaning: "Something that stays in your mind constantly", pronunciation: "RENT FREE", example: "That song lives rent free in my head." },
  { term: "Main Character Energy", meaning: "Confidence and presence like you're the protagonist", pronunciation: "MAIN CHAR-ik-ter EN-er-jee", example: "Walking in with main character energy!" },
  { term: "That's a Vibe", meaning: "I like that, it feels right", pronunciation: "THATS uh VIBE", example: "This music is a vibe." },
  { term: "Lowkey", meaning: "Secretly, somewhat, or kind of", pronunciation: "LOW-key", example: "I lowkey love that show." },

  // Gaming & Streaming Terms (25 terms)
  { term: "Clutch", meaning: "Making a crucial play or comeback when it matters most", pronunciation: "KLUTCH", example: "That was a clutch save in the game!" },
  { term: "Noob", meaning: "A newbie or inexperienced player", pronunciation: "NOOB", example: "Don't worry, we all started as noobs." },
  { term: "Pwned", meaning: "Defeated or humiliated in a game", pronunciation: "PWND", example: "I just got pwned in that match!" },
  { term: "Rage Quit", meaning: "Quitting a game out of frustration", pronunciation: "RAJ KWIT", example: "He rage quit after losing." },
  { term: "Respawn", meaning: "To come back or try again", pronunciation: "REE-spawn", example: "Let's respawn and try that level again." },
  { term: "Camper", meaning: "Someone who stays in one spot waiting for opponents", pronunciation: "CAMP-er", example: "That player is such a camper!" },
  { term: "Speedrun", meaning: "Completing something very quickly", pronunciation: "SPEED-run", example: "I speedran that task!" },
  { term: "Glitch", meaning: "A bug or malfunction in a game or system", pronunciation: "GLITCH", example: "There's a glitch in the game." },
  { term: "Nerf", meaning: "To weaken or reduce the power of something", pronunciation: "NERF", example: "They nerfed that weapon in the update." },
  { term: "Buff", meaning: "To strengthen or improve something", pronunciation: "BUF", example: "The new patch buffed the character." },
  { term: "Carry", meaning: "To lead your team to victory", pronunciation: "CARE-ee", example: "He carried the team to victory!" },
  { term: "Toxic", meaning: "Negative, hostile, or aggressive behavior in gaming", pronunciation: "TOK-sik", example: "The chat is being really toxic." },
  { term: "Grind", meaning: "To work hard repeatedly to achieve a goal", pronunciation: "GRIND", example: "I'm grinding to level up." },
  { term: "Loot", meaning: "Items or rewards obtained from gameplay", pronunciation: "LOOT", example: "I got some sick loot from that boss!" },
  { term: "Respawn Timer", meaning: "The time you have to wait before coming back", pronunciation: "REE-spawn TY-mer", example: "The respawn timer is 30 seconds." },
  { term: "Streaming", meaning: "Broadcasting gameplay or content live online", pronunciation: "STREAM-ing", example: "I'm streaming tonight at 8 PM." },
  { term: "Poggers", meaning: "An expression of excitement or approval", pronunciation: "POG-erz", example: "That play was poggers!" },
  { term: "Simp", meaning: "Someone who does too much for someone they like", pronunciation: "SIMP", example: "Stop simping for that celebrity!" },
  { term: "Salty", meaning: "Bitter or upset about losing", pronunciation: "SAWL-tee", example: "He's salty about losing the game." },
  { term: "Tilted", meaning: "Emotionally upset or frustrated", pronunciation: "TILT-ed", example: "I'm tilted after that loss." },
  { term: "Gg", meaning: "Good game; said after a match", pronunciation: "JEE-JEE", example: "Gg everyone, well played!" },
  { term: "Fps", meaning: "First-person shooter; a game genre", pronunciation: "EFF-PEE-ESS", example: "I love playing FPS games." },
  { term: "Rpg", meaning: "Role-playing game; a game genre", pronunciation: "ARE-PEE-JEE", example: "That RPG has an amazing story." },
  { term: "Mmo", meaning: "Massively multiplayer online game", pronunciation: "EM-EM-OH", example: "I play an MMO with my friends." },
  { term: "Afk", meaning: "Away from keyboard; not actively playing", pronunciation: "AY-EFF-KAY", example: "I'm AFK for a few minutes." },

  // Fashion & Style (20 terms)
  { term: "Fit", meaning: "An outfit or how clothes fit", pronunciation: "FIT", example: "Your fit is fire today!" },
  { term: "Drip", meaning: "Stylish clothing or fashion sense", pronunciation: "DRIP", example: "Check out my new drip!" },
  { term: "Flex", meaning: "To show off or display something", pronunciation: "FLEX", example: "Stop flexing your new shoes!" },
  { term: "Slaying", meaning: "Looking amazing or fashionable", pronunciation: "SLAY-ing", example: "You're slaying that outfit!" },
  { term: "Cheugy", meaning: "Outdated or trying too hard; millennial aesthetic", pronunciation: "CHOO-jee", example: "Those skinny jeans are so cheugy." },
  { term: "Aesthetic", meaning: "A cohesive visual style or vibe", pronunciation: "es-THET-ik", example: "I love her vintage aesthetic." },
  { term: "Boujee", meaning: "Fancy, luxurious, or expensive", pronunciation: "BOO-zhee", example: "That restaurant is so boujee!" },
  { term: "Dripped Out", meaning: "Dressed in expensive or stylish clothes", pronunciation: "DRIPT OWT", example: "He's dripped out in designer gear." },
  { term: "Fit Check", meaning: "Showing off or asking for feedback on an outfit", pronunciation: "FIT CHEK", example: "Let me do a fit check before we go out." },
  { term: "Snatched", meaning: "Looking really good or attractive", pronunciation: "SNATCHD", example: "Your makeup is snatched!" },
  { term: "Serving Looks", meaning: "Looking exceptionally good", pronunciation: "SER-ving LOOKS", example: "She's serving looks in that dress!" },
  { term: "Lewk", meaning: "A look or outfit (stylized spelling)", pronunciation: "LOOK", example: "That's a cute lewk!" },
  { term: "Vibe Check", meaning: "Assessing someone's mood or energy", pronunciation: "VIBE CHEK", example: "Let me get a vibe check from you." },
  { term: "Giving Face", meaning: "Having good facial features or makeup", pronunciation: "GIV-ing FAYS", example: "She's giving face with that makeup!" },
  { term: "Ate", meaning: "Did something really well, especially fashion", pronunciation: "ATE", example: "She ate with that outfit!" },
  { term: "Ate and Left No Crumbs", meaning: "Looked absolutely perfect", pronunciation: "ATE and LEFT NO KRUMZ", example: "She ate and left no crumbs!" },
  { term: "Serving", meaning: "Displaying or providing something excellently", pronunciation: "SER-ving", example: "She's serving realness!" },
  { term: "Slick", meaning: "Stylish or impressive", pronunciation: "SLIK", example: "That outfit is slick!" },
  { term: "Fresh", meaning: "New, cool, or stylish", pronunciation: "FRESH", example: "Those kicks are fresh!" },
  { term: "Clean", meaning: "Neat, stylish, or well-put-together", pronunciation: "KLEEN", example: "Your fit is clean!" },

  // Emotions & Reactions (20 terms)
  { term: "Shook", meaning: "Shocked, surprised, or emotionally affected", pronunciation: "SHOOK", example: "I was shook by that plot twist!" },
  { term: "Gagged", meaning: "Shocked, amazed, or speechless", pronunciation: "GAGD", example: "I was gagged by her performance!" },
  { term: "Pressed", meaning: "Bothered, upset, or defensive", pronunciation: "PRESD", example: "Why are you so pressed about it?" },
  { term: "Salty", meaning: "Bitter, upset, or resentful", pronunciation: "SAWL-tee", example: "Don't be salty about losing!" },
  { term: "Heated", meaning: "Angry or upset", pronunciation: "HEE-tid", example: "He got heated during the argument." },
  { term: "Vibe", meaning: "A feeling, mood, or atmosphere", pronunciation: "VIBE", example: "I'm getting good vibes from this." },
  { term: "Mood", meaning: "Relatable or expressing agreement", pronunciation: "MOOD", example: "I'm tired. Mood." },
  { term: "Ick", meaning: "A sudden feeling of disgust or repulsion", pronunciation: "IK", example: "That gave me the ick!" },
  { term: "Cringe", meaning: "Embarrassing or uncomfortable", pronunciation: "KRINJ", example: "That was so cringe!" },
  { term: "Awkward", meaning: "Uncomfortable or socially difficult", pronunciation: "AW-kword", example: "That conversation was awkward." },
  { term: "Uncomfortable", meaning: "Uneasy or not at ease", pronunciation: "un-KUM-fer-tuh-bul", example: "This situation is uncomfortable." },
  { term: "Ded", meaning: "Laughing so hard you're dying", pronunciation: "DED", example: "That meme has me ded!" },
  { term: "Crying", meaning: "Laughing very hard", pronunciation: "CRY-ing", example: "I'm crying at this joke!" },
  { term: "Dying", meaning: "Laughing uncontrollably", pronunciation: "DY-ing", example: "I'm dying laughing!" },
  { term: "Hyped", meaning: "Excited or enthusiastic", pronunciation: "HY-pt", example: "I'm so hyped for the concert!" },
  { term: "Stoked", meaning: "Excited or pleased", pronunciation: "STOHKT", example: "I'm stoked about the weekend!" },
  { term: "Pumped", meaning: "Excited or energized", pronunciation: "PUMPT", example: "I'm pumped for the game!" },
  { term: "Vibe Check Failed", meaning: "Someone's energy or mood is off", pronunciation: "VIBE CHEK FAYLD", example: "Vibe check failed with that comment." },
  { term: "Giving", meaning: "Expressing or conveying a certain feeling", pronunciation: "GIV-ing", example: "This outfit is giving confidence." },
  { term: "Ate", meaning: "Handled something well emotionally", pronunciation: "ATE", example: "She ate that breakup and moved on!" },

  // General/Everyday Slang (10 terms)
  { term: "Finna", meaning: "About to, fixing to, or going to", pronunciation: "FIN-uh", example: "I'm finna head out." },
  { term: "Gonna", meaning: "Going to", pronunciation: "GAWN-uh", example: "I'm gonna grab some food." },
  { term: "Wanna", meaning: "Want to", pronunciation: "WAN-uh", example: "Do you wanna come?" },
  { term: "Gotta", meaning: "Have got to, must", pronunciation: "GAH-tuh", example: "I gotta go to work." },
  { term: "Bruh", meaning: "Brother or dude; used casually", pronunciation: "BRUH", example: "Bruh, that's crazy!" },
  { term: "Homie", meaning: "Friend or buddy", pronunciation: "HO-mee", example: "What's up, homie?" },
  { term: "Bestie", meaning: "Best friend", pronunciation: "BES-tee", example: "My bestie and I are inseparable." },
  { term: "Fam", meaning: "Family or close friends", pronunciation: "FAM", example: "Hey fam, what's good?" },
  { term: "Bro", meaning: "Brother or friend", pronunciation: "BRO", example: "Thanks, bro!" },
  { term: "Sis", meaning: "Sister or female friend", pronunciation: "SIS", example: "You got this, sis!" }
];

async function seed() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    console.log("Seeding database with 100 expanded slang terms...");
    
    let successCount = 0;
    let duplicateCount = 0;
    
    for (const term of expandedSlangData) {
      try {
        await connection.execute(
          'INSERT INTO slang_terms (term, meaning, pronunciation, example) VALUES (?, ?, ?, ?)',
          [term.term, term.meaning, term.pronunciation, term.example]
        );
        successCount++;
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
          duplicateCount++;
        } else {
          console.error(`Error inserting ${term.term}:`, err.message);
        }
      }
    }
    
    await connection.end();
    console.log(`✓ Successfully seeded ${successCount} new slang terms!`);
    if (duplicateCount > 0) {
      console.log(`⚠ Skipped ${duplicateCount} duplicate terms`);
    }
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
