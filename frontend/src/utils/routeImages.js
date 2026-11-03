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

  const targetStr =
    typeof cityOrRoute === "object"
      ? `${cityOrRoute.distance_city || ""} ${cityOrRoute.route_name || ""} ${cityOrRoute.source_city || ""}`
      : String(cityOrRoute);

  const key = targetStr.trim().toLowerCase();

  if (/saw|seth|sanw/i.test(key)) return DESTINATION_IMAGES.saweriya;
  if (/salasar/i.test(key)) return DESTINATION_IMAGES.salasar;
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
  if (/jaipur/i.test(key)) return DESTINATION_IMAGES.jaipur;

  return DEFAULT_FALLBACK_IMAGE;
};
