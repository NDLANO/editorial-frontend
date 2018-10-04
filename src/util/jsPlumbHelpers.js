import { jsPlumb } from 'jsplumb';

export const connectLinkItems = (
  source,
  connectionArray,
  parent,
  subject,
  container,
) => {
  const filteredConnections = connectionArray.filter(
    connection =>
      connection.targetId !== parent && connection.type !== 'subtopic',
  );
  if (filteredConnections.length === 0) return [];
  const connectionTargets = filteredConnections.map(conn => {
    if (conn.type === 'parent-topic') {
      return { ...conn, targetId: `urn:${conn.paths[0].split('/')[1]}` };
    }
    return conn;
  });
  const instance = jsPlumb.getInstance({
    Container: 'plumbContainer',
    Endpoint: 'Blank',
    Connector: ['Flowchart', { stub: 50 }],
    PaintStyle: { strokeWidth: 1, stroke: '#000000', dashstyle: '4 2' },
    Anchors: ['Left', 'Left'],
    deleteEndpointsOnDetach: false,
    Overlays: [
      [
        'Custom',
        {
          create: component => {
            if (!component.source) return container.starButton.current;
            const { isPrimary } = connectionArray.find(
              connection => connection.targetId === parent,
            );
            return isPrimary
              ? container.starButton.current
              : container[`linkButton-urn:${subject}`];
          },
          location: 70,
          id: 'sourceOverlay',
        },
      ],
    ],
  });

  return connectionTargets.map(({ targetId, isPrimary }) => {
    const connection = instance.connect({
      source,
      target: targetId,
      overlays: [
        [
          'Custom',
          {
            create: component => {
              if (!component.target) return container[`linkButton-${targetId}`];
              return isPrimary
                ? container.starButton.current
                : container[`linkButton-${targetId}`];
            },
            location: -30,
            id: `targetOverlay`,
          },
        ],
      ],
    });
    connection.showOverlay('sourceOverlay');
    connection.showOverlay(`targetOverlay`);
    return { instance, connection };
  });
};
