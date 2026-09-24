import { ResponseTeam, ResponseAssignment, AssignmentStatus } from '../../types';
import { mockResponseTeams, mockResponseAssignments } from '../../mock/mockData';

export class ResponseTeamService {
  private static teams: ResponseTeam[] = [...mockResponseTeams];
  private static assignments: ResponseAssignment[] = [...mockResponseAssignments];

  public static getTeams(): ResponseTeam[] {
    return this.teams;
  }

  public static getAssignments(): ResponseAssignment[] {
    return this.assignments;
  }

  public static assignTeam(params: {
    incidentId: string;
    incidentTitle: string;
    teamId: string;
    priorityScore: number;
    priorityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    location: string;
  }): ResponseAssignment {
    const team = this.teams.find((t) => t.id === params.teamId);
    const assignment: ResponseAssignment = {
      id: `assign-${Date.now()}`,
      incidentId: params.incidentId,
      incidentTitle: params.incidentTitle,
      teamId: params.teamId,
      teamName: team ? team.name : 'Emergency Unit',
      priorityScore: params.priorityScore,
      priorityLevel: params.priorityLevel,
      status: 'ASSIGNED',
      assignedAt: 'Just now',
      updatedAt: 'Just now',
      location: params.location,
      actionTaken: `Dispatched ${team?.agency || 'Unit'} to site.`,
    };

    this.assignments.unshift(assignment);
    return assignment;
  }

  public static updateAssignmentStatus(
    id: string,
    status: AssignmentStatus,
    actionNote?: string
  ): ResponseAssignment | null {
    const target = this.assignments.find((a) => a.id === id);
    if (target) {
      target.status = status;
      target.updatedAt = 'Just now';
      if (actionNote) target.actionTaken = actionNote;
      return target;
    }
    return null;
  }
}
