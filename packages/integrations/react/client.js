import { createElement } from 'react';
import StaticHtml from './static-html.js';
import { hydrateRoot } from 'react-dom/client.js';

export default (element) => async (Component, props, children) =>
	hydrateRoot(
		element,
		createElement(
			Component,
			{ ...props, suppressHydrationWarning: true },
			children != null ? createElement(StaticHtml, { value: children, suppressHydrationWarning: true }) : children
		)
	);
