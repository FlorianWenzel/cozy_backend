import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddEntryDto } from './dto/add-entry.dto';
import { Recipe } from '@prisma/client';
import * as fs from 'fs';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}
  private server: any;

  async getRecipe(householdId: string, id?: string) {
    if (id)
      return this.prisma.recipe.findFirst({
        where: {
          id,
          householdId,
        },
        include: {
          recipeEntries: {
            include: {
              item: true,
              unit: true,
            },
          },
        },
      });
    return this.prisma.recipe.findMany({
      where: {
        householdId,
      },
    });
  }

  async newRecipe(householdId: string) {
    return this.prisma.recipe.create({
      data: {
        name: 'new recipe',
        description: '',
        rating: 3,
        householdId,
      },
    });
  }

  async delete(id: string) {
    const recipeToDelete = await this.prisma.recipe.findFirst({
      where: { id },
    });
    await this.prisma.recipe.delete({
      where: { id },
    });
    return recipeToDelete.id;
  }

  addEntry(addEntryDto: AddEntryDto) {
    return this.prisma.recipeEntry.create({ data: { ...addEntryDto } });
  }

  async removeEntry(entryId: string) {
    const recipe = (
      await this.prisma.recipeEntry.findFirst({
        where: { id: entryId },
        include: { recipe: true },
      })
    ).recipe as Recipe;

    await this.prisma.recipeEntry.delete({ where: { id: entryId } });
    return recipe?.id;
  }

  async updateRecipe(recipe: Recipe) {
    return this.prisma.recipe.update({
      where: { id: recipe.id },
      data: { ...recipe },
    });
  }

  async uploadImage(id: string, image: string) {
    console.log(id, image);
    fs.writeFileSync('../images/' + id + '.jpg', Buffer.from(image));
  }
}
