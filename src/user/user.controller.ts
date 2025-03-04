import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './schema/user.schema';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isAdmin } from 'src/common/decorators/isadmin.decorator';
import { Response } from 'express';
import { IsAdmin } from 'src/common/guards/isadmin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CustomI18nValidationExceptionFilter } from 'src/common/filters/i18.filter';

@UseFilters(new CustomI18nValidationExceptionFilter())
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  register(@Body() userData: RegisterUserDto) {
    return this.userService.register(userData);
  }

  @Post('/login')
  login(@Body() loginData: UpdateUserDto, @Res() res: Response) {
    return this.userService.login(loginData.email, loginData.password, res);
  }

  @Get()
  @isAdmin()
  @UseGuards(AuthGuard, IsAdmin)
  //   @UseGuards(IsAdmin)
  find(): Promise<User[]> {
    return this.userService.findUsers();
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  findOne(
    @Req()
    request: Request,
  ): UserResponseDto {
    return new UserResponseDto(request['user']._doc);
  }

  @Patch()
  @UseGuards(AuthGuard)
  update(
    @Req()
    request: Request,
    @Body()
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(request['user']._id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  /* 
    Desc: Forget Password And Send Code To User
*/
  @Post('/forgetPassword')
  forgetPassword(@Body() user: UpdateUserDto) {
    return this.userService.forgetPassword(user.email);
  }
  // 2) Verify Reset Code For Forget Password
  @Post('/verifyResetCode')
  verifyResetCode(@Body() data: UpdateUserDto) {
    return this.userService.verifyResetCode(data.resetCode);
  }
  // 3) Reset Password
  @Post('/resetPassword')
  resetPassword(@Body() data: UpdateUserDto) {
    console.log(data);

    return this.userService.resetPassword(
      data.email,
      data.password,
      data.passwordConfirmation,
    );
  }
}
