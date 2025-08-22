import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';

import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  let spectator: SpectatorPipe<ReversePipe>;
  const createPipe = createPipeFactory(ReversePipe);

  it('should reverse a string', () => {
    spectator = createPipe(`{{ 'Hello' | reverse }}`);
    expect(spectator.element).toHaveText('olleH');
  });

  it('should handle empty string', () => {
    spectator = createPipe(`{{ '' | reverse }}`);
    expect(spectator.element).toHaveText('');
  });

  it('should handle single character', () => {
    spectator = createPipe(`{{ 'A' | reverse }}`);
    expect(spectator.element).toHaveText('A');
  });

  it('should handle string with spaces', () => {
    spectator = createPipe(`{{ 'Hello World' | reverse }}`);
    expect(spectator.element).toHaveText('dlroW olleH');
  });

  it('should handle string with special characters', () => {
    spectator = createPipe(`{{ 'Hello@123!' | reverse }}`);
    expect(spectator.element).toHaveText('!321@olleH');
  });
});
