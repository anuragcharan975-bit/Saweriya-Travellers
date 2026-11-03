/**
 * Fuzzy Search & Spell Tolerance Utility for DriveBus / Saweriya Travellers
 * Handles typos (e.g. jaipurn -> jaipur, sawriya -> Saweriya Seth),
 * phonetic variations, prefixes (e.g. 's' -> Saweriya Seth, Surat),
 * and Levenshtein edit distance.
 */

function levenshteinDistance(a, b) {
    if (!a || !b) return (a || b || "").length;
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }
    return dp[m][n];
}

function normalizeCity(str) {
    if (!str) return "";
    let s = String(str).trim().toLowerCase();
    s = s.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

    // Specific well-known aliases and common typos
    if (/^(jaipur|jaipurn|jaipure|jaypur|jaipr|jp)$/i.test(s) || s.startsWith("jaipur")) return "jaipur";
    if (/^(delhi|delhii|dehli|dilli|dl|new delhi)$/i.test(s) || s.startsWith("delhi")) return "delhi";
    if (/^(mumbai|mumbay|bombay|mb)$/i.test(s) || s.startsWith("mumbai")) return "mumbai";
    if (/^(pune|poona)$/i.test(s)) return "pune";
    if (/^(bangalore|bengaluru|banglore|blr)$/i.test(s) || s.startsWith("bangal")) return "bangalore";
    if (/^(ahmedabad|ahmadabad|amdavad|ahmd)$/i.test(s) || s.startsWith("ahmed")) return "ahmedabad";
    if (/^(surat|soorat)$/i.test(s)) return "surat";
    if (/^(goa)$/i.test(s)) return "goa";
    if (/^(udaipur|udaipr|udaipoor)$/i.test(s)) return "udaipur";
    if (/^(bikaner|bikanr|bikanere)$/i.test(s)) return "bikaner";
    if (/^(bhopal|bhopall)$/i.test(s)) return "bhopal";
    if (/^(ajmer|ajmr)$/i.test(s)) return "ajmer";
    if (/^(dehradun|dehradoon|dehradhun)$/i.test(s)) return "dehradun";

    // Saweriya / Sanwariya / Seth variations
    if (/saw|seth|sanw|sawariya|sawriya|saweriya|savriya|sanwaria/i.test(s)) return "saweriya";

    return s;
}

function cityFuzzyMatch(cityInDb, userInput) {
    if (!userInput || !cityInDb) return false;
    const cDb = String(cityInDb).trim().toLowerCase();
    const uIn = String(userInput).trim().toLowerCase();
    const normDb = normalizeCity(cDb);
    const normIn = normalizeCity(uIn);

    if (cDb === uIn) return true;
    if (normDb === normIn && normIn.length > 0) return true;

    // Prefix match (e.g. user typed "s" -> matches "Saweriya Seth", "Surat")
    if (uIn.length === 1) {
        if (cDb.startsWith(uIn)) return true;
        const words = cDb.split(/\s+/);
        if (words.some((w) => w.startsWith(uIn))) return true;
        return false;
    }

    // Substring contains
    if (cDb.includes(uIn) || uIn.includes(cDb)) return true;
    if (normDb.includes(normIn) || normIn.includes(normDb)) return true;

    // Saweriya alias check
    if (normIn === "saweriya" && (/saw|seth|sanw/i.test(cDb) || /saw|seth|sanw/i.test(normDb))) {
        return true;
    }

    // Prefix matching for 2-4 chars
    if (uIn.length >= 2 && cDb.startsWith(uIn)) return true;
    const words = cDb.split(/\s+/);
    if (words.some((w) => uIn.length >= 2 && (w.startsWith(uIn) || uIn.startsWith(w)))) return true;

    // Levenshtein typo tolerance (distance <= 2 for words with len >= 4)
    if (uIn.length >= 4 && cDb.length >= 4) {
        if (levenshteinDistance(uIn, cDb) <= 2) return true;
        if (levenshteinDistance(normIn, normDb) <= 2) return true;
        if (words.some((w) => w.length >= 4 && levenshteinDistance(uIn, w) <= 2)) return true;
    }

    return false;
}

function findMatchingRoutes(allRoutes, rawSrc, rawDst) {
    const srcInput = String(rawSrc || "").trim();
    const dstInput = String(rawDst || "").trim();

    if (!srcInput && !dstInput) return allRoutes;

    if (srcInput && dstInput) {
        // Priority 1: Forward match (Departure matches source, Destination matches distance)
        let forward = allRoutes.filter((r) => {
            const srcOk = cityFuzzyMatch(r.source_city, srcInput);
            const dstOk = cityFuzzyMatch(r.distance_city, dstInput);
            return srcOk && dstOk;
        });

        if (forward.length > 0) return forward;

        // Priority 2: Route name matches both
        let byName = allRoutes.filter((r) => {
            const name = (r.route_name || "").toLowerCase();
            const normSrc = normalizeCity(srcInput);
            const normDst = normalizeCity(dstInput);
            return (
                (name.includes(normSrc) || name.includes(srcInput.toLowerCase())) &&
                (name.includes(normDst) || name.includes(dstInput.toLowerCase()))
            );
        });

        if (byName.length > 0) return byName;

        // Priority 3: Fallback reverse match only if query isn't a single character
        if (dstInput.length > 1) {
            let reverse = allRoutes.filter((r) => {
                const srcOk = cityFuzzyMatch(r.source_city, dstInput);
                const dstOk = cityFuzzyMatch(r.distance_city, srcInput);
                return srcOk && dstOk;
            });
            if (reverse.length > 0) return reverse;
        }

        return [];
    }

    // Only source provided
    if (srcInput) {
        return allRoutes.filter((r) => cityFuzzyMatch(r.source_city, srcInput));
    }

    // Only destination provided
    if (dstInput) {
        return allRoutes.filter((r) => cityFuzzyMatch(r.distance_city, dstInput));
    }

    return [];
}

module.exports = {
    levenshteinDistance,
    normalizeCity,
    cityFuzzyMatch,
    findMatchingRoutes
};
