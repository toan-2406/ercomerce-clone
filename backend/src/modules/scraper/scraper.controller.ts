import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';

@Controller('scraper')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }

  @Get('crawl')
  @Roles(UserRole.ADMIN)
  async crawl(@Query('limit') limit: string, @Query('url') url?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 5;
    const targetUrl = url || 'https://cellphones.com.vn/mobile.html';
    return await this.scraperService.scrapeProducts(targetUrl, limitNum);
  }

  @Get('categories')
  @Roles(UserRole.ADMIN)
  async getCategories() {
    return await this.scraperService.scrapeCategories();
  }
}
