#!/bin/sh

set -e

if [ -z "$1" ]; then
  echo "Session token not set" >&2
  exit 1
fi

TOKEN="$1"

curl "https://pathmaster.gg/api/image/adventure_cover" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  --data-binary @images/cover_kingmaker.jpg

curl "https://pathmaster.gg/api/image/adventure_cover" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  --data-binary @images/cover_hellknight_hill.jpg

curl "https://pathmaster.gg/api/image/adventure_cover" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  --data-binary @images/cover_prey_for_death.jpg

curl "https://pathmaster.gg/api/image/adventure_cover" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  --data-binary @images/cover_ruins_of_gauntlight.jpg

curl "https://pathmaster.gg/api/image/adventure_cover" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  --data-binary @images/cover_the_great_toys_heist.jpg

curl "https://pathmaster.gg/api/adventure" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "Kingmaker",
  "cover_image_id": 1
}'

curl "https://pathmaster.gg/api/adventure" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "Hellknight Hill",
  "cover_image_id": 2
}'

curl "https://pathmaster.gg/api/adventure" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "Prey for Death",
  "cover_image_id": 3
}'

curl "https://pathmaster.gg/api/adventure" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "Ruins of Gauntlight",
  "cover_image_id": 4
}'

curl "https://pathmaster.gg/api/adventure" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "The Great Toys Heist",
  "cover_image_id": 5
}'

curl "https://pathmaster.gg/api/session" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "Session 64",
  "adventure_id": 1
}'

curl "https://pathmaster.gg/api/session" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "The Iron Path",
  "adventure_id": 2
}'

curl "https://pathmaster.gg/api/session" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "Echoes of Eternity",
  "adventure_id": 3
}'

curl "https://pathmaster.gg/api/session" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "Session 3",
  "adventure_id": 4
}'

curl "https://pathmaster.gg/api/session" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "Session 5",
  "adventure_id": 5
}'

curl "https://pathmaster.gg/api/adventure/1" \
  --fail \
  -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "description": "In the Kingmaker adventure path, the players are transported to the frozen wilderness of Barktooth Pass, where they become the stewards of Storvalde County, a remote and unforgiving region on the edge of the world. As the county'"'"'s appointed regent, they must gather a team of loyal followers, appoint and manage advisors, and build up the infrastructure of the county by clearing land, building settlements, and recruiting soldiers. With each triumph, the players will earn influence, improve the county'"'"'s reputation, and gain access to new areas and opportunities.\nAs the players prosper, they will attract the attention of various factions, including bandits, rival nations, and ancient magical threats. They must master the complexities of governance, husbandry, and diplomacy, negotiating the delicate balance of power in the region while making choices that shape the future of Storvalde County. Amidst these challenges, they will uncover the hidden mysteries of the ancient whispers and learn the secrets of the land, influencing the destiny of their county and themselves. Throughout the campaign, players will grapple with leadership, legacy, and the responsibility that comes with power.",
  "background": "In the distant reaches of the world, nestled between the towering mountain ranges of the Dragon'"'"'s Teeth and the endless forests of the Wildwood, lies the forgotten realm of Storvalde. For generations, this frozen wilderness has been home to a hardy folk who have carved out a meager living from the unforgiving land. But as the seasons have passed, the people of Storvalde have found themselves facing a new and terrifying threat: the awakening of an ancient evil that has lain dormant for millennia.\nThe source of this evil is a long-forgotten artifact known as the Eye of the Beast, a powerful relic that has the ability to bend the fabric of reality to its will. Legends say that the Eye was created by a powerful sorcerer-king who sought to use its power to bring order to a chaotic world. But as the centuries passed, the Eye was lost to the sands of time, and its dark influence was all but forgotten. Now, as the realm of Storvalde teeters on the brink of destruction, the players must embark on a perilous journey to uncover the truth behind the Eye of the Beast and stop its dark influence before it'"'"'s too late.\nThe players'"'"' journey will take them across the treacherous landscape of Storvalde, through snow-swept mountains and dark forests, to the ruins of ancient civilizations and the lairs of fearsome creatures. Along the way, they will encounter a cast of colorful characters, from the enigmatic sorceress who guards the Eye to the ruthless bandits who seek to claim its power for themselves. As they delve deeper into the heart of the realm, the players will uncover the secrets of the Eye of the Beast and the true nature of the evil that threatens to consume all of Storvalde. Will they be able to stop the darkness before it'"'"'s too late, or will they succumb to the allure of the Eye'"'"'s power and become the very evil they seek to defeat?"
}'

