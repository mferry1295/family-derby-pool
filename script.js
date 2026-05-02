/* The Family Derby Pool — interactivity
   - Renders the field
   - Bet calculator + form submission (mailto + clipboard fallback)
   - localStorage ledger of the bettor's own slips
   - Countdown to post time
*/
(function () {
  "use strict";

  // -------------------------------------------------------------------------
  // Config
  // -------------------------------------------------------------------------
  const HOST_EMAIL = "mferry1295@gmail.com";
  const POST_TIME_ISO = "2026-05-02T18:57:00-04:00"; // 6:57 PM ET, Sat May 2, 2026
  const STORAGE_KEY = "familyDerbyPool.bets.v1";

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
      likes:"He just won the Arkansas Derby and the Sam F. Davis before that, and he closed his last race faster than any other Derby horse. His bloodlines (his dad is the legendary stallion Into Mischief, and his mother's family is full of horses that did well at long distances) make him the field's best-bred horse for the 1¼-mile distance.",
      concerns:"He drew the rail — gate 1 — which is the worst spot in the race. No horse has won from there since 1986. Also, favorites have lost the Derby every year since 2018.",
      funFact:"He was bought as a yearling for $975,000. He's also a half-brother (same mom) to fellow Derby starter Commandment." },

    { post:2, name:"Albus", odds:"30-1", num:30,
      jockey:"Manny Franco",
      jockeyExtra:" (Puerto Rico)",
      trainer:"Riley Mott",
      trainerExtra:" (USA) — son of Hall of Famer Bill Mott, who's also in this race with a different horse",
      owner:"Pin Oak Stud (USA) — a Kentucky-based breeding operation",
      silksA:"#FAF6F0", silksB:"#5C1A1B", sex:"Colt",
      likes:"He won the Blue Grass Stakes at Keeneland in his last start, which is one of the most respected Derby tune-up races. His mother's bloodline includes a champion mare named Malathaat.",
      concerns:"His dad (Yaupon) is a young stallion better known for producing sprinters, and Albus's running style and speed numbers are a notch below the top contenders.",
      funFact:"Riley Mott has two horses in this race against his Hall of Fame father — a real-life family rivalry on the biggest stage in the sport." },

    { post:3, name:"Intrepido", odds:"50-1", num:50,
      jockey:"Hector Berrios",
      jockeyExtra:" (Venezuela)",
      trainer:"Jeff Mullins",
      trainerExtra:" (USA) — California-based, has had Derby starters before but no winner",
      owner:"Sierra Fria Farm (USA)",
      silksA:"#1d4ed8", silksB:"#FAF6F0", sex:"Colt",
      likes:"His grandfather is Into Mischief, the most successful Derby sire of the past decade, so the bloodlines have a touch of magic.",
      concerns:"He's never beaten this caliber of horses. He squeaked into the field on points and most handicappers are tossing him.",
      funFact:"He's one of four horses in the race that trace back to Into Mischief — that single stallion has now sired or grandsired four of the last six Derby winners." },

    { post:4, name:"Litmus Test", odds:"30-1", num:30,
      jockey:"Martin Garcia",
      jockeyExtra:" (Mexico) — longtime Bob Baffert rider",
      trainer:"Bob Baffert",
      trainerExtra:" (USA) — six-time Derby winner, tied for the all-time record; a win today would break it",
      owner:"Pam & Martin Wygod (USA) — California-based; Martin is a healthcare entrepreneur",
      silksA:"#eab308", silksB:"#1A1A1A", sex:"Colt",
      likes:"He won an important race called the Los Alamitos Futurity as a 2-year-old, and Baffert has a knack for getting horses to peak on Derby Day.",
      concerns:"He hasn't been the same horse this year — he ran a troubled seventh in the Arkansas Derby last out. His dad (Nyquist, the 2016 Derby winner) tends to produce horses better at shorter distances.",
      funFact:"He sold for $875,000 as a yearling, and Baffert's team is adding blinkers (eye covers that help horses focus straight ahead) for the first time today." },

    { post:5, name:"Great White", odds:"50-1", num:50,
      jockey:"Alex Achard",
      jockeyExtra:" (France/USA) — French-born apprentice rider based in the U.S.",
      trainer:"John Ennis",
      trainerExtra:" (USA)",
      owner:"Three Chimneys Farm (Goncalo Torrealba, Venezuela/USA) and John Ennis (USA) — Three Chimneys is one of the most prestigious Kentucky breeding farms",
      silksA:"#22c55e", silksB:"#FAF6F0", sex:"Colt",
      likes:"He won the John Battaglia Memorial at Turfway Park in Kentucky in his run-up to the Derby.",
      concerns:"His Battaglia win came on a synthetic track, and when he tried real dirt in the Blue Grass Stakes he ran a flat fifth. Switching surfaces for the biggest race of his life is a real worry.",
      funFact:"His dad (Volatile) was a brilliant sprinter — which means his bloodlines aren't bred for the Derby trip the way most of the other contenders are." },

    { post:6, name:"Commandment", odds:"6-1", num:6,
      jockey:"Luis Saez",
      jockeyExtra:" (Panama) — best Derby finish was third with Essential Quality in 2021",
      trainer:"Brad Cox",
      trainerExtra:" (USA) — Louisville native who won the 2021 Derby (via disqualification) with Mandaloun, who is Commandment's half-brother",
      owner:"Spendthrift Farm (Eric Gustavson, USA) — major Kentucky breeding farm",
      silksA:"#1A1A1A", silksB:"#C9A961", sex:"Colt", tag:"Tied for second favorite",
      likes:"He's won four races in a row, including the Florida Derby and the Fountain of Youth. He showed real grit in Florida, coming from dead last to win by a nose.",
      concerns:"His speed numbers are middle-of-the-pack — at least eight other horses in the race have gone equally fast or faster. And Cox's last 10 Derby starters have averaged a 10th-place finish.",
      funFact:"He's a half-brother to favorite Renegade and to Mandaloun (Cox's only Derby winner). His mother's father, Orb, won the 2013 Derby — so his bloodlines come pre-stamped for Churchill Downs." },

    { post:7, name:"Danon Bourbon", odds:"20-1", num:20,
      jockey:"Atsuya Nishimura",
      jockeyExtra:" (Japan) — this is his first race ever on American soil",
      trainer:"Manabu Ikezoe",
      trainerExtra:" (Japan)",
      owner:"Danox Co. Ltd. (Japan)",
      silksA:"#fb923c", silksB:"#FAF6F0", sex:"Colt",
      likes:"He's undefeated in three starts in Japan and won his last race impressively. He was actually born in Kentucky before being shipped to Japan, so the bloodlines are familiar to American breeders.",
      concerns:"No Japanese-based horse has ever won the Kentucky Derby, despite seven previous tries. Shipping a horse across the Pacific and getting him to peak on a strange track is a massive ask.",
      funFact:"This is one of two Japan-trained horses in the race, plus a third (Six Speed) shipping in from Dubai — making for an unusually international field." },

    { post:8, name:"So Happy", odds:"15-1", num:15,
      jockey:"Mike Smith",
      jockeyExtra:" (USA) — at 60 years old, he's the oldest rider in the race; he won the 2018 Derby with Triple Crown winner Justify and rode 2005 winner Giacomo",
      trainer:"Mark Glatt",
      trainerExtra:" (USA) — California-based",
      owner:"Norman Stables (USA) and Saints or Sinners (USA)",
      silksA:"#ec4899", silksB:"#FAF6F0", sex:"Colt",
      likes:"He drew off to win the Santa Anita Derby — California's biggest Derby prep — by nearly three lengths. Mike Smith on the back of any live longshot is always dangerous.",
      concerns:"His dad (Runhappy) was a champion sprinter whose offspring are usually best at much shorter distances. Pedigree experts say the 1¼ miles will likely be too far for him.",
      funFact:"A win would make Mike Smith, at 60, the oldest jockey ever to win the Derby, breaking Bill Shoemaker's record (54)." },

    { post:9, name:"The Puma", odds:"10-1", num:10,
      jockey:"Javier Castellano",
      jockeyExtra:" (Venezuela) — won the 2023 Derby with longshot Mage; this is his 18th Derby ride",
      trainer:"Gustavo Delgado",
      trainerExtra:" (Venezuela) — also won the 2023 Derby with Mage",
      owner:"OGMA Investments (USA), JR Ranch (USA), and High Step Racing (USA)",
      silksA:"#0d9488", silksB:"#FAF6F0", sex:"Colt",
      likes:"He won the Tampa Bay Derby and only lost the Florida Derby by a nose to Commandment. The Castellano-Delgado team has already won this race together.",
      concerns:"Closely tied to Commandment in his prep races and never quite beat him. His mother's side of the family doesn't scream “long-distance horse.”",
      funFact:"His dad (Essential Quality) was the favorite for the 2021 Derby and lost — so The Puma is essentially trying to redeem his father's biggest career disappointment." },

    { post:10, name:"Wonder Dean", odds:"30-1", num:30,
      jockey:"Ryusei Sakai",
      jockeyExtra:" (Japan) — one of Japan's top riders; finished third in the 2024 Derby with Forever Young and has won the Saudi Cup twice",
      trainer:"Daisuke Takayanagi",
      trainerExtra:" (Japan)",
      owner:"Yoshinari Yamamoto (Japan)",
      silksA:"#7c3aed", silksB:"#C9A961", sex:"Colt",
      likes:"He won the UAE Derby in Dubai in his last race, beating fellow Derby starter Six Speed. Sakai is genuinely world-class.",
      concerns:"Two devastating historical trends apply here — since 2000, 21 horses have used the UAE Derby as a Kentucky Derby prep and zero have won the Run for the Roses. He's also Japan-bred, another 0-for category.",
      funFact:"Sakai's third-place finish with Forever Young in 2024 was actually called for the win at one point, then bumped to third after a steward's review found his horse had bothered other runners." },

    { post:11, name:"Incredibolt", odds:"20-1", num:20,
      jockey:"Jaime Torres",
      jockeyExtra:" (Puerto Rico) — won the 2024 Preakness Stakes with Seize the Grey; this is his Derby debut",
      trainer:"Riley Mott",
      trainerExtra:" (USA) — same trainer as Albus",
      owner:"Pin Oak Stud (USA)",
      silksA:"#f87171", silksB:"#FAF6F0", sex:"Colt",
      likes:"He won the Street Sense Stakes at Churchill Downs last fall, so he already knows the track. His dad (Bolt d'Oro) is a respected stallion.",
      concerns:"His form against top horses is uneven, and stepping up to face the Derby field is a much taller order.",
      funFact:"Riley Mott's two Pin Oak horses (Incredibolt and Albus) are both essentially auditioning for the family stable while his father Bill Mott's horse runs against them — a fascinating father-son dynamic." },

    { post:12, name:"Chief Wallabee", odds:"8-1", num:8,
      jockey:"Junior Alvarado",
      jockeyExtra:" (Venezuela) — won last year's Derby with Sovereignty, his first ever",
      trainer:"Bill Mott",
      trainerExtra:" (USA) — Hall of Famer, won last year's Derby with Sovereignty and also won in 2019 with Country House",
      owner:"Mike & Katherine Ball (USA)",
      silksA:"#84cc16", silksB:"#1A1A1A", sex:"Colt",
      likes:"He's got the same trainer-jockey team that won the Derby AND the Belmont Stakes last year. He's been a consistent runner-up in big Florida races.",
      concerns:"He hasn't actually won a major race yet — he's been runner-up multiple times to Commandment specifically.",
      funFact:"Alvarado was fined $62,000 for whipping his horse too many times during last year's Derby win — appealed and got it reduced to $31,000." },

    { post:13, name:"Ocelli", odds:"50-1", num:50,
      jockey:"Joe Ramos",
      jockeyExtra:" (USA)",
      trainer:"D. Whitworth Beckman",
      trainerExtra:" (USA) — based in Kentucky",
      owner:"Ashley Durr (USA), Anthony Tate (USA), and Front Page Equestrian (USA)",
      silksA:"#a16207", silksB:"#FAF6F0", sex:"Colt",
      likes:"He finished a respectable third in the Blue Grass Stakes, beaten by horses also in this Derby field. He gets in via the also-eligible list, which means he's getting a chance bigger names didn't.",
      concerns:"He's never won a major stakes race, and the Derby is a giant leap.",
      funFact:"His ownership group is one of the smaller, more grassroots partnerships in this race — a David-and-Goliath story against the mega-stables." },

    { post:14, name:"Potente", odds:"20-1", num:20,
      jockey:"Juan Hernandez",
      jockeyExtra:" (Mexico)",
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
      likes:"He won the Louisiana Derby easily in just his second-ever race. His bloodlines are absolutely tailor-made for long distances. He's the lone horse in the field NOT descended from the legendary Secretariat — making him the field's most distinctive bloodline story.",
      concerns:"Two career races is extremely light for a Derby horse. Surviving a 20-horse traffic scramble with that little experience is a real concern.",
      funFact:"His dad (Candy Ride) was 23 years old when Emerging Market was conceived — practically a senior citizen by stallion standards." },

    { post:16, name:"Pavlovian", odds:"30-1", num:30,
      jockey:"Edwin Maldonado",
      jockeyExtra:" (Mexico)",
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
      trainerExtra:" (UAE-based)",
      owner:"A partnership including Brunetti Dugan Stables (USA), Black Type Thoroughbreds (USA), Steve Adkisson (USA), and Swinbank Stables (United Kingdom)",
      silksA:"#fbcfe8", silksB:"#B8232A", sex:"Colt",
      likes:"His dad (Not This Time) is one of the hottest young stallions in racing. He'll likely set the early pace, which sometimes works at the Derby. Hernandez has the Derby trophy on his recent résumé.",
      concerns:"He's been racing in Dubai, and shippers from there have a poor track record at the Derby. His mother was a sprinter, and aggressive front-running tactics in a 20-horse field often get caught late.",
      funFact:"This is the first horse from trainer Bhupat Seemar's Dubai stable to start in the Kentucky Derby — a milestone for Middle Eastern racing." },

    { post:18, name:"Further Ado", odds:"6-1", num:6,
      jockey:"John Velazquez",
      jockeyExtra:" (Puerto Rico) — the winningest active Derby jockey with three wins (Animal Kingdom 2011, Always Dreaming 2017, Authentic 2020)",
      trainer:"Brad Cox",
      trainerExtra:" (USA) — second horse for Cox in this race",
      owner:"Spendthrift Farm (USA)",
      silksA:"#15803d", silksB:"#FAF6F0", sex:"Colt", tag:"Tied for second favorite",
      likes:"He won the Blue Grass Stakes at Keeneland in his last start. His dad (Gun Runner) is the gold standard for stallions producing horses that excel at long distances — including last year's Derby winner Sovereignty's runner-up. So the breeding is excellent for the trip.",
      concerns:"No Blue Grass Stakes winner has actually gone on to win the Derby since 1991 — a 35-year drought.",
      funFact:"His breeder (Debby Oxley) also bred 2024 Derby third-place finisher Sierra Leone, suggesting her breeding program is on a serious heater." },

    { post:19, name:"Golden Tempo", odds:"30-1", num:30,
      jockey:"Jose Ortiz",
      jockeyExtra:" (Puerto Rico) — younger brother of favorite Renegade's jockey Irad Ortiz Jr.",
      trainer:"Cherie DeVaux",
      trainerExtra:" (USA) — one of a small but growing number of top female trainers",
      owner:"Phipps Stable (Daisy Phipps Pulito, USA) and St. Elias Stable (Vincent Viola, USA) — Viola owns the NHL's Florida Panthers",
      silksA:"#9f1239", silksB:"#FAF6F0", sex:"Colt",
      likes:"He won the Lecomte Stakes with a powerful late charge from far back. His dad is Curlin, one of the most respected stallions for stamina-heavy distances.",
      concerns:"No son of Curlin has ever won the Kentucky Derby, despite Curlin himself being one of the best racehorses of the past 25 years. He also only finished third in the Louisiana Derby.",
      funFact:"It's a true sibling rivalry — the Ortiz brothers are the most successful jockey siblings in racing history, and they're going head-to-head for the Derby trophy today." },

    { post:20, name:"Robusta", odds:"50-1", num:50,
      jockey:"Emisael Jaramillo",
      jockeyExtra:" (Venezuela) — primarily based in Florida",
      trainer:"Doug O'Neill",
      trainerExtra:" (USA) — second horse for O'Neill in this race",
      owner:"Calumet Farm (USA) — the most historic owner in American racing, with nine Derby wins, the all-time record",
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
    const select = document.getElementById("horse-select");
    if (!grid || !select) return;

    // Display order: shortest morning-line odds first (favorite on top).
    // Stable sort preserves post-position order on ties (e.g., the two 7/1s).
    const ordered = horses.slice().sort((a, b) => a.num - b.num);

    const cards = ordered.map(h => {
      const j = parseExtra(h.jockeyExtra);
      const t = parseExtra(h.trainerExtra);
      const jFlag = j.flag ? `<span class="flag" aria-hidden="true">${j.flag}</span> ` : "";
      const tFlag = t.flag ? `<span class="flag" aria-hidden="true">${t.flag}</span> ` : "";
      return `
      <article class="horse-card" data-post="${h.post}">
        <span class="horse-post">${h.post}</span>
        <span class="horse-silks" style="--silks-a:${h.silksA};--silks-b:${h.silksB}"></span>
        <h3 class="horse-name">${h.name}</h3>
        <div class="odds-col odds-ml" title="Morning-line odds">
          <span class="odds-value">${h.odds}</span>
          <span class="odds-label">M/L</span>
        </div>
        <div class="odds-col odds-live" data-live-odds title="Live pari-mutuel odds">
          <span class="odds-value live-value">—</span>
          <span class="odds-label">Live</span>
        </div>
        ${(() => {
          const o = parseOwner(h.owner);
          const oFlag = o.flag ? `<span class="flag" aria-hidden="true">${o.flag}</span> ` : "";
          const personRow = (label, flag, name, note) => `
            <div class="hd-row">
              <div class="hd-line"><span class="hd-label">${label}</span> ${flag}${escapeHtml(name)}</div>
              ${note ? `<div class="hd-note">${escapeHtml(note)}</div>` : ""}
            </div>`;
          return `
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
        </div>`;
        })()}
      </article>
    `;
    }).join("");
    grid.innerHTML = cards;

    const opts = ordered.map(h =>
      `<option value="${h.post}">#${h.post} · ${h.name} (${h.odds})</option>`
    ).join("");
    // Keep the placeholder option, append horses after it
    select.insertAdjacentHTML("beforeend", opts);

    // Tap-to-pick: clicking any card preselects that horse in the form.
    grid.querySelectorAll(".horse-card").forEach(card => {
      const post = parseInt(card.dataset.post, 10);
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", "Pick post " + post + " for your bet");
      card.addEventListener("click", () => pickHorse(post));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          pickHorse(post);
        }
      });
    });
  }

  // Select a horse in the form, scroll back up, focus the next blank field.
  function pickHorse(post) {
    const sel = document.getElementById("horse-select");
    if (!sel) return;
    sel.value = String(post);
    sel.dispatchEvent(new Event("change"));

    const horse = horseByPost.get(post);
    if (horse) toast(horse.name + " selected — fill in your stake.");

    const formSec = document.getElementById("bet");
    if (formSec) formSec.scrollIntoView({ behavior: "smooth", block: "start" });

    // After the scroll settles, focus the first empty field.
    const bettor = document.getElementById("bettor");
    const amount = document.getElementById("amount");
    setTimeout(() => {
      const target = (bettor && !bettor.value.trim())
        ? bettor
        : (amount && !amount.value ? amount : null);
      if (target) target.focus({ preventScroll: true });
    }, 400);

    // Highlight is now handled by updateBio() via the change event.
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

  // Highlight the chosen card so the bio details expand under it.
  function updateBio(horse) {
    document.querySelectorAll(".horse-card.is-picked").forEach(c => {
      c.classList.remove("is-picked");
      const d = c.querySelector(".horse-details");
      if (d) d.setAttribute("aria-hidden", "true");
    });
    if (!horse) return;
    const card = document.querySelector('.horse-card[data-post="' + horse.post + '"]');
    if (!card) return;
    card.classList.add("is-picked");
    const d = card.querySelector(".horse-details");
    if (d) d.setAttribute("aria-hidden", "false");
  }

  function updatePreview() {
    const post = parseInt(document.getElementById("horse-select").value, 10);
    const amount = parseInt(document.getElementById("amount").value, 10);
    const preview = document.getElementById("bet-preview");
    if (!preview) return;

    const horse = horseByPost.get(post);
    updateBio(horse);

    if (!horse || !amount || amount <= 0) {
      preview.innerHTML = `<p class="preview-headline">${horse ? "Add a stake to see your projected payout." : "Pick a horse and stake to see your projected payout."}</p>`;
      return;
    }

    // Use the actual pool when there's any money in it; otherwise project
    // against an assumed pool so the preview still makes sense from $0.
    const bets = loadBets();
    const currentPool = bets.reduce((s, b) => s + b.amount, 0);
    const onHorseBefore = bets
      .filter(b => b.post === post)
      .reduce((s, b) => s + b.amount, 0);

    let win, place, show, headline;

    if (currentPool > 0) {
      const newPool = currentPool + amount;
      const newOnHorse = onHorseBefore + amount;
      const myShare = amount / newOnHorse;
      win   = myShare * newPool * 0.6;
      place = myShare * newPool * 0.3;
      show  = myShare * newPool * 0.1;
      headline = `If <em>${horse.name}</em> finishes — <span class="muted small">live ${fmtUSD(newPool)} pool</span>`;
    } else {
      const pool = Math.max(ASSUMED_POOL, amount * 4);
      const r = projectShare(horse.num, amount, pool);
      win = r.win; place = r.place; show = r.show;
      headline = `If <em>${horse.name}</em> finishes — <span class="muted small">projected against a ${fmtUSD(pool)} pool</span>`;
    }

    preview.innerHTML = `
      <p class="preview-headline">${headline}</p>
      <div class="preview-grid">
        <div class="preview-cell win">
          <span class="pc-label">1st (60%)</span>
          <span class="pc-value">${fmtUSD(win)}</span>
          <span class="pc-detail">net ${fmtUSD(win - amount)}</span>
        </div>
        <div class="preview-cell place">
          <span class="pc-label">2nd (30%)</span>
          <span class="pc-value">${fmtUSD(place)}</span>
          <span class="pc-detail">net ${fmtUSD(place - amount)}</span>
        </div>
        <div class="preview-cell show">
          <span class="pc-label">3rd (10%)</span>
          <span class="pc-value">${fmtUSD(show)}</span>
          <span class="pc-detail">net ${fmtUSD(show - amount)}</span>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // Ledger (localStorage)
  // -------------------------------------------------------------------------
  function loadBets() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function saveBets(bets) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(bets)); }
    catch (e) { /* private mode etc — silently no-op */ }
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

    // Ledger
    const list = document.getElementById("ledger");
    const empty = document.getElementById("ledger-empty");
    const clearBtn = document.getElementById("clear-ledger");
    if (!list || !empty || !clearBtn) return;

    if (bets.length === 0) {
      list.hidden = true;
      list.innerHTML = "";
      empty.hidden = false;
      clearBtn.hidden = true;
      updateLiveOdds();
      return;
    }

    empty.hidden = true;
    list.hidden = false;
    clearBtn.hidden = false;

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
  // Form submission — composes a bet slip and opens mailto:
  // -------------------------------------------------------------------------
  function buildSlipText(bet, horse) {
    return [
      "— Family Derby Pool · Bet Slip —",
      "",
      "Bettor: " + bet.bettor,
      "Horse: #" + bet.post + " " + horse.name + " (" + horse.odds + ")",
      "Stake: " + fmtUSD(bet.amount),
      "Submitted: " + new Date(bet.at).toLocaleString(),
      "",
      "Reply to confirm and settle up. Good luck."
    ].join("\n");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const bettor = document.getElementById("bettor").value.trim();
    const post = parseInt(document.getElementById("horse-select").value, 10);
    const amount = parseInt(document.getElementById("amount").value, 10);

    if (!bettor) return toast("Add your name first.", true);
    if (!horseByPost.has(post)) return toast("Pick a horse.", true);
    if (!amount || amount <= 0) return toast("Set a stake of at least $1.", true);

    const horse = horseByPost.get(post);
    const bet = { bettor, post, amount, at: Date.now() };

    const bets = loadBets();
    bets.push(bet);
    saveBets(bets);
    renderLedgerAndStats();  // refreshes pool.html stats + ledger if present
    updateLiveOdds();        // refreshes field.html live odds if present
    updatePreview();         // re-projects the preview against the new pool

    const slip = buildSlipText(bet, horse);
    const subject = "Derby Pool: " + bettor + " on #" + post + " " + horse.name;
    const mailto =
      "mailto:" + encodeURIComponent(HOST_EMAIL) +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(slip);

    window.location.href = mailto;
    toast("Bet saved. Email opened — send it to lock in your slip.");
  }

  function handleCopySlip() {
    const bettor = document.getElementById("bettor").value.trim() || "(your name)";
    const post = parseInt(document.getElementById("horse-select").value, 10);
    const amount = parseInt(document.getElementById("amount").value, 10);
    const horse = horseByPost.get(post);
    if (!horse || !amount) return toast("Fill in the form first.", true);

    const slip = buildSlipText({ bettor, post, amount, at: Date.now() }, horse);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(slip).then(
        () => toast("Bet slip copied to clipboard."),
        () => fallbackCopy(slip)
      );
    } else {
      fallbackCopy(slip);
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

  function handleClear() {
    if (!confirm("Clear all your saved bet slips on this device? (This won't affect anything the host has on file.)")) return;
    saveBets([]);
    renderLedgerAndStats();
    updateLiveOdds();
    updatePreview();
    toast("Slips cleared.");
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
  // Boot — each page picks up only the wiring it needs
  // -------------------------------------------------------------------------
  function on(id, evt, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(evt, fn);
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderField();           // no-ops if no #horse-grid (e.g. pool/index)
    updateLiveOdds();        // no-ops if no .horse-card on the page
    renderLedgerAndStats();  // no-ops if no #ledger (e.g. index/field)
    tickCountdown();         // no-ops if no [data-unit]
    setInterval(tickCountdown, 1000);

    on("horse-select", "change", updatePreview);
    on("amount", "input", updatePreview);
    on("bet-form", "submit", handleSubmit);
    on("copy-slip", "click", handleCopySlip);
    on("clear-ledger", "click", handleClear);
  });
})();
