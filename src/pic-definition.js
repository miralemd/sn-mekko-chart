import axis from './components/axis';
import cells from './components/cells';
import spanLabels from './components/span-labels';
import tooltip from './components/tooltip';
import disclaimer from './components/disclaimer';

import scales from './scales';
import stack from './stack';

import REFS from './refs';

function tooltipInteraction() {
  return {
    key: 'tooltip',
    type: 'native',
    events: {
      mousemove(e) {
        const bounds = this.chart.element.getBoundingClientRect();
        const p = {
          x: e.clientX - bounds.left,
          y: e.clientY - bounds.top,
        };

        let shapes = [];

        shapes = this.chart.shapesAt(p, {
          components: [
            { key: 'cells' },
            { key: 'column-boxes' },
          ],
          propagation: 'stop',
        });

        this.chart.component('tool').emit('show', e, { nodes: shapes });
      },
      mouseleave() {
        this.chart.component('tool').emit('hide');
      },
    },
  };
}

export default function ({
  // layout,
  context,
  contraster,
  restricted,
  picassoColoring,
}) {
  if (restricted && restricted.type === 'disrupt') {
    return {
      components: disclaimer(restricted),
    };
  }

  const colorDatum = picassoColoring.datumProps();
  const colorFill = picassoColoring.color();

  const leg = picassoColoring.legend({
    key: 'color-legend',
    eventName: 'ev',
  });

  const allowTooltip = context.permissions.indexOf('passive') !== -1;
  return {
    collections: [
      stack({
        key: REFS.SPAN_COLLECTION,
        field: 'qDimensionInfo/0',
        trackBy: cell => cell.qElemNumber,
        reduce: 'first',
        stackKey: () => -1,
      }),
      stack({
        key: REFS.CELL_COLLECTION,
        field: 'qDimensionInfo/1',
        props: {
          ...colorDatum,
        },
      }),
    ],
    scales: {
      ...scales(),
      ...picassoColoring.scales(),
    },
    palettes: picassoColoring.palettes(),
    components: [
      ...leg.components,
      ...axis(),
      ...cells({ context, contraster, colorFill }),
      ...spanLabels({ context }),
      ...(allowTooltip ? tooltip() : []),
      ...disclaimer(restricted),
    ],
    interactions: [...leg.interactions, allowTooltip ? tooltipInteraction() : false].filter(Boolean),
  };
}
