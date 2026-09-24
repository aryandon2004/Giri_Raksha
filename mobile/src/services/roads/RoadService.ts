import { Road, RoadStatus } from '../../types';
import { DatabaseManager } from '../../database/sqlite';
import { mockRoads } from '../../mock/mockData';

export class RoadService {
  public static async getRoads(): Promise<Road[]> {
    return await DatabaseManager.getCachedRoads();
  }

  public static async updateRoadStatus(
    id: string,
    status: RoadStatus,
    cause?: string
  ): Promise<Road[]> {
    const roads = await this.getRoads();
    const target = roads.find((r) => r.id === id);
    if (target) {
      target.status = status;
      if (cause) target.cause = cause;
      target.lastUpdated = 'Just now';
      await DatabaseManager.saveCachedRoads(roads);
    }
    return roads;
  }

  public static async simulateRoadBlockage(): Promise<Road[]> {
    return await this.updateRoadStatus(
      'road-nh-6',
      'PARTIALLY BLOCKED',
      'Debris avalanche & active rockfall at Sonapur Tunnel cut'
    );
  }

  public static async resetRoads(): Promise<Road[]> {
    await DatabaseManager.saveCachedRoads(mockRoads);
    return mockRoads;
  }
}
