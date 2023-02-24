import { Test, TestingModule } from '@nestjs/testing';
import { PagesService } from './pages.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { NotFoundException } from '@nestjs/common';
import { PrismaClient, page } from '@prisma/client';

describe('PagesService', () => {
  // variables
  let pages: PagesService;
  let prisma: PrismaClient;

  beforeAll(async () => {
    // modif avant chaques fonctions
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService, PagesService],
    }).compile();

    pages = moduleRef.get<PagesService>(PagesService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
  // ----------------------------
  describe('create', () => {
    it('should be create the new page', async () => {
      // utilisation de notre DTO (page)
      const createPageDto: CreatePageDto = {
        contenu: 'This is a new page',
        tags: 'pageCreated',
        url_img: 'https://exemple.images.org',
        url_video: 'https://exemple.video.org',
        meta_title: '<meta ...>',
      };

      const createdPage: page = await pages.create(createPageDto);

      jest.spyOn(prisma.page, 'create').mockResolvedValueOnce(createdPage);

      const result = await prisma.page.create({ data: createPageDto });
      expect(prisma.page.create).toHaveBeenCalledWith({ data: createPageDto });
      expect(result).toEqual(createdPage);
    });
  });
  // ----------------------------
  describe('findAll', () => {
    it('should be find all pages', async () => {
      const page1: CreatePageDto = {
        contenu: 'This is page 1',
        url_img: 'https://exemple.images.org',
        url_video: 'https://exemple.video.org',
        tags: 'page 1',
        meta_title: '<meta ...>',
      };

      const page2: CreatePageDto = {
        contenu: 'This is page 2',
        url_img: 'https://exemple.images.org',
        url_video: 'https://exemple.video.org',
        tags: 'page 2',
        meta_title: '<meta ...>',
      };

      const allPages: CreatePageDto[] = [page1, page2];

      expect(allPages).toHaveLength(2);
    });
  });
  // ----------------------------
  describe('findOne', () => {
    it('should return a single page by id', async () => {
      const onePage: CreatePageDto = {
        contenu: 'This is a new page',
        tags: 'pageCreated',
        url_img: 'https://exemple.images.org',
        url_video: 'https://exemple.video.org',
        meta_title: '<meta ...>',
      };

      const createdPage = await pages.create(onePage);
      // retourne une page par son id
      const result = await prisma.page.findUnique({
        where: { id: createdPage.id },
      });
      expect(result).toEqual(createdPage);
    });
  });
  // ----------------------------
  describe('removePage', () => {
    it('should remove a page', async () => {
      const createPageDto: CreatePageDto = {
        contenu: 'This is a new page',
        tags: 'pageCreated',
        url_img: 'https://exemple.images.org',
        url_video: 'https://exemple.video.org',
        meta_title: '<meta ...>',
      };

      const createdPage = await pages.create(createPageDto);
      const result = await prisma.page.delete({
        where: { id: createdPage.id },
      });

      expect(result).toEqual(createdPage);
    });
  });
});
