/**
 * Verified Authentic Destination Landmarks
 * Bundled locally for instant loading and 100% exact landmark matching:
 * - Saweriya Seth: Mandphiya Temple (Chittorgarh)
 * - Salasar: Salasar Balaji Dham
 * - Jaipur: Hawa Mahal
 * - Delhi: India Gate
 * - Udaipur: Lake Pichola & City Palace
 * - Ajmer: Ajmer Sharif Dargah
 * - Bikaner: Junagarh Fort
 * - Dehradun: Doon Valley & Mussoorie Foothills
 * - Goa: Calangute Beach & Palms
 * - Mumbai: Gateway of India
 * - Pune: Shaniwar Wada
 * - Surat: Surat Skyline & Tapi Riverfront
 * - Ahmedabad: Sabarmati Riverfront
 * - Bangalore: Vidhana Soudha
 * - Bhopal: Upper Lake (Bhojtal)
 */

import saweriyaImg from "../assets/destinations/saweriya.jpg";
import salasarImg from "../assets/destinations/salasar.jpg";
import jaipurImg from "../assets/destinations/jaipur.jpg";
import delhiImg from "../assets/destinations/delhi.jpg";
import udaipurImg from "../assets/destinations/udaipur.jpg";
import ajmerImg from "../assets/destinations/ajmer.jpg";
import bikanerImg from "../assets/destinations/bikaner.jpg";
import dehradunImg from "../assets/destinations/dehradun.jpg";
import goaImg from "../assets/destinations/goa.jpg";
import mumbaiImg from "../assets/destinations/mumbai.jpg";
import puneImg from "../assets/destinations/pune.jpg";
import suratImg from "../assets/destinations/surat.jpg";
import ahmedabadImg from "../assets/destinations/ahmedabad.jpg";
import bangaloreImg from "../assets/destinations/bangalore.jpg";
import bhopalImg from "../assets/destinations/bhopal.jpg";

export const DESTINATION_IMAGES = {
  saweriya: saweriyaImg,
  salasar: salasarImg,
  jaipur: jaipurImg,
  delhi: delhiImg,
  udaipur: udaipurImg,
  ajmer: ajmerImg,
  bikaner: bikanerImg,
  dehradun: dehradunImg,
  goa: goaImg,
  mumbai: mumbaiImg,
  pune: puneImg,
  surat: suratImg,
  ahmedabad: ahmedabadImg,
  bangalore: bangaloreImg,
  bhopal: bhopalImg,
};

export const DEFAULT_FALLBACK_IMAGE = jaipurImg;

export const getRouteImage = (cityOrRoute) => {
  if (!cityOrRoute) return DEFAULT_FALLBACK_IMAGE;

  // Always determine key strictly based on the DESTINATION (distance_city)
  let key = "";
  if (typeof cityOrRoute === "object") {
    // 1. Check distance_city (Destination) FIRST
    key = String(cityOrRoute.distance_city || "").trim().toLowerCase();

    // 2. If distance_city is missing, parse destination from route_name (e.g. "Jaipur-Delhi" -> "delhi")
    if (!key && cityOrRoute.route_name) {
      const parts = cityOrRoute.route_name.split(/[-–—]/);
      if (parts.length > 1) {
        key = parts[1].trim().toLowerCase();
      } else {
        key = cityOrRoute.route_name.trim().toLowerCase();
      }
    }

    // 3. Fallback to source_city only if no destination info exists
    if (!key && cityOrRoute.source_city) {
      key = String(cityOrRoute.source_city).trim().toLowerCase();
    }
  } else {
    key = String(cityOrRoute).trim().toLowerCase();
  }

  // Exact Destination Matching
  if (/saw|seth|sanw/i.test(key)) return DESTINATION_IMAGES.saweriya;
  if (/salasar/i.test(key)) return DESTINATION_IMAGES.salasar;
  if (/jaipur/i.test(key)) return DESTINATION_IMAGES.jaipur;
  if (/delhi/i.test(key)) return DESTINATION_IMAGES.delhi;
  if (/udaipur/i.test(key)) return DESTINATION_IMAGES.udaipur;
  if (/ajmer/i.test(key)) return DESTINATION_IMAGES.ajmer;
  if (/bikaner/i.test(key)) return DESTINATION_IMAGES.bikaner;
  if (/dehradun/i.test(key)) return DESTINATION_IMAGES.dehradun;
  if (/goa/i.test(key)) return DESTINATION_IMAGES.goa;
  if (/mumbai|bombay/i.test(key)) return DESTINATION_IMAGES.mumbai;
  if (/pune/i.test(key)) return DESTINATION_IMAGES.pune;
  if (/surat/i.test(key)) return DESTINATION_IMAGES.surat;
  if (/ahmedabad/i.test(key)) return DESTINATION_IMAGES.ahmedabad;
  if (/bangalore|bengaluru/i.test(key)) return DESTINATION_IMAGES.bangalore;
  if (/bhopal/i.test(key)) return DESTINATION_IMAGES.bhopal;

  return DEFAULT_FALLBACK_IMAGE;
};
