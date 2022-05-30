import { ServerMessage } from '../../../classes/ServerMessage.class';
import { Controller, Request, Post, Body, UseGuards } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesAdminGuard } from '../../../middlewares/roles.guard';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Post('get-movements-history')
  @UseGuards(AuthGuard(), RolesAdminGuard)
  getMovementsHistory(@Request() req, @Body() body): Promise<ServerMessage> {
      return this.trackerService.getMovementsHistory(req.user.idUser, body);
  }
}