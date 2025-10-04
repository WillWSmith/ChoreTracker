import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the chore command center hero', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /chore constellation/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /launch new week/i })).toBeInTheDocument();
});
