import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefaultResponse } from 'src/common/interfaces/responses';

@ApiTags('Server')
@Controller()
export class AppController {
  constructor() {}

  @Get('status')
  @ApiOperation({
    summary: 'Server live status',
    description: 'Server live status',
  })
  @ApiOkResponse({
    description: 'Server is alive',
    example: {
      message: 'Server is working',
      statusCode: HttpStatus.OK,
    },
  })
  getServerStatus(): DefaultResponse<null> {
    return {
      message: 'Server is working',
      statusCode: HttpStatus.OK,
    };
  }
}
