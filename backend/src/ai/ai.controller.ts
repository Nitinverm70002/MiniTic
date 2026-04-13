import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AiService, Difficulty } from './ai.service';
import { Board, Player } from './game.util';

export class MoveRequestDto {
  board: Board;
  player: Player;
  difficulty: Difficulty;
}

@Controller('api/game')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('move')
  calculateMove(@Body() payload: MoveRequestDto) {
    if (!payload || !payload.board || payload.player === undefined || !payload.difficulty) {
      throw new BadRequestException('Invalid payload');
    }

    const result = this.aiService.getBestMove(
      payload.board, 
      payload.player, 
      payload.difficulty
    );

    return result;
  }
}
