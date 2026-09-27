import { render, screen } from '@testing-library/react-native';
import { Text } from '../../components/Text';
import { I18nOverride, useI18n } from '../I18nContext';

const Caps = ({ children }: { children: string }) => (
  <Text style={{ textTransform: 'uppercase' }}>{children}</Text>
);

const Copy = () => <Text>{useI18n().t.scenario.locked}</Text>;

describe('I18nOverride', () => {
  it('upper-cases English copy with English rules inside a Turkish app', async () => {
    await render(
      <>
        <Caps>orbital relays</Caps>
        <I18nOverride language="en">
          <Caps>interactive selection</Caps>
        </I18nOverride>
      </>
    );
    // Default app language is Turkish: dotted İ outside the override…
    expect(screen.getByText('ORBİTAL RELAYS')).toBeOnTheScreen();
    // …inside it the text is not rewritten in JS; the native uppercase transform (plain I) applies.
    expect(screen.getByText('interactive selection')).toHaveStyle({ textTransform: 'uppercase' });
  });

  it('serves the overriding language to components', async () => {
    await render(
      <I18nOverride language="en">
        <Copy />
      </I18nOverride>
    );
    expect(screen.getByText('Locked')).toBeOnTheScreen();
  });
});
