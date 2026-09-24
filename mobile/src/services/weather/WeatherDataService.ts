import { WeatherData } from '../../types';
import { DatabaseManager } from '../../database/sqlite';
import { mockWeatherData } from '../../mock/mockData';

export class WeatherDataService {
  private static liveOverride: WeatherData | null = null;

  public static async getWeatherForLocation(
    lat: number,
    lng: number
  ): Promise<WeatherData> {
    if (this.liveOverride) {
      return this.liveOverride;
    }
    return await DatabaseManager.getCachedWeather();
  }

  public static async simulateHeavyRainfall(): Promise<WeatherData> {
    const current = await this.getWeatherForLocation(25.5788, 91.8933);
    const simulated: WeatherData = {
      ...current,
      rainfall24h: 220, // Jump from 120 to 220 mm
      rainfall72h: 310,
      rainfallCurrent: 38.5,
      condition: 'Extreme Monsoon Downpour (IMD Red Alert)',
      timestamp: new Date().toISOString(),
      isDemo: true,
    };
    this.liveOverride = simulated;
    await DatabaseManager.saveCachedWeather(simulated);
    return simulated;
  }

  public static async resetWeather(): Promise<WeatherData> {
    this.liveOverride = null;
    await DatabaseManager.saveCachedWeather(mockWeatherData);
    return mockWeatherData;
  }
}
