import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  Body,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { GetRecipesDto } from './dto/get-recipes.dto';
import { IdDto } from '../shared/dto/id.dto';
import { Server } from 'socket.io';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { AddEntryDto } from './dto/add-entry.dto';
import { Recipe } from '@prisma/client';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@WebSocketGateway({ maxHttpBufferSize: 1e8 })
export class RecipesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly recipeService: RecipesService) {}

  @SubscribeMessage('recipes/get')
  @UseGuards(WsJwtGuard)
  @UsePipes(ValidationPipe)
  async getRecipes(@MessageBody() getRecipesDto: GetRecipesDto, @Req() req) {
    return this.recipeService.getRecipe(
      req.user.households[0].householdId,
      getRecipesDto?.id,
    );
  }
  @SubscribeMessage('recipes/delete')
  @UseGuards(WsJwtGuard)
  @UsePipes(ValidationPipe)
  async deleteRecipe(@MessageBody() idDto: IdDto, @Req() req) {
    const id = await this.recipeService.delete(idDto.id);

    this.server
      .to(req.user.households[0].householdId)
      .emit('recipes/delete', id);
    return idDto;
  }
  @SubscribeMessage('recipes/create')
  @UseGuards(WsJwtGuard)
  async createRecipe(@Req() req) {
    return this.recipeService.newRecipe(req.user.households[0].householdId);
  }

  @SubscribeMessage('recipes/update')
  @UseGuards(WsJwtGuard)
  async updateRecipe(@Req() req, @MessageBody() recipe: UpdateRecipeDto) {
    delete recipe.recipeEntries;
    delete recipe.createdAt;
    delete recipe.updatedAt;

    await this.recipeService.updateRecipe(recipe as unknown as Recipe);

    const updatedRecipe = await this.recipeService.getRecipe(
      req.user.households[0].householdId,
      recipe.id,
    );

    this.server
      .to(req.user.households[0].householdId)
      .emit('recipes/get', updatedRecipe);

    return updatedRecipe;
  }

  @SubscribeMessage('recipes/addEntry')
  @UseGuards(WsJwtGuard)
  async addEntryToRecipe(@Req() req, @MessageBody() addEntryDto: AddEntryDto) {
    await this.recipeService.addEntry(addEntryDto);

    const updatedRecipe = await this.recipeService.getRecipe(
      req.user.households[0].householdId,
      addEntryDto.recipeId,
    );

    this.server
      .to(req.user.households[0].householdId)
      .emit('recipes/get', updatedRecipe);

    return updatedRecipe;
  }
  @SubscribeMessage('recipes/deleteEntry')
  @UseGuards(WsJwtGuard)
  async deleteEntry(@Req() req, @MessageBody() entryId: IdDto) {
    const recipeId = await this.recipeService.removeEntry(entryId.id);

    const updatedRecipe = await this.recipeService.getRecipe(
      req.user.households[0].householdId,
      recipeId,
    );

    this.server
      .to(req.user.households[0].householdId)
      .emit('recipes/get', updatedRecipe);

    return updatedRecipe;
  }
}
