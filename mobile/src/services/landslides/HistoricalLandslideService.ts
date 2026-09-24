import { HistoricalLandslide } from '../../types';
import { DatabaseManager } from '../../database/sqlite';

export interface LandslideFilter {
  state?: string;
  district?: string;
  year?: string;
  severity?: string;
}

export class HistoricalLandslideService {
  public static async getLandslides(filter?: LandslideFilter): Promise<HistoricalLandslide[]> {
    const list = await DatabaseManager.getCachedLandslides();
    if (!filter) return list;

    return list.filter((item) => {
      if (filter.state && item.state !== filter.state) return false;
      if (filter.district && item.district !== filter.district) return false;
      if (filter.severity && item.severity !== filter.severity) return false;
      if (filter.year && !item.date.startsWith(filter.year)) return false;
      return true;
    });
  }
}
