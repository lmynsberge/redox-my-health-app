import { forEach } from 'lodash';
import React, { useEffect } from 'react';
import xmlFormatter from 'xml-formatter';

import cdaXsl from './CDA.xsl';

export const hasXmlErrors = (xml: string) => {
  const parser = new DOMParser();
  const xmlDom = parser.parseFromString(xml, 'application/xml');
  const parseError = xmlDom.getElementsByTagName('parsererror');
  return parseError.length > 0 ? parseError[0] : false;
};

export const xsltRender = (
  xml: string,
  params?: { [key: string]: string }
): Promise<string> =>
  new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.onload = (res) => {
      const stylesheet = req.responseXML;
      if (!stylesheet) return;
      const processor = new XSLTProcessor();
      processor.setParameter(
        '',
        'font-family',
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
      );
      if (params) {
        forEach(params, (v, k) => processor.setParameter('', k, v));
      }

      processor.importStylesheet(
        //new DOMParser().parseFromString(stylesheet, 'text/xml')
        stylesheet
      );
      const parsedXml = new DOMParser().parseFromString(xml, 'application/xml');
      const nodes = processor.transformToDocument(parsedXml);
      resolve(nodes.documentElement.innerHTML);
    };
    req.onerror = () => reject(req);
    req.open('GET', cdaXsl);
    req.overrideMimeType('application/xslt+xml');
    req.send();
  });

export const XsltViewer: React.FC<{ xml: string }> = ({ xml }) => {
  console.log('xml.length', xml.length);
  useEffect(() => {
    xsltRender(xml, {
      'bgcolor-body': 'rgb(20, 20, 20)',
      'bgcolor-th': '#1d1d1d',
      'bgcolor-td': '#141414',
      'font-color': 'rgba(255, 255, 255, 0.65)',
    }).then((innerHtml) => {
      if (!innerHtml) return;
      const frame = document.querySelector('iframe');
      if (frame && frame.contentDocument) {
        frame.contentDocument.open();
        frame.contentDocument.write(innerHtml);
        frame.contentDocument.close();
      }
    });
  }, [xml]);

  return (
    <iframe
      title="XSLTV"
      style={{ height: '800px', width: '100%', border: 'none' }}
      id="XsltViewer"
    ></iframe>
  );
};

export const formatXml = (xml?: string) => {
  if (typeof xml !== 'string' || xml.length === 0) {
    return '';
  }
  try {
    return xmlFormatter(xml);
  } catch {
    return '';
  }
};
