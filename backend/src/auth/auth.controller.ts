import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards, Version } from '@nestjs/common';
import { AuthResDto, ChangePasswordBodyDto, EmailBodyDto, EmailVerificationDto, GetSessionInfoDto, ResetPasswordBodyDto, SignInBodyDto, SignUpBodyDto, SignUpSubAccountBodyDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CookieService } from './cookie.service';
import { AuthGuard } from './auth.guard';
import { SessionInfo } from './session-info.decorator';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService, private cookieService: CookieService) { }

    @Version('1')
    @Post('sign-up')
    @ApiCreatedResponse({
        type: AuthResDto
    })
    async signUp(
        @Body() body: SignUpBodyDto,
        @Res({ passthrough: true }) res: Response
    ) {
        // const {accessToken} = await this.authService.signUp(
        //     body.email,
        //     body.password
        // );
        // this.cookieService.setToken(res, accessToken)

        return await this.authService.signUp(
            body.email,
            body.password
        );
        // return { id: newUserId };
    }

    @Post('sign-up-sub')
    @UseGuards(AuthGuard)
    @ApiCreatedResponse({
        type: AuthResDto
    })
    async signUpSub(
        @Body() body: SignUpSubAccountBodyDto,
        @SessionInfo() session: GetSessionInfoDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return await this.authService.signUpSub(
            session,
            body.email,
            body.password,
            body.name,
            body.address,
            body.phone,
            body.comment
        );
    }


    @Version('1')
    @Post('sign-in')
    @ApiOkResponse({
        type: AuthResDto
    })
    @HttpCode(HttpStatus.OK)
    async signIn(
        @Body() body: SignInBodyDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const { accessToken, user } = await this.authService.signIn(
            body.email,
            body.password
        );
        accessToken && this.cookieService.setToken(res, accessToken)
        return user
    }

    @Post('sign-out')
    @ApiOkResponse()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    signOut(@Res({ passthrough: true }) res: Response) {
        this.cookieService.removeToken(res);
    }

    @Post('send-code')
    @ApiOkResponse({
        type: AuthResDto
    })
    async sendCode(
        @Body() body: EmailBodyDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return await this.authService.sendCode(
            body.email
        );
    }

    @Post("verify-email")
    @ApiOkResponse({
        type: AuthResDto
    })
    async emailVerify(
        @Body() body: EmailVerificationDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const { accessToken, user } = await this.authService.verifyEmail(
            body.email,
            body.code
        );
        this.cookieService.setToken(res, accessToken)
        return user
    }

    @Version('1')
    @Post('reset-password')
    @ApiOkResponse()
    @HttpCode(HttpStatus.OK)
    async resetPassword(
        @Body() body: ResetPasswordBodyDto,
        @Res({ passthrough: true }) res: Response
    ) {
        await this.authService.resetPassword(
            body.email,
        );
    }

    @Version('1')
    @Post('change-password')
    @UseGuards(AuthGuard)
    @ApiOkResponse({
        type: AuthResDto
    })
    @HttpCode(HttpStatus.OK)
    async changePassword(
        @Body() body: ChangePasswordBodyDto,
        @SessionInfo() session: GetSessionInfoDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const { accessToken, user } = await this.authService.changePassword(
            session.email,
            body.password,
            body.newPassword
        );
        this.cookieService.removeToken(res);
        this.cookieService.setToken(res, accessToken)
        return user
    }

    @Get('session')
    @ApiOkResponse({
        type: GetSessionInfoDto
    })
    @UseGuards(AuthGuard)
    getSessionInfo(@SessionInfo() session: GetSessionInfoDto) {
        return session;
    }

}
