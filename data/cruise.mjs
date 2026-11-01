/*  Cruise guide content. First-person, from JD's notes on the Carnival Pride, Baltimore to Bermuda, Aug 2-9, 2026.
    Rule: things JD saw are stated as what he saw on one ship. Anything that varies by ship says so.
*/
export default {
  path: "/cruise/",
  title: "First Carnival cruise? Here's what I wish other blogs and regular cruise-goers had told me.",
  h1: ["First Carnival cruise? Here's what I wish other blogs and regular cruise-goers ", "had told me."],
  seoTitle: "First Carnival cruise: what I wish other blogs had told me (Carnival Pride, family of four)",
  desc: "My first Carnival cruise, through a first-timer's eyes: the questions experienced cruisers forget you have. What to pack, the first hour on the ship, ducks, doors, the breakfast to skip. Carnival Pride, Baltimore to Bermuda, family of four.",
  intro: [
    "If you're reading this, you've probably already researched a ton of experts, tips, and tricks online, on Reddit, on X. And if you're anything like me, you ended up with a thousand more questions. That's the problem with advice from experienced cruisers: they forget the questions a first-timer has. If you've ever been good at something and then tried to teach it to someone who isn't, you know what I mean.",
    "I've taught for over 20 years. I know how to break something down for a person who has never done it, and I know which questions they're going to have before they do. So I went on this cruise with that lens: curiosity, wonder, and a running list of everything I didn't know. This is my take on the whole thing, a fresh one, from the first-time cruise experience.",
    "It was an amazing trip. This is the Carnival Pride, Baltimore to Bermuda, and if you're thinking about a cruise, I hope this answers the questions you have.",
  ],
  modes: {
    label: "How do you want this?",
    story: "Tell me the story",
    facts: "Just the facts",
    note: "I set this page up the way I'd set up a lesson: two ways to get the same information. Story mode is for the night you want to sit back and read what it was actually like and picture yourself there. Facts mode strips the lore and gets you the information and out, because your time is limited. Switch any time.",
  },
  context: "Carnival Pride, out of Baltimore, 7 nights to Bermuda, August 2 to 9, 2026. Two adults, a six-year-old, a four-year-old, one balcony cabin on Deck 5. First cruise for all of us.",

  /* ---- What to buy ---- */
  buyHead: "What I'd buy for a first cruise",
  buyIntro: "These are the things I ordered the week before we left, ranked by how glad I was to have them. Every link is my Amazon link; if you buy, I earn a small commission and you pay the same price. The ones at the top are the ones I'd tell a friend to get first.",
  restHead: "The rest of what I packed",
  skipHead: "What I didn't buy, and why",
  skip: [
    ["Beach towels", "Carnival provides pool towels. You just need the bands or clips to keep them on the chair."],
    ["A hair dryer", "The cabin has one."],
    ["Full-size shampoo and soap", "The cabin shower has a dispenser with shampoo and body wash. It's basic, so bring travel sizes of your own if you care, and bring the kids' stuff."],
    ["A surge protector", "Banned on ships. Get the non-surge power strip instead or security pulls it from your bag."],
    ["Sunscreen on the ship", "It costs a lot more on board and in Bermuda. Buy it at home. Mineral, zinc oxide, SPF 30 to 50, lotion not spray."],
  ],
  carryOn: {
    head: "What goes in your carry-on, not the checked bag",
    why: "Your checked bags go away at the terminal and show up at your cabin later, sometimes hours later. Anything you need between the parking lot and dinner has to be on you.",
    items: ["Passports or birth certificates and photo ID", "Boarding passes, out and reachable (you will show them more than once)", "Lanyards, because your Sail & Sign cards are waiting at the cabin", "Swimsuits if you want the pool on day one", "Medicine, including motion sickness pills", "Phone chargers and the power strip", "Snacks for the kids and something for them to do in line", "Sunscreen"],
  },

  /* ---- First hour ---- */
  firstHead: "Your first hour on the ship",
  firstIntro: "This is the walk I wish I'd had in my head. Carnival Pride, one trip, so where something might be different on your ship, I say so.",
  steps: [
    { h: "Before you leave home: check in the minute it opens", fact: "Online check-in opens weeks out. Do it the day it opens to get an early arrival appointment.", p: ["Carnival online check-in opens weeks before the sailing, and when you check in you pick an arrival appointment at the terminal. I did not know that timing mattered. The earlier you check in, the more arrival times are still open. We got a later slot. It worked out because my wife wanted the extra sleep, but if you want to be on the ship early, check in the day it opens."], tip: "There are different arrival appointment times, and when you check in may decide which ones you can pick." },
    { h: "The terminal: keep your boarding pass out", fact: "Several checkpoints. You show the boarding pass more than once. Keep it in your hand.", p: ["You show your boarding pass a lot. There are more checkpoints than you expect. Every time I thought we were done, there was another one. Do not bury it in a backpack after the first person checks it."], tip: "You thought check-in was over? Keep that boarding pass out." },
    { h: "Luggage: it leaves you at the curb", fact: "Checked bags are taken at the terminal and delivered to your cabin later. Carry-on holds everything for the first few hours.", p: ["Big bags get tagged and taken at the terminal. You see them again at your cabin, later. So the carry-on has to have everything you need for the next few hours (the list is above)."] },
    { h: "Finding the cabin: odd on one side, even on the other", fact: "On the Pride, odd cabin numbers are on one side of the ship, even on the other. Check the sign at the elevators before walking.", p: ["We were on Deck 5. My daughter and I walked the wrong way looking for our room because I assumed the numbers just counted up down the hall. They don't. Odd-numbered cabins were on one side of the ship and even-numbered on the other. My six-year-old figured it out before I did. Check which side you're on before you start walking, and look at the signs at the elevator lobby."], tip: "If you're staring at cabin 5230 wondering where 5231 went, check the other side of the ship." },
    { h: "Your Sail & Sign cards are at the door", fact: "Cards were in a holder outside the cabin door. Room key + wallet + ID. Lanyard them immediately.", p: ["I didn't know where we'd get our cruise cards. They were waiting in a holder outside our cabin door with our names on them. That card is your room key, your wallet, and your ID for getting on and off the ship. Put it on a lanyard right away, especially for the kids."], tip: "Your cards may be waiting at the cabin, not handed to you at the terminal." },
    { h: "Why is my card blue?", fact: "Card color is Carnival's loyalty level. Blue = first Carnival cruise. Red, gold, platinum, diamond = more sailings. Changes nothing for you.", p: ["Ours were blue. I saw a woman near Guest Services with a gold one and had no idea why. As I understand it the color is Carnival's loyalty level: blue means it's your first Carnival cruise, and red, gold, platinum, and diamond mean you've sailed more. So blue is just 'first-timer.' Nobody treats you differently."] },
    { h: "Everyone's hungry: eat before you fix anything", fact: "Lido buffet is open on boarding day. One parent feeds the kids while the other handles the errand.", p: ["We boarded, we were hungry, and we didn't know where to go. The buffet on the Lido deck is open on embarkation day and that's where everyone goes first. I sent my wife and the kids to eat while I handled the one thing I needed to sort out. Don't drag hungry kids to a line. Divide and conquer."], tip: "One parent handles the question. The other parent feeds the kids." },
    { h: "Guest Services is not for everything", fact: "Pride: Guest Services is Deck 2 by the atrium, not Deck 1. Dining changes are not handled there; ask the dining staff.", p: ["I went to Deck 1 first. Wrong. Guest Services on the Pride is on Deck 2, by the atrium. There was a line and it wasn't obvious where it started; I stood near everyone else and hoped. Then I learned the thing I was there for, changing our dinner time, isn't handled by Guest Services at all. Dining changes go through the dining staff. Before you stand in that line, ask a crew member who handles your thing."], tip: "Guest Services isn't where you change your dinner time." },
    { h: "Dinner time", fact: "Set dining times plus a flexible option. Ask the dining room host on day one to switch.", p: ["We were set for 5:30 and wanted to see about earlier. On Carnival the main dining room has set times and a flexible 'Your Time' option; what you can switch to depends on what's open. Ask the dining room host on embarkation day, not Guest Services."] },
    { h: "Elevators", fact: "Midship elevators seemed busiest. Walk to the forward or aft bank at peak times. One week of watching, not science.", p: ["The elevators in the middle of the ship seemed much busier than the ones at the front and back. I think walking to the other bank is faster at busy times. That's one week of watching, not science. Try it."] },
    { h: "Learn three places, then relax", fact: "Cabin, food, atrium. Once you can get between those three, you're fine.", p: ["Your cabin. The food. The main atrium where the desks and the shops are. Once you can get between those three without a map, the ship stops feeling huge and the vacation starts."] },
  ],

  /* ---- Doors and ducks ---- */
  ducksHead: "Doors and ducks: the part I didn't find on any blog",
  ducksFacts: [
    "Cabin doors are magnetic. People decorate them: themes, whiteboards you can draw on, magnets.",
    "Cruise ducks: people hide little rubber ducks around the ship for others to find. New ones show up every day.",
    "First cruise? Don't bring ducks to hand out. Just collect. Count how many your kids can find.",
    "Someone will probably hand your kid a duck. Let them.",
  ],
  ducks: [
    "I use a lot of tools to research, and I didn't find this part anywhere. The cabin doors are magnetic, and people decorate them. Some had whiteboards with things to draw on. Some were themed. Walking the hall was its own little show.",
    "And the ducks. On Carnival, people bring little rubber ducks and hide them around the ship for other people to find. I thought the ducks were just there and you found them through the day. It's better than that. A spot can be empty for two days and on the third day there's a duck in it, because a passenger or a crew member who loves this put one there. It refreshes every day.",
    "If this is your first cruise, I wouldn't buy ducks to hand out. I would only collect, and see how many your kids can find. That's the better experience the first time. When my kids are older I want to teach them gratitude and have them be the ones passing out ducks.",
    "We were at breakfast in the dining room and a girl, a very tall twelve-year-old I'd guess, came over and asked me if she could give my kids some ducks. So respectful, so kind. It made their day. Whatever was going on at the table didn't matter after that. That kindness set the rest of the day.",
  ],

  /* ---- The people ---- */
  peopleHead: "The people on board",
  peopleFacts: [
    "Everyone is happy to be there. Lots of smiles.",
    "You can tell the experienced cruisers by how they walk. Doesn't matter.",
    "The crew is up for a joke. Use it.",
  ],
  people: [
    "I do a lot of people watching, and a ship is a good place for it. There are the people who are just grateful to be out at sea, and you can see it on them. There are the experienced cruisers, who walk with a different kind of stride. All in all, everybody seems happy. Everybody knows they're on vacation and they want to have a good time, so it's smiles everywhere. We never ran into anyone who wasn't.",
    "I have a sense of humor, so I like to break things up with the crew and the people around me. They're up for it.",
  ],

  /* ---- The bad one ---- */
  badHead: "The one thing I'd skip: the Thing 1 and Thing 2 breakfast",
  badFacts: [
    "Carnival's Dr. Seuss character breakfast. About $15 an adult, a bit less for kids. We paid around $50 for four.",
    "The food is candy-level sugary. The rainbow cake tasted old and freezer-burnt. Our kids wouldn't eat it.",
    "Characters rushing table to table, a tiny parade, a schedule to keep. Felt awkward.",
    "They'll offer you cups mid-meal. They're about $15 each and the lids are bad. Say no.",
    "Do this instead: reserve a table in the regular dining room through the Carnival app. Better food, better room, no charge.",
  ],
  bad: [
    "I'm going to tell you about a really bad experience, because the blogs made it sound great and it wasn't. For my birthday, actually the day before, we did the Thing 1 and Thing 2 breakfast with the kids. It's pretty much $15 a person, maybe $10 for the kids. We paid about $50. Online, people talked about how great it was. It is not. It is horrible.",
    "Everything is sugared up. Candified. My kids, who are kids, said it was too sugary, and that's weird for a kid to say, right? They didn't want what was on the menu. They bring you up to another level, into a sectioned-off area, and I've performed on stage, so I was watching the characters try to keep to a schedule and make people happy at the same time, and it just felt awkward. Thing 1 and Thing 2 come to each table, take pictures, and then there's a tiny parade that seemed rushed and thrown together.",
    "The rainbow cake they brought for my birthday, and there are other birthdays at every seating because that's what it's for, tasted like it had been stored in my dad's basement in Baltimore. My dad collected a lot of stuff and hustled, buying and reselling things, and his basement smelled like an old auction house. That cake tasted like it had been sitting in there absorbing the aroma, and freezer-burnt at the same time. Was it moist? Yes. My daughter loves rainbow anything and tries to love things even when she'd rather have chocolate, and she didn't want it.",
    "Then somebody came over mid-meal and asked if we'd like some cups. Sure, we'll take two. They were about $15 each, and they're awful. The lids barely lock or unlock. We should have handed them back and said take it off the bill.",
    "Here's the thing. We had the most fantastic time in the regular dining room. Reserving a table through the app, with the kids, in the main dining area, was a better experience and a more beautiful room, and it didn't cost extra. If you have a birthday on board, don't do Thing 1 and Thing 2. You can make it a special day just walking around the ship. That's the one I'd skip.",
  ],

  /* ---- Family ---- */
  familyHead: "Cruising with little kids",
  family: [
    ["Feed them first", "Every administrative problem can wait twenty minutes. A hungry four-year-old cannot."],
    ["Lanyards on the kids", "The card is their room key. Breakaway clasp."],
    ["Night light", "The cabin is darker than any room at home. A motion-sensor light by the bathroom means nobody falls over a suitcase at 2 a.m."],
    ["Sea days are long", "Two full days at sea on the Baltimore to Bermuda run. Books, cards, UNO, and the kids club."],
    ["Sunscreen stick", "A stick for faces is the only way it goes on without a fight."],
    ["Wet bag", "Something is always wet. Keep it away from the phone."],
  ],

  /* ---- Balcony ---- */
  balconyHead: "Was the balcony worth it?",
  balcony: [
    "For us, yes. I went back and forth on paying extra for a balcony for a family of four. Once I saw it, I stopped thinking about the money. Morning coffee with the ocean going by, watching Bermuda come up, somewhere to sit while the kids napped. Photos don't show you what it's like to have your own outside.",
    "We also asked for twin beds and got a king. I was glad. The cabin steward can change the bed setup, so if it matters, ask on day one.",
    "The real question for a family isn't balcony or no balcony. It's one cabin or two. One balcony for four is usually the cheapest. Two cabins gets you a second bathroom. I'm working on a page that does that math honestly.",
  ],

  /* ---- Day by day ---- */
  daysHead: "Day by day",
  daysIntro: "I kept notes the first couple of days. I'm writing up the rest. This is what's done.",
  days: [
    { d: "Day 1: Baltimore, boarding", p: ["Everything in 'Your first hour' above happened on this day. The short version: later arrival slot than I wanted, more checkpoints than I expected, walked the wrong way to the cabin, found the cards at the door, sent the family to eat, stood in the wrong line, loved the balcony."] },
    { d: "Days 2 and 3: at sea", p: ["Coming. Two sea days on the way down. Pool, kids club, the books, the first formal night."] },
    { d: "Days 4 to 6: Bermuda", p: ["Coming. The ship docks for a few days, so you can go back and forth. Beach day notes, the baby powder trick, and what we spent."] },
    { d: "Days 7 and 8: home, and my birthday", p: ["Coming. We got back to Baltimore on August 9, which is my birthday."] },
  ],

  /* ---- Still checking ---- */
  verifyHead: "Things I'm still checking",
  verify: "This is one person's first cruise on one ship. Where I've said 'on the Pride' it's what I saw. Carnival changes things, and other ships are laid out differently. Before you lean on a detail that matters (check-in timing, where Guest Services is, dining rules), check Carnival's own site for your ship and sailing.",
};
