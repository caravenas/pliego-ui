// El bundle del Design System es un script clásico que lee `window.React`: no
// hay `react/jsx-runtime` que importar. Este módulo hace de jsx runtime sobre
// `createElement`, que es lo que sí existe en el global.
import { Fragment, createElement } from 'react';

type Props = Record<string, unknown> & { children?: unknown };

export { Fragment };

export function jsx(type: unknown, props: Props, key?: string) {
  const { children, ...rest } = props;
  if (key !== undefined) rest.key = key;
  return children === undefined
    ? createElement(type as never, rest)
    : createElement(type as never, rest, children as never);
}

export function jsxs(type: unknown, props: Props, key?: string) {
  const { children, ...rest } = props;
  if (key !== undefined) rest.key = key;
  // Los hijos van como argumentos sueltos, y no como un array: así React no
  // pide `key` a cada uno, igual que con el jsx runtime de verdad.
  return createElement(type as never, rest, ...((Array.isArray(children) ? children : [children]) as never[]));
}
