/*  Cruise guide content. First-person, from JD's notes on the Carnival Pride, Baltimore to Bermuda, Aug 2-9, 2026.
    Rule: things JD saw are stated as what he saw on one ship. Anything that varies by ship says so.
*/
export default {
  path: "/cruise/",
  title: "First Carnival cruise? Here's what I wish someone had told me.",
  seoTitle: "First-time Carnival cruise guide: what to pack, what happens the first hour, what I'd buy",
  desc: "A regular dad's first Carnival cruise (Pride, Baltimore to Bermuda, family of four). What to pack, what actually happens when you board, and the stuff I'd buy again.",
  intro: [
    "I walked onto the Carnival Pride thinking the hard part was over because we'd checked in. Within an hour I had learned that I didn't know where my room was, why my card was blue, where my family could eat, which deck Guest Services was on, who controlled our dinner time, or why one bank of elevators seemed to take forever.",
    "None of it was hard. There were just dozens of tiny things nobody tells you. This page is those things, plus the list of what I packed and what I'd buy again.",
  ],
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
    { h: "Before you leave home: check in the minute it opens", p: ["Carnival online check-in opens weeks before the sailing, and when you check in you pick an arrival appointment at the terminal. I did not know that timing mattered. The earlier you check in, the more arrival times are still open. We got a later slot. It worked out because my wife wanted the extra sleep, but if you want to be on the ship early, check in the day it opens."], tip: "There are different arrival appointment times, and when you check in may decide which ones you can pick." },
    { h: "The terminal: keep your boarding pass out", p: ["You show your boarding pass a lot. There are more checkpoints than you expect. Every time I thought we were done, there was another one. Do not bury it in a backpack after the first person checks it."], tip: "You thought check-in was over? Keep that boarding pass out." },
    { h: "Luggage: it leaves you at the curb", p: ["Big bags get tagged and taken at the terminal. You see them again at your cabin, later. So the carry-on has to have everything you need for the next few hours (the list is above)."] },
    { h: "Finding the cabin: odd on one side, even on the other", p: ["We were on Deck 5. My daughter and I walked the wrong way looking for our room because I assumed the numbers just counted up down the hall. They don't. Odd-numbered cabins were on one side of the ship and even-numbered on the other. My six-year-old figured it out before I did. Check which side you're on before you start walking, and look at the signs at the elevator lobby."], tip: "If you're staring at cabin 5230 wondering where 5231 went, check the other side of the ship." },
    { h: "Your Sail & Sign cards are at the door", p: ["I didn't know where we'd get our cruise cards. They were waiting in a holder outside our cabin door with our names on them. That card is your room key, your wallet, and your ID for getting on and off the ship. Put it on a lanyard right away, especially for the kids."], tip: "Your cards may be waiting at the cabin, not handed to you at the terminal." },
    { h: "Why is my card blue?", p: ["Ours were blue. I saw a woman near Guest Services with a gold one and had no idea why. As I understand it the color is Carnival's loyalty level: blue means it's your first Carnival cruise, and red, gold, platinum, and diamond mean you've sailed more. So blue is just 'first-timer.' Nobody treats you differently."] },
    { h: "Everyone's hungry: eat before you fix anything", p: ["We boarded, we were hungry, and we didn't know where to go. The buffet on the Lido deck is open on embarkation day and that's where everyone goes first. I sent my wife and the kids to eat while I handled the one thing I needed to sort out. Don't drag hungry kids to a line. Divide and conquer."], tip: "One parent handles the question. The other parent feeds the kids." },
    { h: "Guest Services is not for everything", p: ["I went to Deck 1 first. Wrong. Guest Services on the Pride is on Deck 2, by the atrium. There was a line and it wasn't obvious where it started; I stood near everyone else and hoped. Then I learned the thing I was there for, changing our dinner time, isn't handled by Guest Services at all. Dining changes go through the dining staff. Before you stand in that line, ask a crew member who handles your thing."], tip: "Guest Services isn't where you change your dinner time." },
    { h: "Dinner time", p: ["We were set for 5:30 and wanted to see about earlier. On Carnival the main dining room has set times and a flexible 'Your Time' option; what you can switch to depends on what's open. Ask the dining room host on embarkation day, not Guest Services."] },
    { h: "Elevators", p: ["The elevators in the middle of the ship seemed much busier than the ones at the front and back. I think walking to the other bank is faster at busy times. That's one week of watching, not science. Try it."] },
    { h: "Learn three places, then relax", p: ["Your cabin. The food. The main atrium where the desks and the shops are. Once you can get between those three without a map, the ship stops feeling huge and the vacation starts."] },
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