curl "https://pathmaster.gg/api/adventure/2" \
  --fail \
  -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "description": "Players find themselves in the mediums-sized town of Ravens Bluff, nestled at the foot of a notorious hill known for its eerie and unexplained phenomena. The townsfolk are wary of strangers and the hill looms large in their collective psyche, with many whispering tales of the cruel and merciless Hellknights, an order of paladins sworn to uphold the law through any means necessary, who are rumored to patrol the peak. Strange and unsettling events have started to occur, with livestock gone missing, tools turned against their owners, and disturbing manifestations appearing throughout the town.\nThe players are approached by a local merchant named Artemis Thrain, who (much to their chagrin) insists they are the only ones he can trust with the task of investigating the troubles plaguing Ravens Bluff. His niece, a fledgling visionary, claims the hill is at the heart of the problem, and believes the disruption of the town'"'"'s steadiness is somehow connected to an aberration understandably resident within the nearby hill itself, it beckoning them to embark on a perilous climb to rid the hill of whatever evil taint threatens the settled village below.",
  "background": "For centuries, the town of Ravens Bluff has been plagued by strange occurrences and unexplained events. The townspeople have always believed that the source of these disturbances lies within the nearby Hellknight Hill, a place where the Hellknights, a powerful and feared order of paladins, have long been rumored to reside. The Hellknights are said to be guardians of the hill, protecting it from those who would seek to uncover its secrets.\nRecently, however, the disturbances have become more frequent and more intense. Livestock has gone missing, tools have turned against their owners, and strange manifestations have appeared throughout the town. The townspeople are afraid and do not know what to do. They have tried to ignore the problems, hoping that they will go away on their own, but the issues persist.\nIn desperation, the townspeople have turned to the players, hoping that they can help them uncover the source of the disturbances and put an end to them. The players are the only ones who have shown any interest in helping the town, and the townspeople are willing to pay them handsomely for their services. The players must now decide whether to take on the task of investigating Hellknight Hill and facing whatever dangers lie within, or to turn their backs on the town and leave them to their fate."
}'

curl "https://pathmaster.gg/api/adventure/3" \
  --fail \
  -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "description": "In \"Prey for Death\", the sleepy town of Oakwood has been plagued by a series of gruesome and bizarre gruesome attacks on its citizens. At the center of the mystery is the disappearance of the town'"'"'s children, seemingly taken away in the dead of night. As the town'"'"'s leaders, it'"'"'s your party'"'"'s job to uncover the cause behind these disappearances and put a stop to it. As the party delves deeper into the mystery, they'"'"'ll discover that the disappearances are connected to a dark cult that worships an ancient, malevolent force known only as \"The Devourer\".\nThe townspeople, once so warm and welcoming, grow increasingly hostile and resentful towards the party'"'"'s presence, fueling the narrative. But can you unravel the sinister forces at work and uncover the location of the cult before it'"'"'s too late? And what happens when the driver of the cult'"'"'s macabre rituals stops hiding and invades the town, taunting the party with pleasures and betrayals, and imploring others to join him in slinging roomba streamed images around young locales bringing a dark favor lead doomed.",
  "background": "In the small town of Oakwood, nestled in the heart of the Whispering Woods, a dark and sinister force has taken root. For generations, the townspeople have lived in peace, relying on the bounty of the land and the protection of the town'"'"'s founders, a group of powerful wizards who long ago bound a malevolent entity known as \"The Devourer\" to a magical artifact. But as the years have passed, the town'"'"'s prosperity has given way to complacency, and the memory of the Devourer has faded into legend. Now, as the town'"'"'s children begin to disappear one by one, the people of Oakwood must confront the truth: the Devourer has returned, and it will stop at nothing to claim the town as its own.\nThe town'"'"'s leaders, blinded by their own self-interest and fear, are powerless to stop the Devourer'"'"'s influence. As the town descends into chaos, a small group of adventurers must rise to the challenge and uncover the source of the Devourer'"'"'s power. They will need to delve into the depths of the town'"'"'s history, unravel the mysteries of the founders'"'"' binding, and confront the dark forces that have awakened the Devourer. But time is running out, and if the adventurers fail, the town of Oakwood will be consumed by the Devourer'"'"'s hunger, leaving nothing but a desolate wasteland in its wake.\nAs the adventurers begin their investigation, they will discover that the town'"'"'s founders were not just powerful wizards, but also members of a secret society dedicated to the study and containment of malevolent entities. They will need to uncover the society'"'"'s secrets and the truth behind the binding of the Devourer, all while navigating the treacherous political landscape of the town and confronting the dark forces that seek to claim the Devourer'"'"'s power for their own gain. The fate of Oakwood hangs in the balance, and the adventurers are the town'"'"'s only hope for survival."
}'

