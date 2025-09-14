import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Roles } from 'src/lib/roles.decorator';
import { Role } from 'src/lib/role.enum';
import { AuthGuard } from 'src/lib/guards/auth.guard';
import { RoleGuard } from 'src/lib/guards/role.guard';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.Admin)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) { }

  @ApiOperation({
    summary: 'Admin-only endpoint',
    description: 'Accessible only by users with the `admin` role.',
  })
  @Get('tasks')
  @ApiOkResponse({ description: 'get tasks analytics' })
  getTaskAnalytics() {
    return this.analyticsService.getTaskAnalytics();
  }

  @ApiOperation({
    summary: 'Admin-only endpoint',
    description: 'Accessible only by users with the `admin` role.',
  })
  @Get('users')
  @ApiOkResponse({ description: 'get users analytics ' })
  getUserAnalytics() {
    return this.analyticsService.getUserAnalytics();
  }
}
