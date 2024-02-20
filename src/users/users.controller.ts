import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/user_auth/auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(
        private readonly userService : UsersService
     ){}

     @Public()
    @Post('register')
    async register (@Body() createUserDto : CreateUserDto){
        const response = await this.userService.register(createUserDto)
        return {
            response
        }
    }


    

}