curl "https://pathmaster.gg/api/adventure/4" \
  --fail \
  -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "description": "In the desert twilight, the ancient Spire of Gauntlight pierces the sky like a shard of splintered stone. This ancient ruin, once the seat of the powerful Sorcerer-King, lies shrouded in mystery and treacherous politics. The Spire, said to hold the secrets of the ancient ones, has been overrun by a aberrant cult that seeks to unleash an otherworldly power upon the world. The site is said to be cursed, with eerie echoes of forgotten rituals still lingering in the air, drawing unwary adventurers to their doom.\nAs a result, a local community, weary of the sorcerer-king'"'"'s legacy and fearful of the cult'"'"'s dark plans, has hired a group of brave adventurers to delve into the heart of the Spire, uncover the cult'"'"'s plans, and put an end to their nefarious schemes. The party will delve into the treacherous ruins, navigating through unstable catacombs, ancient trials, and scores of unquiet spirits. Those brave adventurers that dare to claim the fabled treasure of the ancient ones will have to prove their mettle against the remnants of the cult and the curse that bedevils the Spire, facing fearsome foes and battling to maintain the delicate balance of power in the wider world.",
  "background": "In the distant past, the Sorcerer-King ruled over a vast and powerful empire, wielding magic and wisdom to maintain peace and prosperity. But as the centuries passed, the king'"'"'s obsession with the secrets of the ancient ones consumed him, and he delved too deeply into the forbidden arts. His madness and corruption spread to his subjects, and the empire crumbled into ruin. The Spire of Gauntlight, once the symbol of the king'"'"'s power, now stands as a haunted monument to the fallen civilization.\nIn the present day, the ruins of the empire are overrun by a cult dedicated to the worship of the ancient ones. The cultists believe that the secrets of the ancient ones can only be unlocked through human sacrifice, and they have been abducting travelers and locals to offer them up to their dark deities. The local community, weary of the cult'"'"'s depredations, has hired a group of brave adventurers to infiltrate the Spire of Gauntlight and put an end to the cult'"'"'s evil schemes.\nThe adventurers must navigate the treacherous ruins of the Spire, avoiding deadly traps and battling the undead minions of the cult. As they delve deeper into the heart of the Spire, they will uncover the dark secrets of the ancient ones and the true nature of the cult'"'"'s power. Can they defeat the cult and lift the curse of the Spire, or will they fall victim to the ruin'"'"'s deadly legacy? The fate of the community and the world hangs in the balance."
}'

curl "https://pathmaster.gg/api/adventure/5" \
  --fail \
  -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "description": "In the prestigious Great Museum of Wonder, the world'"'"'s most valuable and rare magical toys have been pilfered in a daring heist. The thief, a cunning mastermind known only as \"The Toy Baron,\" has set a challenge to the players: steal five specific, highly sought-after toys from the invertible collection of the Superstar'"'"'s Playroom, a network of intricately layered and chronomantically locked exhibits within the museum. The Toy Baron has an ulterior motive, however, and the players are invited to participate in this grand caper - but as double agents, for the added reward: infiltrate the heist, recover the stolen treasures, and claim the priceless Leaders trophy for themselves.\nThe players will navigate a cat-and-mouse game with museum security, rival art thieves, and the enigmatic Toy Baron, using their wits, skill, and guile to gather information, evade danger, and claim their spoils. As they dive deeper into the puzzle, they'"'"'ll uncover hidden getaway routes, clue-filled problem boxes, and secret rooms, all linked by cryptic cryptograms. With time magic unraveling and smells of transdimensional funny factory propellers, The Great Toys Heist sets the stage for an adventure that combines physical fun and frizz with matrix wrangling and quantum mechanisms, exquisitely re-infusing the PST texts with an element of beauty lost in classic Replay logic.",
  "background": "In the bustling city of New Alexandria, the Great Museum of Wonder has long been a beacon of learning and wonder. Its vast collection of magical artifacts and enchanted toys has drawn visitors from all corners of the world, and its hallowed halls have been graced by the presence of some of the greatest wizards and adventurers of all time. But behind the scenes, a shadowy figure known only as the Toy Baron has been secretly amassing a collection of his own, one that he intends to use to gain control over the city and its magical artifacts.\nThe Toy Baron'"'"'s true identity is a mystery, but his reputation as a master thief and cunning strategist is well-known. He has been quietly acquiring rare and powerful toys, using his vast network of contacts and resources to obtain them. Some say he has even made deals with dark forces from beyond the mortal realm, trading valuable artifacts for forbidden knowledge and power. As the Toy Baron'"'"'s power grows, the people of New Alexandria begin to feel the effects of his influence, and the once-peaceful city is plunged into chaos and uncertainty.\nWith the Toy Baron'"'"'s plan for domination nearing its culmination, the players are hired by the museum'"'"'s curator to infiltrate the Superstar'"'"'s Playroom and recover the stolen toys. The players must navigate the treacherous maze of the museum'"'"'s exhibits, avoiding deadly traps and cunning security measures to reach the heart of the Playroom. There, they will face the Toy Baron and his minions in a final showdown, with the fate of New Alexandria hanging in the balance. Can the players stop the Toy Baron and save the city from his evil plans, or will they fall victim to his cunning and his power? The fate of the city rests in their hands."
}'
