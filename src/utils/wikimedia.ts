type WikimediaPage = {
    title?: string;
    thumbnail?: {
        source?: string;
    };
    extract?: string;
};

type WikimediaResponse = {
    query?: {
        pages?: Record<string, WikimediaPage>;
    };
};

export type PlaceImage = { url: string; caption: string };

/** The extract's first sentence, or the page title if there's no extract. */
function captionFor(page: WikimediaPage): string {
    const extract = page.extract?.trim();
    if (extract) {
        // Stop at the first sentence so the caption stays a short, one-line
        // description rather than the whole intro paragraph.
        const firstSentence = extract.match(/^.*?[.!?](?=\s|$)/)?.[0];
        return (firstSentence ?? extract).trim();
    }
    return page.title ?? "";
}

// Being "about the place" (title match) isn't enough on its own — Wikipedia
// also has institutional/administrative pages (hospitals, colleges, schools,
// election constituencies, union councils) that name-match a district but
// whose lead photo is a building, a map, or a government logo, not a travel
// or landmark photo. A page can also be titled just the plain place name
// (e.g. "Patuakhali") while its actual lead photo is one of these — that's
// why this list is checked against both the page title AND the thumbnail's
// own filename, not the title alone.
const NON_SCENIC_TERMS = [
    "college",
    "university",
    "school",
    "institute",
    "academy",
    "polytechnic",
    "seminary",
    "hospital",
    "stadium",
    "airport",
    "upazila",
    "union council",
    "district council",
    "member of parliament",
    "constituency",
    "election",
    "list of",
    "municipal",
    "logo",
    "flag",
    "emblem",
    "coat of arms",
    "seal",
    "crest",
    "referendum",
    "border",
    " map",
    "rice",
    "atlas",
    "flood",
    "geocode",
];
// Bangladeshi parliamentary constituencies are titled "<Place>-1", "<Place>-2", etc.
const CONSTITUENCY_TITLE_PATTERN = /-\d+$/;
// Wikipedia's lead-image thumbnails for a real travel/landmark photo are
// virtually always a raster photo (jpg/png); an SVG thumbnail is reliably a
// logo, emblem, flag, or map rather than a photograph of the place.
const NON_PHOTO_FILE_PATTERN = /\.svg(\?|$)/i;

/** Pulls the Commons filename out of a thumbnail URL, as readable words. */
function extractFileNameTerms(url: string): string {
    try {
        const path = decodeURIComponent(new URL(url).pathname);
        const filename = path.split("/").pop() ?? "";
        return filename.replace(/[_.]/g, " ").toLowerCase();
    } catch {
        return url.toLowerCase();
    }
}

/**
 * Resolves a possibly-misspelled or informally-transliterated place name
 * (e.g. "Potuakhalli") to its canonical English Wikipedia title (e.g.
 * "Patuakhali") using the fuzzy/prefix-matching `opensearch` endpoint.
 * `gsrsearch` (used below for the actual content search) is spelling-
 * sensitive and returns nothing at all for an unrecognized spelling, so
 * resolving the name first is what lets common transliteration variants
 * still find the right article. Returns null if nothing resolves.
 */
