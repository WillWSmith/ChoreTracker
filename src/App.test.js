import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the refreshed chore atlas hero', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /chore atlas/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /launch new week/i })).toBeInTheDocument();
});
