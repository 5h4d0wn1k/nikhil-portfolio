import { renderToStaticMarkup } from 'react-dom/server';
import PortfolioRouter from '../src/archive.jsx';

export function renderRoute(pathname) {
  globalThis.location = new URL('https://cynik-operator.pages.dev' + pathname);
  return renderToStaticMarkup(<PortfolioRouter />);
}
