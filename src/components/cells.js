import REFS from '../refs';

export default function cells({
  context,
}) {
  return [{
    key: 'cells',
    type: 'box',
    data: {
      collection: REFS.STACKED_COLLECTION,
    },
    brush: context.permissions.indexOf('select') !== -1 && context.permissions.indexOf('interact') !== -1 ? {
      trigger: [{
        contexts: ['selection'],
      }],
      consume: [{
        context: 'selection',
        style: {
          inactive: { opacity: 0.3 },
        },
      }],
    } : {},
    settings: {
      major: {
        ref: REFS.SERIES,
        binStart: {
          scale: 'm',
          fn(d) {
            const sBand = d.resources.scale('b');
            return d.resources.scale('m')(sBand.datum(d.datum.series.value).start.value);
          },
        },
        binEnd: {
          fn(d) {
            const ss = d.resources.scale('b');
            return d.resources.scale('m')(ss.datum(d.datum.series.value).end.value);
          },
        },
      },
      minor: {
        scale: 'y',
        ref: 'end',
      },
      box: {
        fill: { scale: 'color' },
      },
    },
  }, {
    key: 'cell-labels',
    type: 'labels',
    dock: '@cells',
    displayOrder: 2,
    settings: {
      sources: [{
        component: 'cells',
        selector: 'rect',
        strategy: {
          type: 'rows',
          settings: {
            labels: [{
              label: d => (d.data ? d.data.label : ''),
            }],
          },
        },
      }],
    },
  }];
}
