import { SoilMoistureSensor } from '../../types';
import { mockSensors } from '../../mock/mockData';

export class SoilMoistureService {
  private static sensors: SoilMoistureSensor[] = [...mockSensors];

  public static getSensors(): SoilMoistureSensor[] {
    return this.sensors;
  }

  public static getSensorById(id: string): SoilMoistureSensor | undefined {
    return this.sensors.find((s) => s.id === id);
  }

  public static getStats() {
    const total = this.sensors.length;
    const online = this.sensors.filter((s) => s.status === 'ONLINE').length;
    const offline = this.sensors.filter((s) => s.status === 'OFFLINE').length;
    const critical = this.sensors.filter((s) => s.status === 'CRITICAL').length;
    return { total, online, offline, critical };
  }

  public static simulateSaturation(): void {
    // In heavy rainfall simulation, Shillong sensor jumps from 60% to 82%
    const shillongSensor = this.sensors.find((s) => s.id === 'SM-1042');
    if (shillongSensor) {
      shillongSensor.soilMoisture = 82;
      shillongSensor.status = 'CRITICAL';
      shillongSensor.lastCommunication = 'Just now';
    }
  }

  public static resetSensors(): void {
    this.sensors = [...mockSensors];
    const shillongSensor = this.sensors.find((s) => s.id === 'SM-1042');
    if (shillongSensor) {
      shillongSensor.soilMoisture = 60;
      shillongSensor.status = 'ONLINE';
    }
  }
}
