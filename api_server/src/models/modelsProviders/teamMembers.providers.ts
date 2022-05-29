import { TeamMember } from '../teamMembers.entity';

export const teamMembersProviders = [
  {
    provide: 'TeamMemberRepository',
    useValue: TeamMember,
  },
];