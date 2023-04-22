import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipeService: RecipesService) {}

  @Post('uploadImage/:id')
  async uploadImage(@Req() req, @Param('id') id: string, @UploadedFile() file) {
    console.log(id, file, req);
    const recipe = await this.recipeService.uploadImage(id, file);

    return recipe;
  }
}
