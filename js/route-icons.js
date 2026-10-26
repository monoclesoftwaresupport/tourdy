/* Native line icons, matching the app's existing SVG icon style. */
const ROUTE_GLYPHS = {
  waves: 'M2 7c3-4 5 4 8 0s5 4 8 0 4 0 4 0M2 12c3-4 5 4 8 0s5 4 8 0 4 0 4 0M2 17c3-4 5 4 8 0s5 4 8 0 4 0 4 0',
  island: 'M3 20c4-3 14-3 18 0M12 18V8M12 8c-4-5-8-1-8-1 4-1 6 1 8 1zm0 0c2-6 8-4 8-4-3 0-6 2-8 4zm0 0c-1-6-5-6-5-6',
  sunset: 'M3 17h18M5 21h14M7 17a5 5 0 0 1 10 0M12 3v4M3 10l3 2M21 10l-3 2',
  landmark: 'M3 9h18L12 3 3 9zM5 9v11M10 9v11M14 9v11M19 9v11M3 21h18',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM16 8l-2 6-6 2 2-6 6-2z',
  leaf: 'M20 3C10 2 3 6 4 14c1 8 15 8 16-11zM4 21l11-12M8 17l-1-5M11 14l5 1',
  mountain: 'M2 20 9 5l4 8 3-5 6 12H2zM6 12l3 2 3-3M14 12l3 2',
  aurora: 'M3 17c3-14 6 7 10-7s5 8 8-3M3 21h18M5 3v3M3.5 4.5h3M18 17v3M16.5 18.5h3',
  paw: 'M12 12c-2 0-2 3-4 4s-1 4 1 4l3-1 3 1c2 0 3-3 1-4s-2-4-4-4zM4 8a2 2 0 1 0 0 .1M9 4a2 2 0 1 0 0 .1M15 4a2 2 0 1 0 0 .1M20 8a2 2 0 1 0 0 .1',
  sail: 'M12 3v14M12 3 4 14h8M14 7l6 7h-6M3 18h18l-3 3H6l-3-3z',
  flower: 'M12 8c-5-8-10 1-4 4-8 1-3 9 2 5-1 8 8 5 6-1 7 3 9-6 3-6 4-6-4-10-7-2zM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  snow: 'M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M8 4l4 4 4-4M8 20l4-4 4 4',
  tree: 'M12 2 5 10h4l-5 6h6v5h4v-5h6l-5-6h4L12 2z',
};
const ROUTE_SYMBOLS = { east:'waves',south:'island',west:'sunset',ancient:'landmark',silk:'compass',indochina:'leaf',euro:'landmark',nordic:'aurora',andes:'mountain',safari:'paw',pacific:'sail',sakura:'flower',summersea:'island',maple:'leaf',snowfl:'snow',blossom:'flower',medi:'sail',xmasmkt:'tree' };
function routeIcon(id) {
  const path = ROUTE_GLYPHS[ROUTE_SYMBOLS[id]] || ROUTE_GLYPHS.compass;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
}
