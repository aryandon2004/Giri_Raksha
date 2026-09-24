export interface TerrainInfo {
  elevationMeters: number;
  slopeDegrees: number;
  aspect: string;
  geology: string;
  ndviVegetationIndex: number;
  landCover: string;
  disclaimer: string;
}

export class TerrainDataService {
  public static getTerrainForCoordinates(lat: number, lng: number): TerrainInfo {
    return {
      elevationMeters: 1520,
      slopeDegrees: 38,
      aspect: 'South-East Facing Escarpment',
      geology: 'Weathered Sandstone & Argillaceous Siltstone (Shillong Group)',
      ndviVegetationIndex: 0.48,
      landCover: 'Mixed Sub-tropical Pine & Degraded Forest',
      disclaimer: 'Satellite-derived terrain layer — prototype data',
    };
  }
}
