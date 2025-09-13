import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Roles } from 'src/lib/roles.decorator';
import { Role } from 'src/lib/role.enum';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RoleGuard } from 'src/lib/guards/role.guard';

@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.Admin)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('tasks')
  getTaskAnalytics() {
    return this.analyticsService.getTaskAnalytics();
  }

  @Get('users')
  getUserAnalytics() {
    return this.analyticsService.getUserAnalytics();
  }
}
