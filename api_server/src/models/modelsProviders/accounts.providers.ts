import { Account } from './../accounts.entity';

export const accountsProviders = [
  {
    provide: 'AccountRepository',
    useValue: Account,
  },
];