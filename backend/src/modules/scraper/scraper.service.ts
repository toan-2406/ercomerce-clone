import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as puppeteer from 'puppeteer';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import {
  Category,
  CategoryDocument,
} from '../categories/schemas/category.schema';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) { }

  async scrapeCategories() {
    this.logger.log('Starting category scrape');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      );
      await page.goto('https://cellphones.com.vn/', {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      const categories = await page.evaluate(() => {
        const container = document.querySelector('.shadow-bottom-50.flex.w-56');
        if (!container) return [];

        const items = Array.from(container.children);
        const results: any[] = [];

        items.forEach((item) => {
          const icon = item.querySelector('img')?.getAttribute('src') || '';
          const links = Array.from(item.querySelectorAll('a'));

          links.forEach((link) => {
            const name = link.textContent?.trim()?.replace(/,$/, '') || '';
            let url = link.getAttribute('href') || '';

            if (!name || !url || url === '#' || url === '/') return;

            if (!url.startsWith('http')) {
              url =
                'https://cellphones.com.vn' +
                (url.startsWith('/') ? '' : '/') +
                url;
            }

            const slug = url.split('/').pop()?.replace('.html', '') || '';

            if (slug) {
              results.push({ name, url, icon, slug });
            }
          });
        });
        return results;
      });

      this.logger.log(`Found ${categories.length} categories`);

      for (const cat of categories) {
        await this.categoryModel.updateOne(
          { slug: cat.slug },
          { $set: cat },
          { upsert: true },
        );
      }

      return categories;
    } catch (error) {
      this.logger.error('Error scraping categories:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapeProducts(
    categoryUrl: string = 'https://cellphones.com.vn/mobile.html',
    limit: number = 5,
  ) {
    this.logger.log(`Starting scrape for: ${categoryUrl}`);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      );

      this.logger.log('Navigating to category page...');
      await page.goto(categoryUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      // Get product links
      const productLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a.product__link'));
        return links
          .map((link) => link.getAttribute('href'))
          .filter((href) => href && href.includes('.html'));
      });

      this.logger.log(
        `Found ${productLinks.length} products. Limiting to ${limit}.`,
      );
      const targetLinks = productLinks.slice(0, limit);
      const results: any[] = [];

      for (const link of targetLinks) {
        if (!link) continue;
        this.logger.log(`Scraping: ${link}`);
        try {
          const productData = await this.scrapeProductDetail(browser, link);
          if (productData) {
            // Extract category from URL or use a default
            const category =
              categoryUrl.split('/').pop()?.replace('.html', '') || 'unknown';
            await this.saveProduct({ ...productData, category });
            results.push(productData);
          }
        } catch (e) {
          this.logger.error(`Failed to scrape ${link}: ${e.message}`);
        }
      }

      return results;
    } catch (error) {
      this.logger.error('Error during scraping:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  private async saveProduct(data: any) {
    try {
      // Generate slug if not present
      if (!data.slug) {
        data.slug = data.url.split('/').pop()?.replace('.html', '') ||
          data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      }

      // Default stock for crawled products
      data.totalStock = 100;

      await this.productModel.updateOne(
        { url: data.url },
        { $set: data },
        { upsert: true },
      );
      this.logger.log(`Saved product: ${data.name}`);
    } catch (error) {
      this.logger.error(`Error saving product ${data.name}: ${error.message}`);
    }
  }

  private async scrapeProductDetail(browser: puppeteer.Browser, url: string) {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    );

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });

      // Scroll down a bit to trigger lazy loading
      await page.evaluate(() => window.scrollBy(0, 500));
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const data = await page.evaluate(() => {
        const getText = (selectors: string[]) => {
          for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el && el.textContent?.trim()) return el.textContent.trim();
          }
          return '';
        };

        const name = getText(['h1', '.product__name', '.box-product-name h1']);
        const priceStr = getText([
          '.product__price--show',
          '.tpt---price',
          '.box-info__price',
          'p.special-price',
        ]);

        // Improved Image extraction (handling placeholders/lazy-loading)
        const imageElements = Array.from(
          document.querySelectorAll(
            '.swiper-slide img, .gallery-image img, #product-image-main',
          ),
        );
        const images = imageElements
          .map((img) => {
            const src =
              img.getAttribute('data-src') || img.getAttribute('src') || '';
            // Filter out small placeholders or gifs
            if (src.includes('placeholder') || src.endsWith('.gif'))
              return null;
            return src;
          })
          .filter((src) => src && src.startsWith('http')) as string[];

        // Tech specs
        const specs: { label: string; value: string }[] = [];
        const technicalItems = document.querySelectorAll(
          '.technical-content-item, .box-technical-info tr',
        );
        technicalItems.forEach((item) => {
          const label = item
            .querySelector('p:first-child, th')
            ?.textContent?.trim();
          const value = item.querySelector('div, td')?.textContent?.trim();
          if (label && value) specs.push({ label, value });
        });

        return {
          name,
          price: parseInt(priceStr.replace(/\D/g, '') || '0', 10),
          priceString: priceStr,
          url: document.location.href,
          images: Array.from(new Set(images)).slice(0, 5),
          specs,
        };
      });

      return data;
    } catch (error) {
      this.logger.error(`Error in detail page ${url}: ${error.message}`);
      return null;
    } finally {
      await page.close();
    }
  }
}
