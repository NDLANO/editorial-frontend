import { Connection, jsPlumb, jsPlumbInstance } from 'jsplumb';
import { RefObject } from 'react';
import { TopicConnections } from '../modules/taxonomy/taxonomyApiInterfaces';

export interface JsPlumbInstanceConnection {
  instance: jsPlumbInstance;
  connection: Connection;
}

export const connectLinkItems = async (
  source: string,
  connectionArray: TopicConnections[],
  parent: string | undefined,
  starButton: RefObject<any>,
): Promise<JsPlumbInstanceConnection[]> => {
  const filteredConnections = connectionArray.filter(
    connection => connection.targetId !== parent && connection.type !== 'subtopic',
  );
  if (filteredConnections.length === 0) return [];
  const connectionTargets = filteredConnections.map(conn => {
    if (conn.type === 'parent-topic') {
      return { ...conn, targetId: `urn:${conn.paths[0].split('/')[1]}` };
    }
    return conn;
  });
  const { isPrimary } = connectionArray.find(connection => connection.targetId === parent)!;

  const instance = jsPlumb.getInstance({
    Container: 'plumbContainer',
    Endpoint: 'Blank',
    Connector: ['Flowchart', { stub: 70 }],
    // @ts-ignore
    PaintStyle: { strokeWidth: 1, stroke: '#000000', dashstyle: '4 2' },
    Anchors: ['Left', 'Left'],
    deleteEndpointsOnDetach: false,
    Overlays: isPrimary
      ? [
          [
            'Custom',
            {
              create: (component: any) => {
                return starButton.current;
              },
              location: 57,
              id: 'sourceOverlay',
            },
          ],
        ]
      : [],
  });

  if (!document.getElementById(source)) {
    // Sometimes the menu item is not rendered when showLink is called
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return connectionTargets.map(({ targetId, isPrimary }) => {
    const connection = instance.connect({
      source,
      target: targetId,
      overlays: isPrimary
        ? [
            [
              'Custom',
              {
                create: (component: any) => {
                  return starButton.current;
                },
                location: -40,
                id: `targetOverlay`,
              },
            ],
          ]
        : [],
    });
    return { instance, connection };
  });
};
