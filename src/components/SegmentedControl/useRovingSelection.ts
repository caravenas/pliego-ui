export interface RovingOption<V extends string> {
  value: V;
  disabled?: boolean;
}

/**
 * El segmento que entra en el orden de tabulación: el actual si se puede
 * elegir y, si no, el primero que se pueda. Con un solo punto de tabulación
 * el grupo cuesta una sola pulsación de Tab, y las flechas hacen el resto.
 */
export function tabStopValue<V extends string>(options: RovingOption<V>[], value: V): V | undefined {
  const current = options.find((option) => option.value === value);
  if (current && !current.disabled) return current.value;
  return options.find((option) => !option.disabled)?.value;
}

/**
 * A qué segmento lleva una tecla desde `from`, o `undefined` si la tecla no
 * navega. Salta los deshabilitados, da la vuelta en los extremos, y Inicio y
 * Fin van al primer y al último que se puedan elegir. Un `radiogroup`
 * (`vertical`) responde también a arriba y abajo, como el nativo; un
 * `tablist` horizontal, no.
 */
export function nextValue<V extends string>(
  options: RovingOption<V>[],
  from: V,
  key: string,
  vertical = false,
): V | undefined {
  const enabled = options.filter((option) => !option.disabled);
  if (enabled.length === 0) return undefined;
  if (key === 'Home') return enabled[0].value;
  if (key === 'End') return enabled[enabled.length - 1].value;
  const forward = key === 'ArrowRight' || (vertical && key === 'ArrowDown');
  const backward = key === 'ArrowLeft' || (vertical && key === 'ArrowUp');
  if (!forward && !backward) return undefined;

  const step = forward ? 1 : -1;
  const start = options.findIndex((option) => option.value === from);
  for (let i = 1; i <= options.length; i += 1) {
    const candidate = options[(((start + step * i) % options.length) + options.length) % options.length];
    if (!candidate.disabled) return candidate.value;
  }
  return undefined;
}
