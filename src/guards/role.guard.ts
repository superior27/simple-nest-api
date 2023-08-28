import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';


@Injectable()
export class RoleGuard implements CanActivate {
  
  constructor(
    private readonly reflector: Reflector
    )
  {

  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>
  {

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    
    const {user} = context.switchToHttp().getRequest();

    const filtredRoles = requiredRoles.filter((role) => {
      if(role == user.role)
      {
        return role;
      }
    });
    
    console.log(requiredRoles, user, filtredRoles);

    if(filtredRoles.length <= 0)
    {
      return false;
    }
    
    return true;
    
     

  }

}
