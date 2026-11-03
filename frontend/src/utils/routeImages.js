/**
 * Curated high-resolution verified destination & route images
 * All images verified HTTP 200 image/jpeg
 */

export const DESTINATION_IMAGES = {
  saweriya:
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80",
  jaipur:
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80",
  delhi:
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80",
  udaipur:
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80",
  ajmer:
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=900&q=80",
  bikaner:
    "https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=900&q=80",
  salasar:
    "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=900&q=80",
  dehradun:
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80",
  goa:
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
  mumbai:
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80",
  pune:
    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=900&q=80",
  surat:
    "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=900&q=80",
  ahmedabad:
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=80",
  bangalore:
    "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=900&q=80",
  bhopal:
    "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=900&q=80",
};

export const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80";

export const getRouteImage = (cityOrRoute) => {
  if (!cityOrRoute) return DEFAULT_FALLBACK_IMAGE;

  // If it's a route object
  const targetStr = typeof cityOrRoute === "object"
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
