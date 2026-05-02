/* The Family Derby Pool — interactivity
   - Renders the field
   - Bet calculator + form submission (Supabase-backed shared pool)
   - Live realtime sync of everyone's bets
   - Countdown to post time
*/
(function () {
  "use strict";

  // -------------------------------------------------------------------------
  // Config
  // -------------------------------------------------------------------------
  const POST_TIME_ISO = "2026-05-02T18:57:00-04:00"; // 6:57 PM ET, Sat May 2, 2026
  const SUPABASE_URL = "https://sswohrmidrbuxluevosm.supabase.co";
  const SUPABASE_KEY = "sb_publishable_fLgnMThw72XF61S6zsofmw_rBqfZdt9";

  // Assumed-pool figure used to project payouts before any real money is in.
  // Tuned so the worked-example math matches real intuition.
  const ASSUMED_POOL = 400;

  // -------------------------------------------------------------------------
  // The field — 152nd Run for the Roses
  // Post-position colors follow the official Kentucky Derby saddle towels.
  // -------------------------------------------------------------------------
  const horses = [
    { post:1, name:"Renegade", odds:"4-1", num:4,
      jockey:"Irad Ortiz Jr.",
      jockeyExtra:" (Puerto Rico) — one of the most accomplished riders in North America, but 0-for-9 in past Derbies",
      trainer:"Todd Pletcher",
      trainerExtra:" (USA) — Hall of Famer with two prior Derby wins (Super Saver in 2010, Always Dreaming in 2017)",
      owner:"Repole Stable (Mike Repole, USA) and Robert & Lawana Low (USA) — Repole is the New York entrepreneur who co-founded Vitaminwater",
      silksA:"#B8232A", silksB:"#1A1A1A", sex:"Colt", tag:"The favorite",
      likes:"He just won the Arkansas Derby and the Sam F. Davis before that, and he closed his last race faster than any other Derby horse. His bloodlines make him the field's best-bred horse for the 1¼-mile distance.",
      concerns:"He drew the rail — gate 1 — which is the worst spot in the race. No horse has won from there since 1986. Also, favorites have lost the Derby every year since 2018.",
      funFact:"He was bought as a yearling for $975,000 and is a half-brother (same mom) to fellow Derby starter Commandment." },

    { post:2, name:"Albus", odds:"30-1", num:30,
      jockey:"Manny Franco",
      jockeyExtra:" (Puerto Rico) — top East Coast rider with two prior Derby starts but no win",
      trainer:"Riley Mott",
      trainerExtra:" (USA) — son of Hall of Famer Bill Mott, who's also in this race with a different horse",
      owner:"Pin Oak Stud (USA) — historic Kentucky breeding farm founded by oil heiress Josephine Abercrombie",
      silksA:"#FAF6F0", silksB:"#5C1A1B", sex:"Colt",
      likes:"He won the Blue Grass Stakes at Keeneland in his last start, which is one of the most respected Derby tune-up races. His mother's bloodline includes a champion mare named Malathaat.",
      concerns:"His dad (Yaupon) is a young stallion better known for producing sprinters, and Albus's running style and speed numbers are a notch below the top contenders.",
      funFact:"Riley Mott has two horses in this race against his Hall of Fame father — a real-life family rivalry on the biggest stage in the sport." },

    { post:3, name:"Intrepido", odds:"50-1", num:50,
      jockey:"Hector Berrios",
      jockeyExtra:" (Venezuela) — South Florida–based rider making his Kentucky Derby debut",
      trainer:"Jeff Mullins",
      trainerExtra:" (USA) — California-based veteran trainer with several past Derby starters but no winner",
      owner:"Sierra Fria Farm (USA) — small private stable making its first Derby appearance",
      silksA:"#1d4ed8", silksB:"#FAF6F0", sex:"Colt",
      likes:"His grandfather is Into Mischief, the most successful Derby sire of the past decade, so the bloodlines have a touch of magic.",
      concerns:"He's never beaten this caliber of horses. He squeaked into the field on points and most handicappers are tossing him.",
      funFact:"He's one of four horses in the race that trace back to Into Mischief — that single stallion has now sired or grandsired four of the last six Derby winners." },

    { post:4, name:"Litmus Test", odds:"30-1", num:30,
      jockey:"Martin Garcia",
      jockeyExtra:" (Mexico) — longtime Bob Baffert rider, won the 2010 Preakness with Lookin At Lucky",
      trainer:"Bob Baffert",
      trainerExtra:" (USA) — six-time Derby winner, tied for the all-time record; a win today would break it",
      owner:"Pam & Martin Wygod (USA) — California-based; Martin is a healthcare entrepreneur who founded WebMD predecessor Medco",
      silksA:"#eab308", silksB:"#1A1A1A", sex:"Colt",
      likes:"He won an important race called the Los Alamitos Futurity as a 2-year-old, and Baffert has a knack for getting horses to peak on Derby Day.",
      concerns:"He hasn't been the same horse this year — he ran a troubled seventh in the Arkansas Derby last out. His dad (Nyquist, the 2016 Derby winner) tends to produce horses better at shorter distances.",
      funFact:"He sold for $875,000 as a yearling, and Baffert's team is adding blinkers (eye covers that help horses focus straight ahead) for the first time today." },

    { post:5, name:"Great White", odds:"50-1", num:50,
      jockey:"Alex Achard",
      jockeyExtra:" (France) — French-born apprentice rider based in the US, making his Kentucky Derby debut",
      trainer:"John Ennis",
      trainerExtra:" (USA) — Kentucky-based trainer with a small stable, making his first Derby start",
      owner:"Three Chimneys Farm (Goncalo Torrealba, Venezuela/USA) and John Ennis (USA) — Three Chimneys is one of the most prestigious Kentucky breeding farms; Torrealba is its Venezuelan-born owner",
      silksA:"#22c55e", silksB:"#FAF6F0", sex:"Colt",
      likes:"He won the John Battaglia Memorial at Turfway Park in Kentucky in his run-up to the Derby.",
      concerns:"His Battaglia win came on a synthetic track, and when he tried real dirt in the Blue Grass Stakes he ran a flat fifth. Switching surfaces for the biggest race of his life is a real worry.",
      funFact:"His dad (Volatile) was a brilliant sprinter — which means his bloodlines aren't bred for the Derby trip the way most of the other contenders are." },

    { post:6, name:"Commandment", odds:"6-1", num:6,
      jockey:"Luis Saez",
      jockeyExtra:" (Panama) — top-tier rider whose best Derby finish was third with Essential Quality in 2021",
      trainer:"Brad Cox",
      trainerExtra:" (USA) — Louisville native who won the 2021 Derby (via disqualification) with Mandaloun, who is Commandment's half-brother",
      owner:"Spendthrift Farm (Eric Gustavson, USA) — major Kentucky breeding farm originally built by the late Wayne Hughes (founder of Public Storage)",
      silksA:"#1A1A1A", silksB:"#C9A961", sex:"Colt", tag:"Tied for second favorite",
      likes:"He's won four races in a row, including the Florida Derby and the Fountain of Youth. He showed real grit in Florida, coming from dead last to win by a nose.",
      concerns:"His speed numbers are middle-of-the-pack — at least eight other horses in the race have gone equally fast or faster. And Cox's last 10 Derby starters have averaged a 10th-place finish.",
      funFact:"He's a half-brother to favorite Renegade and to Mandaloun. His mother's father, Orb, won the 2013 Derby — so his bloodlines come pre-stamped for Churchill Downs." },

    { post:7, name:"Danon Bourbon", odds:"20-1", num:20,
      jockey:"Atsuya Nishimura",
      jockeyExtra:" (Japan) — this is his first race ever on American soil",
      trainer:"Manabu Ikezoe",
      trainerExtra:" (Japan) — making his first Kentucky Derby start",
      owner:"Danox Co. Ltd. (Japan) — racing operation tied to the high-end \"Danon\" stable that has campaigned numerous Japanese stakes winners",
      silksA:"#fb923c", silksB:"#FAF6F0", sex:"Colt",
      likes:"He's undefeated in three starts in Japan and won his last race impressively. He was actually born in Kentucky before being shipped to Japan, so the bloodlines are familiar to American breeders.",
      concerns:"No Japanese-based horse has ever won the Kentucky Derby, despite seven previous tries. Shipping a horse across the Pacific and getting him to peak on a strange track is a massive ask.",
      funFact:"This is one of two Japan-trained horses in the race, plus a third (Six Speed) shipping in from Dubai — making for an unusually international field." },

    { post:8, name:"So Happy", odds:"15-1", num:15,
      jockey:"Mike Smith",
      jockeyExtra:" (USA) — at 60 years old, the oldest rider in the race; won the 2018 Derby with Justify and the 2005 Derby with Giacomo",
      trainer:"Mark Glatt",
      trainerExtra:" (USA) — California-based trainer making his second Derby start",
      owner:"Norman Stables (USA) and Saints or Sinners (USA) — racing partnerships from California's Del Mar circuit",
      silksA:"#ec4899", silksB:"#FAF6F0", sex:"Colt",
      likes:"He drew off to win the Santa Anita Derby — California's biggest Derby prep — by nearly three lengths. Mike Smith on the back of any live longshot is always dangerous.",
      concerns:"His dad (Runhappy) was a champion sprinter whose offspring are usually best at much shorter distances. Pedigree experts say the 1¼ miles will likely be too far for him.",
      funFact:"A win would make Mike Smith, at 60, the oldest jockey ever to win the Derby, breaking Bill Shoemaker's record (54)." },

    { post:9, name:"The Puma", odds:"10-1", num:10,
      jockey:"Javier Castellano",
      jockeyExtra:" (Venezuela) — won the 2023 Derby with longshot Mage; this is his 18th Derby ride",
      trainer:"Gustavo Delgado",
      trainerExtra:" (Venezuela) — won the 2023 Derby with Mage; based in South Florida",
      owner:"OGMA Investments (USA), JR Ranch (USA), and High Step Racing (USA) — a Florida-based partnership of three smaller racing groups",
      silksA:"#0d9488", silksB:"#FAF6F0", sex:"Colt",
      likes:"He won the Tampa Bay Derby and only lost the Florida Derby by a nose to Commandment. The Castellano-Delgado team has already won this race together.",
      concerns:"Closely tied to Commandment in his prep races and never quite beat him. His mother's side of the family doesn't scream “long-distance horse.”",
      funFact:"His dad (Essential Quality) was the favorite for the 2021 Derby and lost — so The Puma is essentially trying to redeem his father's biggest career disappointment." },

    { post:10, name:"Wonder Dean", odds:"30-1", num:30,
      jockey:"Ryusei Sakai",
      jockeyExtra:" (Japan) — one of Japan's top riders; finished third in the 2024 Derby with Forever Young and has won the Saudi Cup twice",
      trainer:"Daisuke Takayanagi",
      trainerExtra:" (Japan) — accomplished Japanese trainer making his first Kentucky Derby start",
      owner:"Yoshinari Yamamoto (Japan) — private Japanese owner-breeder",
      silksA:"#7c3aed", silksB:"#C9A961", sex:"Colt",
      likes:"He won the UAE Derby in Dubai in his last race, beating fellow Derby starter Six Speed. Sakai is genuinely world-class.",
      concerns:"Two devastating historical trends apply here — since 2000, 21 horses have used the UAE Derby as a Kentucky Derby prep and zero have won the Run for the Roses. He's also Japan-bred, another 0-for category.",
      funFact:"Sakai's third-place finish with Forever Young in 2024 was actually called for the win at one point, then bumped to third after a steward's review." },

    { post:11, name:"Incredibolt", odds:"20-1", num:20,
      jockey:"Jaime Torres",
      jockeyExtra:" (Puerto Rico) — won the 2024 Preakness Stakes with Seize the Grey; this is his Derby debut",
      trainer:"Riley Mott",
      trainerExtra:" (USA) — same trainer as Albus, in his sophomore year as a head trainer",
      owner:"Pin Oak Stud (USA) — same owner as Albus",
      silksA:"#f87171", silksB:"#FAF6F0", sex:"Colt",
      likes:"He won the Street Sense Stakes at Churchill Downs last fall, so he already knows the track. His dad (Bolt d'Oro) is a respected stallion.",
      concerns:"His form against top horses is uneven, and stepping up to face the Derby field is a much taller order.",
      funFact:"Riley Mott's two Pin Oak horses (Incredibolt and Albus) are both essentially auditioning for the family stable while his father Bill Mott's horse runs against them — a fascinating father-son dynamic." },

    { post:12, name:"Chief Wallabee", odds:"8-1", num:8,
      jockey:"Junior Alvarado",
      jockeyExtra:" (Venezuela) — won last year's Derby with Sovereignty, his first ever",
      trainer:"Bill Mott",
      trainerExtra:" (USA) — Hall of Famer, won last year's Derby with Sovereignty and also won in 2019 with Country House",
      owner:"Mike & Katherine Ball (USA) — Kentucky-based husband-and-wife breeders/owners with a small but high-quality stable",
      silksA:"#84cc16", silksB:"#1A1A1A", sex:"Colt",
      likes:"He's got the same trainer-jockey team that won the Derby AND the Belmont Stakes last year. He's been a consistent runner-up in big Florida races.",
      concerns:"He hasn't actually won a major race yet — he's been runner-up multiple times to Commandment specifically.",
      funFact:"Alvarado was fined $62,000 for whipping his horse too many times during last year's Derby win — appealed and got it reduced to $31,000." },

    { post:13, name:"Ocelli", odds:"50-1", num:50,
      jockey:"Joe Ramos",
      jockeyExtra:" (USA) — Kentucky circuit rider making his Kentucky Derby debut",
      trainer:"D. Whitworth Beckman",
      trainerExtra:" (USA) — small-stable trainer based in Lexington, Kentucky, making his first Derby start",
      owner:"Ashley Durr (USA), Anthony Tate (USA), and Front Page Equestrian (USA) — a small grassroots ownership partnership",
      silksA:"#a16207", silksB:"#FAF6F0", sex:"Colt",
      likes:"He finished a respectable third in the Blue Grass Stakes, beaten by horses also in this Derby field. He gets in via the also-eligible list, which means he's getting a chance bigger names didn't.",
      concerns:"He's never won a major stakes race, and the Derby is a giant leap.",
      funFact:"His ownership group is one of the smaller, more grassroots partnerships in this race — a David-and-Goliath story against the mega-stables." },

    { post:14, name:"Potente", odds:"20-1", num:20,
      jockey:"Juan Hernandez",
      jockeyExtra:" (Mexico) — California-based rider, won the 2023 Breeders' Cup Classic on White Abarrio",
      trainer:"Bob Baffert",
      trainerExtra:" (USA) — six-time Derby winner; this is his second horse in the race",
      owner:"Speedway Stables (USA) — owned by Peter Fluor and K.C. Weiner, Texas oil and racing money",
      silksA:"#7f1d1d", silksB:"#C9A961", sex:"Colt",
      likes:"He finished a strong second to So Happy in the Santa Anita Derby. Baffert is masterful at peaking horses for the first Saturday in May, and Potente's bloodlines suggest he'll handle the longer distance.",
      concerns:"He's never won a top-tier race. Not all pedigree experts are convinced 1¼ miles is his sweet spot.",
      funFact:"Either Potente or his stablemate Litmus Test could give Baffert an unprecedented seventh Derby win, breaking a tie with the legendary Ben Jones." },

    { post:15, name:"Emerging Market", odds:"15-1", num:15,
      jockey:"Flavien Prat",
      jockeyExtra:" (France) — won the 2019 Derby with Country House (via disqualification of Maximum Security)",
      trainer:"Chad Brown",
      trainerExtra:" (USA) — four-time Eclipse Award–winning trainer, but has not yet won the Derby",
      owner:"Klaravich Stables (Seth Klarman, USA) — Klarman is a famous Boston-based hedge-fund manager",
      silksA:"#a8a29e", silksB:"#1A1A1A", sex:"Colt",
      likes:"He won the Louisiana Derby easily in just his second-ever race. His bloodlines are absolutely tailor-made for long distances. He's the lone horse in the field NOT descended from the legendary Secretariat.",
      concerns:"Two career races is extremely light for a Derby horse. Surviving a 20-horse traffic scramble with that little experience is a real concern.",
      funFact:"His dad (Candy Ride) was 23 years old when Emerging Market was conceived — practically a senior citizen by stallion standards." },

    { post:16, name:"Pavlovian", odds:"30-1", num:30,
      jockey:"Edwin Maldonado",
      jockeyExtra:" (Mexico) — Southern California–based rider making his Kentucky Derby debut",
      trainer:"Doug O'Neill",
      trainerExtra:" (USA) — won the Derby with I'll Have Another (2012) and Nyquist (2016)",
      owner:"Reddam Racing (J. Paul Reddam, USA/Canada) — Reddam founded the lender DiTech Funding",
      silksA:"#c4b5fd", silksB:"#5C1A1B", sex:"Colt",
      likes:"He's improved dramatically in recent months — back in February he was a middling, winless horse, and now he's a contender. Trainer Doug O'Neill has a track record of getting longshots to fire on Derby Day.",
      concerns:"His speed numbers are still well below the top contenders, and he's drawn next to a horse (Six Speed) who could push him into a faster early pace than ideal. He's also had some history of breaking slowly from the gate.",
      funFact:"As recently as Valentine's Day, Pavlovian had won just one race in eight tries. The transformation in three months has been one of the wildest stories of this Derby trail." },

    { post:17, name:"Six Speed", odds:"50-1", num:50,
      jockey:"Brian Hernandez Jr.",
      jockeyExtra:" (USA) — won the 2024 Derby with Mystik Dan",
      trainer:"Bhupat Seemar",
      trainerExtra:" (UAE-based, originally India) — top trainer at Dubai's Meydan Racecourse, making his Kentucky Derby debut",
      owner:"Brunetti Dugan Stables (USA), Black Type Thoroughbreds (USA), Steve Adkisson (USA), and Swinbank Stables (United Kingdom) — a four-way international partnership",
      silksA:"#fbcfe8", silksB:"#B8232A", sex:"Colt",
      likes:"His dad (Not This Time) is one of the hottest young stallions in racing. He'll likely set the early pace, which sometimes works at the Derby. Hernandez has the Derby trophy on his recent résumé.",
      concerns:"He's been racing in Dubai, and shippers from there have a poor track record at the Derby. His mother was a sprinter, and aggressive front-running tactics in a 20-horse field often get caught late.",
      funFact:"This is the first horse from trainer Bhupat Seemar's Dubai stable to start in the Kentucky Derby — a milestone for Middle Eastern racing." },

    { post:18, name:"Further Ado", odds:"6-1", num:6,
      jockey:"John Velazquez",
      jockeyExtra:" (Puerto Rico) — the winningest active Derby jockey with three wins (Animal Kingdom 2011, Always Dreaming 2017, Authentic 2020)",
      trainer:"Brad Cox",
      trainerExtra:" (USA) — second horse for Cox in this race",
      owner:"Spendthrift Farm (USA) — same owner as Commandment",
      silksA:"#15803d", silksB:"#FAF6F0", sex:"Colt",
      likes:"He won the Blue Grass Stakes at Keeneland in his last start. His dad (Gun Runner) is the gold standard for stallions producing horses that excel at long distances. So the breeding is excellent for the trip.",
      concerns:"No Blue Grass Stakes winner has actually gone on to win the Derby since 1991 — a 35-year drought.",
      funFact:"His breeder (Debby Oxley) also bred 2024 Derby third-place finisher Sierra Leone, suggesting her breeding program is on a serious heater." },

    { post:19, name:"Golden Tempo", odds:"30-1", num:30,
      jockey:"Jose Ortiz",
      jockeyExtra:" (Puerto Rico) — younger brother of favorite Renegade's jockey Irad Ortiz Jr.; won the 2017 Belmont Stakes with Tapwrit",
      trainer:"Cherie DeVaux",
      trainerExtra:" (USA) — one of the small but growing number of top female trainers in the sport, making her Kentucky Derby debut",
      owner:"Phipps Stable (Daisy Phipps Pulito, USA) and St. Elias Stable (Vincent Viola, USA) — Viola owns the NHL's Florida Panthers; Phipps is from one of America's oldest racing dynasties",
      silksA:"#9f1239", silksB:"#FAF6F0", sex:"Colt",
      likes:"He won the Lecomte Stakes with a powerful late charge from far back. His dad is Curlin, one of the most respected stallions for stamina-heavy distances.",
      concerns:"No son of Curlin has ever won the Kentucky Derby, despite Curlin himself being one of the best racehorses of the past 25 years. He also only finished third in the Louisiana Derby.",
      funFact:"It's a true sibling rivalry — the Ortiz brothers are the most successful jockey siblings in racing history, and they're going head-to-head for the Derby trophy today." },

    { post:20, name:"Robusta", odds:"50-1", num:50,
      jockey:"Emisael Jaramillo",
      jockeyExtra:" (Venezuela) — Florida-based veteran rider best known for South Florida circuit success, making his Kentucky Derby debut",
      trainer:"Doug O'Neill",
      trainerExtra:" (USA) — second horse for O'Neill in this race; two-time Derby winner",
      owner:"Calumet Farm (USA) — the most historic owner in American racing, with nine Derby wins, the all-time record; current owner is Brad Kelley, an American billionaire",
      silksA:"#7dd3fc", silksB:"#5C1A1B", sex:"Colt",
      likes:"Calumet's iconic devil's-red silks add genuine history to the race. Doug O'Neill is a two-time Derby winner.",
      concerns:"Got into the field only because two other horses dropped out at the last minute. His résumé doesn't suggest he's competitive with the favorites.",
      funFact:"Calumet Farm's last Derby win was Forward Pass in 1968 — a 58-year wait that the farm is still trying to end." }
  ];

  const horseByPost = new Map(horses.map(h => [h.post, h]));

  // -------------------------------------------------------------------------
  // Country / flag helpers — extracts "(Country)" prefix from extra strings
  // and produces a Unicode regional-indicator flag emoji.
  // -------------------------------------------------------------------------
  const COUNTRY_TO_CODE = {
    "Puerto Rico": "PR",
    "USA": "US",
    "Mexico": "MX",
    "Venezuela": "VE",
    "Panama": "PA",
    "Japan": "JP",
    "France": "FR",
    "France/USA": "FR",
    "UAE": "AE",
    "UAE-based": "AE",
    "United Kingdom": "GB",
    "USA/Canada": "US",
    "Venezuela/USA": "VE"
  };

  function flagEmoji(code) {
    if (!code) return "";
    return code.toUpperCase().replace(/./g, ch =>
      String.fromCodePoint(127397 + ch.charCodeAt(0))
    );
  }

  // Pulls "(Country)" from the start of an extra string, returns flag + remaining note.
  function parseExtra(extra) {
    if (!extra) return { flag: "", note: "" };
    const m = extra.match(/^\s*\(([^)]+)\)\s*(?:—\s*)?(.*)$/);
    if (!m) return { flag: "", note: extra };
    const country = m[1].trim();
    const rest = m[2].trim();
    const code = COUNTRY_TO_CODE[country];
    return {
      flag: code ? flagEmoji(code) : "",
      note: rest
    };
  }

  // For the owner field: split on " — " (name | note), then find the first
  // country name we recognize anywhere in the name half for a flag.
  const COUNTRIES_BY_LEN = Object.keys(COUNTRY_TO_CODE).sort((a, b) => b.length - a.length);
  const COUNTRY_PATTERN = COUNTRIES_BY_LEN
    .map(c => c.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&"))
    .join("|");

  // Strip "(Country)" and ", Country)" mentions — the flag already shows it.
  function stripCountries(text) {
    if (!text) return text;
    let s = text;
    s = s.replace(new RegExp(`,\\s*(?:${COUNTRY_PATTERN})\\)`, "g"), ")");
    s = s.replace(new RegExp(`\\s*\\((?:${COUNTRY_PATTERN})\\)`, "g"), "");
    return s.replace(/\s{2,}/g, " ").trim();
  }

  function parseOwner(owner) {
    if (!owner) return { flag: "", name: "—", note: "" };
    const dashMatch = owner.match(/^(.+?)\s+—\s+(.+)$/);
    let name = dashMatch ? dashMatch[1].trim() : owner.trim();
    const note = dashMatch ? dashMatch[2].trim() : "";
    let flag = "";
    for (const c of COUNTRIES_BY_LEN) {
      if (name.includes(c)) { flag = flagEmoji(COUNTRY_TO_CODE[c]); break; }
    }
    name = stripCountries(name);
    return { flag, name, note };
  }

  // -------------------------------------------------------------------------
  // Field rendering
  // -------------------------------------------------------------------------
  function renderField() {
    const grid = document.getElementById("horse-grid");
    if (!grid) return;

    // Display order: shortest morning-line odds first (favorite on top).
    // Stable sort preserves post-position order on ties.
    const ordered = horses.slice().sort((a, b) => a.num - b.num);

    const cards = ordered.map(h => {
      const j = parseExtra(h.jockeyExtra);
      const t = parseExtra(h.trainerExtra);
      const jFlag = j.flag ? `<span class="flag" aria-hidden="true">${j.flag}</span> ` : "";
      const tFlag = t.flag ? `<span class="flag" aria-hidden="true">${t.flag}</span> ` : "";
      const o = parseOwner(h.owner);
      const oFlag = o.flag ? `<span class="flag" aria-hidden="true">${o.flag}</span> ` : "";
      const personRow = (label, flag, name, note) => `
        <div class="hd-row">
          <div class="hd-line"><span class="hd-label">${label}</span> ${flag}${escapeHtml(name)}</div>
          ${note ? `<div class="hd-note">${escapeHtml(note)}</div>` : ""}
        </div>`;
      return `
      <article class="horse-card" data-post="${h.post}">
        <div class="horse-name-col">
          <h3 class="horse-name">${escapeHtml(h.name)}</h3>
          <div class="horse-meta-row">
            <span class="horse-post-pill">#${h.post}</span>
            <span class="horse-silks" style="--silks-a:${h.silksA};--silks-b:${h.silksB}" aria-hidden="true"></span>
            <button type="button" class="bio-toggle" data-bio-toggle aria-expanded="false">Bio</button>
          </div>
        </div>
        <div class="odds-col odds-ml" title="Morning-line odds">
          <span class="odds-value">${h.odds}</span>
          <span class="odds-label">M/L</span>
        </div>
        <div class="odds-col odds-live" data-live-odds title="Live pari-mutuel odds">
          <span class="odds-value live-value">—</span>
          <span class="odds-label">Live</span>
        </div>
        <button type="button" class="add-to-slip" data-add-slip aria-label="Add ${escapeHtml(h.name)} to slip">Add to slip</button>
        <div class="horse-details" aria-hidden="true">
          ${personRow("Jockey",  jFlag, h.jockey  || "—", j.note)}
          ${personRow("Trainer", tFlag, h.trainer || "—", t.note)}
          ${personRow("Owner",   oFlag, o.name,           o.note)}
          ${h.likes ? `
          <div class="hd-section hd-likes">
            <span class="hd-section-label">What experts like</span>
            <p>${escapeHtml(h.likes)}</p>
          </div>` : ""}
          ${h.concerns ? `
          <div class="hd-section hd-concerns">
            <span class="hd-section-label">What experts are concerned about</span>
            <p>${escapeHtml(h.concerns)}</p>
          </div>` : ""}
          ${h.funFact ? `
          <p class="hd-funfact">${escapeHtml(h.funFact)}</p>` : ""}
        </div>
      </article>
    `;
    }).join("");
    grid.innerHTML = cards;

    grid.querySelectorAll(".horse-card").forEach(card => {
      const post = parseInt(card.dataset.post, 10);
      const bioBtn = card.querySelector("[data-bio-toggle]");
      if (bioBtn) {
        bioBtn.addEventListener("click", () => {
          const open = card.classList.toggle("is-bio-open");
          bioBtn.setAttribute("aria-expanded", String(open));
          const det = card.querySelector(".horse-details");
          if (det) det.setAttribute("aria-hidden", String(!open));
        });
      }
      const addBtn = card.querySelector("[data-add-slip]");
      if (addBtn) {
        addBtn.addEventListener("click", () => toggleSlipPick(post));
      }
    });

    // Reflect any slip state that already exists (e.g., when reopening the page)
    refreshAddButtons();
  }

  // -------------------------------------------------------------------------
  // Live pari-mutuel odds
  //   odds = (totalPool / amountOnHorse) - 1, expressed as "N/1"
  // Reflects how the public is betting — popular horses pay less, longshots
  // pay more. Recomputed every time a bet is added.
  // -------------------------------------------------------------------------
  function formatLiveOdds(odds) {
    if (odds == null || !isFinite(odds)) return "—";
    if (odds >= 99) return "99+/1";
    if (odds >= 0.95 && odds <= 1.05) return "Even";
    if (odds >= 10) return Math.round(odds) + "/1";
    // < 10: one decimal, strip trailing .0
    const str = (Math.round(odds * 10) / 10).toString().replace(/\.0$/, "");
    return str + "/1";
  }

  function updateLiveOdds() {
    const bets = loadBets();
    const totalPool = bets.reduce((s, b) => s + b.amount, 0);
    const onHorse = new Map();
    bets.forEach(b => onHorse.set(b.post, (onHorse.get(b.post) || 0) + b.amount));

    document.querySelectorAll(".horse-card").forEach(card => {
      const post = parseInt(card.dataset.post, 10);
      const valueEl = card.querySelector("[data-live-odds] .live-value");
      const liveEl  = card.querySelector("[data-live-odds]");
      if (!valueEl || !liveEl) return;

      const amt = onHorse.get(post) || 0;
      let label = "—";
      let state = "open";

      if (totalPool > 0 && amt > 0) {
        const oddsNum = totalPool / amt - 1;
        label = formatLiveOdds(oddsNum);
        state = oddsNum < 1 ? "favored" : (oddsNum > 20 ? "longshot" : "active");
      }
      valueEl.textContent = label;
      liveEl.dataset.state = state;
    });
  }

  // -------------------------------------------------------------------------
  // Bet preview
  // -------------------------------------------------------------------------
  function fmtUSD(n) {
    if (!isFinite(n)) return "—";
    return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  }

  // Project payout for a hypothetical $bet on a horse, given:
  //   - assumedPool: total pool size
  //   - the horse's morning-line implied share of that pool
  // This mirrors how pari-mutuel payouts shake out: longer odds → smaller
  // bet share on that horse → bigger payout if it hits.
  function projectShare(horseNum, bet, totalPool) {
    // Implied probability from morning line: 1 / (n + 1)
    const implied = 1 / (horseNum + 1);
    // Estimate of how much of the pool is on this horse, in dollars,
    // before our bet. Floor at $5 so longshots aren't comically large.
    const otherOnHorse = Math.max(5, Math.round(totalPool * implied * 0.85));
    const totalOnHorse = otherOnHorse + bet;
    const myShareOfHorse = bet / totalOnHorse;
    const newPool = totalPool + bet;

    return {
      win:   myShareOfHorse * (newPool * 0.6),
      place: myShareOfHorse * (newPool * 0.3),
      show:  myShareOfHorse * (newPool * 0.1)
    };
  }

  // -------------------------------------------------------------------------
  // Bets — synced across everyone via Supabase, kept in an in-memory cache
  // so the rest of the code can keep reading them synchronously.
  // -------------------------------------------------------------------------
  let supabase = null;
  let betsCache = [];

  function initSupabase() {
    if (supabase || !window.supabase) return;
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  function rowToBet(row) {
    return {
      id: row.id,
      bettor: row.bettor,
      post: row.post,
      amount: row.amount,
      at: new Date(row.created_at).getTime()
    };
  }

  function addBetToCache(row) {
    const bet = rowToBet(row);
    if (betsCache.some(b => b.id === bet.id)) return false;
    betsCache.push(bet);
    return true;
  }

  async function fetchAllBets() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("bets")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Failed to fetch bets:", error);
      return;
    }
    betsCache = data.map(rowToBet);
  }

  function subscribeToBets() {
    if (!supabase) return;
    supabase
      .channel("bets-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bets" },
        payload => {
          if (addBetToCache(payload.new)) {
            renderLedgerAndStats();
            updateLiveOdds();
            renderSlip();
          }
        }
      )
      .subscribe();
  }

  function loadBets() {
    return betsCache.slice();
  }

  function renderLedgerAndStats() {
    const bets = loadBets();

    // Stats
    const pot = bets.reduce((s, b) => s + b.amount, 0);
    const bettors = new Set(bets.map(b => b.bettor.trim().toLowerCase())).size;
    const horseTotals = new Map();
    bets.forEach(b => horseTotals.set(b.post, (horseTotals.get(b.post) || 0) + b.amount));
    let topPost = null, topAmt = -1;
    for (const [post, amt] of horseTotals) {
      if (amt > topAmt) { topAmt = amt; topPost = post; }
    }

    setStat("pot", fmtUSD(pot));
    setStat("bets", bets.length.toString());
    setStat("bettors", bettors.toString());
    setStat("favorite", topPost ? `#${topPost}` : "—");

    renderBoard(bets, pot, topPost);

    // Ledger
    const list = document.getElementById("ledger");
    const empty = document.getElementById("ledger-empty");
    if (!list || !empty) return;

    if (bets.length === 0) {
      list.hidden = true;
      list.innerHTML = "";
      empty.hidden = false;
      updateLiveOdds();
      return;
    }

    empty.hidden = true;
    list.hidden = false;

    list.innerHTML = bets.slice().reverse().map(b => {
      const horse = horseByPost.get(b.post);
      return `
        <li>
          <span class="lh-post">${b.post}</span>
          <span class="lh-name">${horse ? horse.name : ('Post #' + b.post)}</span>
          <span class="lh-amount">${fmtUSD(b.amount)}</span>
          <span class="lh-bettor">${escapeHtml(b.bettor)} · ${new Date(b.at).toLocaleString()}</span>
        </li>
      `;
    }).join("");

    updateLiveOdds();
  }

  // -------------------------------------------------------------------------
  // Live Betting Board — bar chart of where money is sitting per horse.
  // -------------------------------------------------------------------------
  function renderBoard(bets, pot, topPost) {
    const list = document.getElementById("board-bars");
    const empty = document.getElementById("board-empty");
    if (!list || !empty) return;

    if (!bets || bets.length === 0 || pot <= 0) {
      list.innerHTML = "";
      list.hidden = true;
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    list.hidden = false;

    // Aggregate per horse: total stake + per-bettor stake
    const byPost = new Map();
    bets.forEach(b => {
      if (!byPost.has(b.post)) byPost.set(b.post, { post: b.post, total: 0, bettors: new Map() });
      const e = byPost.get(b.post);
      e.total += b.amount;
      e.bettors.set(b.bettor, (e.bettors.get(b.bettor) || 0) + b.amount);
    });
    const rows = Array.from(byPost.values()).sort((a, b) => b.total - a.total);
    const maxAmt = rows[0].total || 1;

    list.innerHTML = rows.map(r => {
      const horse = horseByPost.get(r.post);
      if (!horse) return "";
      const pct = (r.total / pot) * 100;
      const fillWidth = (r.total / maxAmt) * 100;
      const liveOddsLabel = formatLiveOdds(pot / r.total - 1);
      const isFav = r.post === topPost;
      const bettorChips = Array.from(r.bettors.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, amt]) => `<span class="bettor-chip">${escapeHtml(name)} · ${fmtUSD(amt)}</span>`)
        .join("");
      const bettorCount = r.bettors.size;
      const peopleLabel = bettorCount === 1 ? "Who has placed bets (1)" : `Who has placed bets (${bettorCount})`;
      return `
        <li class="board-bar${isFav ? " is-favored" : ""}">
          <div class="board-bar-row1">
            <span class="post">#${horse.post}</span>
            <span class="silks" style="--silks-a:${horse.silksA};--silks-b:${horse.silksB}" aria-hidden="true"></span>
            <span class="name">${escapeHtml(horse.name)}</span>
            <span class="total">${fmtUSD(r.total)}</span>
            <span class="live-odds">${liveOddsLabel}</span>
          </div>
          <div class="board-bar-track" aria-hidden="true">
            <div class="board-bar-fill" style="width:${fillWidth}%"></div>
          </div>
          <div class="board-bar-meta">
            <span class="board-bar-pct">${pct.toFixed(0)}% of the pot</span>
            <details class="board-bar-people">
              <summary>${peopleLabel}</summary>
              <div class="board-bar-bettors">${bettorChips}</div>
            </details>
          </div>
        </li>
      `;
    }).join("");
  }

  function setStat(key, value) {
    const el = document.querySelector(`[data-stat="${key}"]`);
    if (el) el.textContent = value;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // -------------------------------------------------------------------------
  // Form submission — writes the bet to Supabase; realtime fans it out to
  // every other open browser.
  // -------------------------------------------------------------------------
  function buildMultiSlipText(bettor, picks) {
    const lines = [
      "— Family Derby Pool · Bet Slip —",
      "",
      "Bettor: " + (bettor || "(your name)"),
      "",
    ];
    picks.forEach(p => {
      const h = horseByPost.get(p.post);
      if (!h) return;
      lines.push("Horse: #" + p.post + " " + h.name + " (" + h.odds + ")");
      lines.push("Stake: " + fmtUSD(p.amount));
      lines.push("");
    });
    const total = picks.reduce((s, p) => s + (p.amount || 0), 0);
    lines.push("Total stake: " + fmtUSD(total));
    lines.push("");
    lines.push("Good luck.");
    return lines.join("\n");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const bettorEl = document.getElementById("bettor");
    const bettor = bettorEl ? bettorEl.value.trim() : "";

    if (slipPicks.length === 0) return toast("Add at least one horse to your slip.", true);
    if (!slipPicks.every(p => p.amount > 0)) {
      setSlipExpanded(true);
      return toast("Set a stake on every pick.", true);
    }
    if (!bettor) {
      setSlipExpanded(true);
      if (bettorEl) bettorEl.focus();
      return toast("Add your name first.", true);
    }
    if (!supabase) return toast("Can't reach the pool — check your connection and try again.", true);

    const placeBtn = document.getElementById("place-bets");
    const originalLabel = placeBtn ? placeBtn.textContent : "";
    if (placeBtn) { placeBtn.disabled = true; placeBtn.textContent = "Saving…"; }

    const rows = slipPicks.map(p => ({ bettor, post: p.post, amount: p.amount }));
    const { data, error } = await supabase
      .from("bets")
      .insert(rows)
      .select();

    if (placeBtn) { placeBtn.textContent = originalLabel; }

    if (error) {
      console.error("Insert failed:", error);
      if (placeBtn) placeBtn.disabled = false;
      return toast("Couldn't save your bets — try again.", true);
    }

    let added = 0;
    (data || []).forEach(row => { if (addBetToCache(row)) added++; });
    if (added > 0) {
      renderLedgerAndStats();
      updateLiveOdds();
    }

    const count = rows.length;
    slipPicks = [];
    refreshAddButtons();
    renderSlip();

    toast(count === 1 ? "Bet locked in." : `${count} bets locked in.`);
  }

  function handleCopySlip() {
    const bettor = document.getElementById("bettor").value.trim();
    if (slipPicks.length === 0) return toast("Add a horse to your slip first.", true);

    const text = buildMultiSlipText(bettor, slipPicks);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => toast("Bet slip copied to clipboard."),
        () => fallbackCopy(text)
      );
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); toast("Bet slip copied."); }
    catch (e) { toast("Couldn't copy — select and copy manually.", true); }
    finally { document.body.removeChild(ta); }
  }

  // -------------------------------------------------------------------------
  // Toast
  // -------------------------------------------------------------------------
  let toastTimer = null;
  function toast(msg, isError) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("error", !!isError);
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  }

  // -------------------------------------------------------------------------
  // Countdown
  // -------------------------------------------------------------------------
  function tickCountdown() {
    const target = new Date(POST_TIME_ISO).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    setUnit("days", days);
    setUnit("hours", hours);
    setUnit("minutes", minutes);
    setUnit("seconds", seconds);
  }
  function setUnit(unit, value) {
    const el = document.querySelector(`[data-unit="${unit}"]`);
    if (el) el.textContent = String(value).padStart(2, "0");
  }

  // -------------------------------------------------------------------------
  // Bet slip (sticky bottom, multi-pick cart)
  //   - "Add to slip" on a horse card pushes a pick into slipPicks
  //   - Each pick gets its own stake input
  //   - Place Bets submits all picks at once via Supabase batch insert
  // -------------------------------------------------------------------------
  const DEFAULT_STAKE = 20;
  let slipPicks = []; // [{ post, amount }]

  function findPick(post) {
    return slipPicks.find(p => p.post === post);
  }

  function setSlipExpanded(open) {
    const slip = document.getElementById("bet-slip");
    const toggle = document.getElementById("slip-toggle");
    if (!slip || !toggle) return;
    slip.dataset.expanded = String(open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  function setupBetSlip() {
    const slip = document.getElementById("bet-slip");
    const toggle = document.getElementById("slip-toggle");
    if (slip && toggle) {
      toggle.addEventListener("click", () => {
        setSlipExpanded(slip.dataset.expanded !== "true");
      });
    }
  }

  // Project a single pick's win share. When `othersInSlip` is provided, each
  // of those stakes is also assumed to be added to the pool — that gives a
  // more realistic projection when the slip has multiple picks.
  function projectedWin(post, amount, othersInSlip = []) {
    const horse = horseByPost.get(post);
    if (!horse || !amount || amount <= 0) return null;
    const bets = loadBets();
    const slipExtra = othersInSlip
      .filter(p => p.post !== post && p.amount > 0)
      .reduce((s, p) => s + p.amount, 0);
    const currentPool = bets.reduce((s, b) => s + b.amount, 0) + slipExtra;
    const onHorseBefore = bets
      .filter(b => b.post === post)
      .reduce((s, b) => s + b.amount, 0);
    if (currentPool > 0) {
      const newPool = currentPool + amount;
      const newOnHorse = onHorseBefore + amount;
      return (amount / newOnHorse) * newPool * 0.6;
    }
    const pool = Math.max(ASSUMED_POOL, amount * 4);
    return projectShare(horse.num, amount, pool).win;
  }

  function toggleSlipPick(post) {
    const horse = horseByPost.get(post);
    if (!horse) return;
    const idx = slipPicks.findIndex(p => p.post === post);
    if (idx >= 0) {
      slipPicks.splice(idx, 1);
      toast(`${horse.name} removed from slip.`);
    } else {
      slipPicks.push({ post, amount: DEFAULT_STAKE });
      toast(`${horse.name} added to slip.`);
    }
    refreshAddButtons();
    renderSlip();
  }

  function refreshAddButtons() {
    document.querySelectorAll(".horse-card").forEach(card => {
      const post = parseInt(card.dataset.post, 10);
      const inSlip = !!findPick(post);
      card.classList.toggle("is-in-slip", inSlip);
      const btn = card.querySelector("[data-add-slip]");
      if (btn) {
        btn.dataset.inSlip = String(inSlip);
        btn.textContent = inSlip ? "✓ Added" : "Add to slip";
      }
    });
  }

  function renderSlip() {
    const slip = document.getElementById("bet-slip");
    if (!slip) return;

    const pill = document.getElementById("slip-pill");
    const line1 = document.getElementById("slip-line1");
    const list = document.getElementById("slip-items");
    const placeBtn = document.getElementById("place-bets");

    if (slipPicks.length === 0) {
      slip.dataset.state = "empty";
      if (pill) pill.textContent = "+";
      if (line1) line1.textContent = "Bet Slip";
      if (list) list.innerHTML = "";
      if (placeBtn) placeBtn.disabled = true;
      const empty = document.getElementById("slip-empty");
      if (empty) empty.hidden = false;
      return;
    }

    slip.dataset.state = "filled";

    if (pill) pill.textContent = String(slipPicks.length);
    if (line1) {
      line1.textContent = slipPicks.length === 1 ? "1 pick" : `${slipPicks.length} picks`;
    }

    const empty = document.getElementById("slip-empty");
    if (empty) empty.hidden = true;

    if (list) {
      list.innerHTML = slipPicks.map(p => {
        const h = horseByPost.get(p.post);
        const win = projectedWin(p.post, p.amount, slipPicks);
        const winLine = (p.amount > 0 && win != null)
          ? `If 1st: <strong>${fmtUSD(win)}</strong> <span class="muted">(net ${fmtUSD(win - p.amount)})</span>`
          : `Set a stake to see projected win`;
        return `
          <li class="slip-item" data-post="${p.post}">
            <span class="slip-item-silks" style="--silks-a:${h.silksA};--silks-b:${h.silksB}" aria-hidden="true"></span>
            <div class="slip-item-meta">
              <span class="slip-item-name">#${h.post} ${escapeHtml(h.name)} <span class="muted small">${h.odds}</span></span>
              <span class="slip-item-projection muted small">${winLine}</span>
            </div>
            <span class="money-input slip-item-stake">
              <span class="money-mark">$</span>
              <input type="number" inputmode="numeric" min="1" step="1" value="${p.amount > 0 ? p.amount : ''}" placeholder="0" data-stake-input data-post="${p.post}" aria-label="Stake for ${escapeHtml(h.name)}" />
            </span>
            <button type="button" class="slip-item-remove" data-remove-pick="${p.post}" aria-label="Remove ${escapeHtml(h.name)} from slip">×</button>
          </li>
        `;
      }).join("");

      list.querySelectorAll("[data-stake-input]").forEach(input => {
        input.addEventListener("input", () => {
          const post = parseInt(input.dataset.post, 10);
          const pick = findPick(post);
          if (!pick) return;
          const v = parseInt(input.value, 10);
          pick.amount = isFinite(v) && v > 0 ? v : 0;
          renderSlip();
        });
      });
      list.querySelectorAll("[data-remove-pick]").forEach(btn => {
        btn.addEventListener("click", () => {
          const post = parseInt(btn.dataset.removePick, 10);
          toggleSlipPick(post);
        });
      });
    }

    if (placeBtn) {
      const ready = slipPicks.length > 0 && slipPicks.every(p => p.amount > 0);
      placeBtn.disabled = !ready;
    }
  }

  // -------------------------------------------------------------------------
  // Mobile nav — hamburger toggles the dropdown; tapping outside closes it.
  // -------------------------------------------------------------------------
  function setupNavToggle() {
    const btn = document.getElementById("nav-toggle");
    const nav = document.getElementById("primary-nav");
    if (!btn || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(!nav.classList.contains("is-open"));
    });

    // Close when tapping outside the nav
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || btn.contains(e.target)) return;
      setOpen(false);
    });

    // Close when escape is pressed
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        btn.focus();
      }
    });
  }

  // -------------------------------------------------------------------------
  // Boot — each page picks up only the wiring it needs
  // -------------------------------------------------------------------------
  function on(id, evt, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(evt, fn);
  }

  document.addEventListener("DOMContentLoaded", async function () {
    setupNavToggle();        // mobile hamburger menu
    setupBetSlip();          // sticky bottom slip toggle (no-op if not on field)
    renderField();           // no-ops if no #horse-grid (e.g. pool/index)
    renderSlip();            // initial empty slip state
    tickCountdown();         // no-ops if no [data-unit]
    setInterval(tickCountdown, 1000);

    on("bet-form", "submit", handleSubmit);
    on("copy-slip", "click", handleCopySlip);

    // Cloud-sync the bets only on pages that actually display them
    const page = document.body.dataset.page;
    if (page === "field" || page === "pool") {
      initSupabase();
      await fetchAllBets();
      renderLedgerAndStats();
      updateLiveOdds();
      renderSlip();
      subscribeToBets();
    }
  });
})();
