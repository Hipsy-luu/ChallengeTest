import { Test, TestingModule } from '@nestjs/testing';
import { ServerMessage } from '../../../classes/ServerMessage.class';
import { DatabaseModule } from '../../../database/database.module';
import { accountsProviders } from '../../../models/modelsProviders/accounts.providers';
import { teamMembersProviders } from '../../../models/modelsProviders/teamMembers.providers';
import { userProviders } from '../../../models/modelsProviders/user.providers';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { User } from '../../../models/user.entity';
import { TrackerService } from './tracker.service';

describe('TrackerService', () => {
  let trackerService: TrackerService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        WinstonModule.forRoot({
          transports: [
            new winston.transports.Console(),
            // logger for console errors
            new winston.transports.File({
              dirname: __dirname + '/../../../../log/',
              filename: 'error.log',
              level: 'error',
            }),
          ],
        }),
      ],
      exports: [],
      controllers: [],
      providers: [
        TrackerService , 
        ...userProviders,
        ...accountsProviders,
        ...teamMembersProviders,
      ],
    }).compile();

    trackerService = moduleFixture.get<TrackerService>(TrackerService);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(trackerService).toBeDefined();
    });

    it('should get all the movements of the actual mont', async () => {
      let newDate = new Date();
      let fromDate = new Date(newDate.getFullYear(), newDate.getMonth() , 1);
      let toDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0,23,59);
  
      let maxDate = new Date();
      maxDate.setFullYear(toDate.getFullYear() + 10);

      let response : ServerMessage = await trackerService.getMovementsHistory({
        fromDate: fromDate,
        toDate: toDate,
        isCreatedAt: true,
        search: "",
      });

      expect(response.message).toBe("Obtained history view data");
    });
  });
});
