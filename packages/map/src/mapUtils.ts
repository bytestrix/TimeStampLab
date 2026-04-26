/**
 * Pure geometry utilities for the world map
 * No external dependencies
 */

// Equirectangular projection: lng/lat → SVG x/y
// Map dimensions: 800 x 400
const MAP_W = 800;
const MAP_H = 400;

export function project(lng: number, lat: number): [number, number] {
  const x = (lng + 180) * (MAP_W / 360);
  const y = (90 - lat) * (MAP_H / 180);
  return [x, y];
}

export function unproject(x: number, y: number): [number, number] {
  const lng = (x / MAP_W) * 360 - 180;
  const lat = 90 - (y / MAP_H) * 180;
  return [lng, lat];
}

// Convert GeoJSON coordinates to SVG path string
export function coordsToPath(coords: number[][][]): string {
  return coords.map(ring =>
    ring.map(([lng, lat], i) => {
      const [x, y] = project(lng, lat);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ') + ' Z'
  ).join(' ');
}

// Point-in-polygon using ray casting algorithm
function pointInRing(px: number, py: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Check if lng/lat point is inside a GeoJSON geometry
export function pointInGeometry(
  lng: number,
  lat: number,
  geometry: { type: string; coordinates: number[][][] | number[][][][] }
): boolean {
  if (geometry.type === 'Polygon') {
    const rings = geometry.coordinates as number[][][];
    // Must be inside outer ring and outside all holes
    if (!pointInRing(lng, lat, rings[0])) return false;
    for (let i = 1; i < rings.length; i++) {
      if (pointInRing(lng, lat, rings[i])) return false;
    }
    return true;
  }

  if (geometry.type === 'MultiPolygon') {
    const polys = geometry.coordinates as number[][][][];
    for (const poly of polys) {
      if (!pointInRing(lng, lat, poly[0])) continue;
      let inHole = false;
      for (let i = 1; i < poly.length; i++) {
        if (pointInRing(lng, lat, poly[i])) { inHole = true; break; }
      }
      if (!inHole) return true;
    }
    return false;
  }

  return false;
}

// Get bounding box of a geometry for fast pre-filtering
export function getBBox(geometry: { type: string; coordinates: number[][][] | number[][][][] }): [number, number, number, number] {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;

  const processRing = (ring: number[][]) => {
    for (const [lng, lat] of ring) {
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    }
  };

  if (geometry.type === 'Polygon') {
    (geometry.coordinates as number[][][]).forEach(processRing);
  } else {
    (geometry.coordinates as number[][][][]).forEach(poly => poly.forEach(processRing));
  }

  return [minLng, minLat, maxLng, maxLat];
}