async function resolveCanonicalPlaceName(placeName: string): Promise<string | null> {
    try {
        const url = new URL("https://en.wikipedia.org/w/api.php");
        url.search = new URLSearchParams({
            action: "opensearch",
            search: placeName,
            limit: "5",
            namespace: "0",
            format: "json",
        }).toString();

        const response = await fetch(url, {
            headers: {
                "User-Agent": "NasirPortfolioChat/1.0 (portfolio image lookup)",
            },
            signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) {
            return null;
        }

        const data = (await response.json()) as [string, string[], string[], string[]];
        const titles = data[1];
        if (!titles || titles.length === 0) {
            return null;
        }
        // Wikipedia often also has "<Place> District" / "<Place> Upazila" /
        // "<Place>-1" (constituency) pages alongside the plain place article;
        // the shortest candidate is usually that shared core place name.
        return titles.reduce((shortest, title) => (title.length < shortest.length ? title : shortest));
    } catch (error) {
        console.error("Failed to resolve canonical place name from Wikipedia:", error);
        return null;
    }
}

type CommonsPage = {
    title?: string;
    index?: number;
    imageinfo?: {
        thumburl?: string;
        url?: string;
        mime?: string;
        extmetadata?: { ImageDescription?: { value?: string } };
    }[];
};

/** The Commons filename without size prefix: one photo, however it's thumbnailed. */
function fileKey(url: string): string {
    try {
        const name = decodeURIComponent(new URL(url).pathname.split("/").pop() ?? "");
        return name.replace(/^\d+px-/, "").toLowerCase();
    } catch {
        return url;
    }
}

/** Plain one-line text from a Commons description (which may contain HTML). */
function commonsCaption(html: string | undefined, fallback: string): string {
    const text = (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (!text) return fallback;
    const firstSentence = text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;
    return firstSentence.length > 200 ? `${firstSentence.slice(0, 197)}...` : firstSentence;
}

/**
 * Wikipedia's lead images give at most one photo per article, so a place with
 * few articles ends up with one picture. Commons holds the actual photo
 * library: search its files for the place and add real photographs (jpeg
 * only - the rest are maps, scans and diagrams), with their own descriptions.
 */
async function getCommonsPhotos(placeName: string, normalizedName: string, want: number, country?: string): Promise<PlaceImage[]> {
    try {
        const url = new URL("https://commons.wikimedia.org/w/api.php");
        url.search = new URLSearchParams({
            action: "query",
            generator: "search",
            gsrsearch: country ? `${placeName} ${country}` : placeName,
            gsrnamespace: "6",
            gsrlimit: "30",
            prop: "imageinfo",
            iiprop: "url|mime|extmetadata",
            iiurlwidth: "800",
            iiextmetadatafilter: "ImageDescription",
            format: "json",
            origin: "*",
        }).toString();
        const response = await fetch(url, {
            headers: { "User-Agent": "NasirPortfolioChat/1.0 (portfolio image lookup)" },
            signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) return [];
        const data = (await response.json()) as { query?: { pages?: Record<string, CommonsPage> } };
        const pages = Object.values(data.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

        const out: PlaceImage[] = [];
        for (const page of pages) {
            const info = page.imageinfo?.[0];
            const src = info?.thumburl ?? info?.url;
            if (!page.title || !src || info?.mime !== "image/jpeg") continue;
            const name = page.title.replace(/^File:/i, "").replace(/\.[a-z]+$/i, "");
            const lower = name.toLowerCase();
            if (!lower.includes(normalizedName)) continue;
            if (NON_SCENIC_TERMS.some((term) => lower.includes(term))) continue;
            out.push({ url: src, caption: commonsCaption(info.extmetadata?.ImageDescription?.value, name) });
            if (out.length >= want) break;
        }
        return out;
    } catch (error) {
        console.error("Failed to fetch photos from Wikimedia Commons:", error);
        return [];
    }
}

/**
 * Searches Wikipedia and returns matching page thumbnails, each with its own
 * caption (the page's own short description), so a multi-photo reply can
 * describe each picture individually instead of sharing one generic label.
 */
export async function getPlaceImagesFromWikimedia(
    placeName: string,
    limit = 6,
    country?: string,
): Promise<PlaceImage[]> {
    // "Feni District" / "Feni zila" would otherwise need every article title to
    // contain the whole phrase; the core place name is what titles share.
    const trimmedPlaceName = placeName
        .trim()
        .replace(/\s+(district|zila|zilla|jela|upazila|division)$/i, "")
        .trim();
    if (!trimmedPlaceName) {
        return [];
    }

    const resolvedPlaceName = (await resolveCanonicalPlaceName(trimmedPlaceName)) ?? trimmedPlaceName;
    const normalizedPlaceName = resolvedPlaceName.toLowerCase();

    try {
        // Plain place name first so we hit the actual geographic article
        // (e.g. "Patuakhali District") before trying looser phrasings.
        const searchTerms = [
            resolvedPlaceName,
            `${resolvedPlaceName} landmark`,
            `${resolvedPlaceName} tourist attraction`,
        ];

        // Collected across every search term (deduped), rather than
        // stopping at whichever term happens to return something first —
        // a vague term can return institutional noise before a specific one
        // reaches a genuinely scenic photo, so every term gets a chance to
        // contribute before we pick the best `limit` of them.
        const collected = new Map<string, PlaceImage>();

        for (const searchTerm of searchTerms) {
            const searchUrl = new URL("https://en.wikipedia.org/w/api.php");
            searchUrl.search = new URLSearchParams({
                action: "query",
                generator: "search",
                gsrsearch: searchTerm,
                gsrnamespace: "0",
                gsrlimit: String(Math.min(Math.max(limit, 1), 10)),
                prop: "pageimages|extracts",
                pithumbsize: "800",
                exintro: "1",
                explaintext: "1",
                exchars: "300",
                format: "json",
                origin: "*",
            }).toString();

            let response = await fetch(searchUrl, {
                headers: {
                    "User-Agent": "NasirPortfolioChat/1.0 (portfolio image lookup)",
                },
                signal: AbortSignal.timeout(5000),
            });
            if (response.status === 429) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                response = await fetch(searchUrl, {
                    headers: {
                        "User-Agent": "NasirPortfolioChat/1.0 (portfolio image lookup)",
                    },
                    signal: AbortSignal.timeout(5000),
                });
            }

            if (!response.ok) {
                console.error(`Wikimedia API error: ${response.status} ${response.statusText}`);
                continue;
            }

            const data = (await response.json()) as WikimediaResponse;
            const pages = data.query?.pages;
            if (!pages) {
                continue;
            }

            // A full-text search matches any page that merely mentions the
            // search terms somewhere in its content, not pages that are
            // actually about this place — that previously let through
            // completely unrelated (and once, inappropriate) images for
            // places with thin Wikipedia coverage. Only accept a result
            // whose own title names the place we searched for, isn't an
            // administrative/institutional page or constituency, and whose
            // thumbnail is both an actual photo (not a logo/map/emblem) and
            // not itself named after an institution — a page can be titled
            // just the plain place name while its lead photo is of a
            // hospital or college building.
            for (const page of Object.values(pages)) {
                if (!page.title || !page.thumbnail?.source) continue;
                const titleLower = page.title.toLowerCase();
                if (!titleLower.includes(normalizedPlaceName)) continue;
                // Names are shared across countries (Feni the Bangladeshi district vs
                // the Goan spirit), so when the country is known the article must mention it.
                if (country && !(page.extract ?? "").toLowerCase().includes(country.toLowerCase())) continue;
                if (CONSTITUENCY_TITLE_PATTERN.test(page.title)) continue;
                if (NON_PHOTO_FILE_PATTERN.test(page.thumbnail.source)) continue;
                const combinedTerms = `${titleLower} ${extractFileNameTerms(page.thumbnail.source)}`;
                if (NON_SCENIC_TERMS.some((term) => combinedTerms.includes(term))) continue;
                if (!collected.has(fileKey(page.thumbnail.source))) {
                    collected.set(fileKey(page.thumbnail.source), { url: page.thumbnail.source, caption: captionFor(page) });
                }
            }

            if (collected.size >= limit) {
                break;
            }
        }

        const fromWikipedia = [...collected.values()].slice(0, limit);
        if (fromWikipedia.length >= limit) return fromWikipedia;

        const seen = new Set(fromWikipedia.map((image) => fileKey(image.url)));
        const extra = await getCommonsPhotos(resolvedPlaceName, normalizedPlaceName, limit - fromWikipedia.length, country);
        return [...fromWikipedia, ...extra.filter((image) => !seen.has(fileKey(image.url)))].slice(0, limit);
    } catch (error) {
        console.error("Failed to fetch image from Wikimedia:", error);
        return [];
    }
}

/**
 * Backwards-compatible single-image lookup.
 */
export async function getPlaceImageFromWikimedia(
    placeName: string,
): Promise<PlaceImage | null> {
    const [image] = await getPlaceImagesFromWikimedia(placeName, 1);
    return image ?? null;
}
