import { Injectable, NestMiddleware } from '@nestjs/common';
import { ArticlesService } from 'src/articles/articles.service';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  constructor(private readonly articlesService: ArticlesService) {}
  async use(req: any, res: any, next: () => void) {
    const countArticles = await this.articlesService.findCountArticles()
    const countPages = Math.ceil(countArticles / 5)
    if(parseInt(req.params.page) > countPages){
      res.redirect('/articles/pages/'+countPages)
    }else{
      next();
    }
  }
}
