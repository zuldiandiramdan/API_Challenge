import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_CAN_USER_ACCESS = 'isCanUserAccess';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const User = () => SetMetadata(IS_CAN_USER_ACCESS, true);
