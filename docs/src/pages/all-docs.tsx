import React, { useMemo } from 'react';
import Layout from '@theme/Layout';
import CopyButton from '../components/CopyButton';
import { useAllDocsData } from '@docusaurus/plugin-content-docs/client';

export default function AllDocs(): JSX.Element {
  const allDocs = useAllDocsData();
  const defaultVersion = allDocs.default.versions[0];
  const docs = defaultVersion.docs;

  // Combine all documentation content
  const allContent = useMemo(() => {
    return Object.values(docs)
      .sort((a, b) => a.sidebarPosition - b.sidebarPosition)
      .map(doc => `# ${doc.title}\n\n${doc.content}`)
      .join('\n\n---\n\n');
  }, [docs]);

  return (
    <Layout
      title="All Documentation"
      description="View all UniMind documentation in a single page"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <main className="col col--8 col--offset-2">
            <div className="margin-bottom--lg">
              <div className="card">
                <div className="card__header">
                  <div className="flex items-center justify-between">
                    <h1 className="margin-bottom--sm">Complete Documentation</h1>
                    <CopyButton text={allContent} />
                  </div>
                  <p className="text--muted">
                    All documentation content in a single page. Use the copy button to copy everything.
                  </p>
                </div>
              </div>
            </div>

            <div className="theme-doc-markdown markdown">
              {Object.values(docs)
                .sort((a, b) => a.sidebarPosition - b.sidebarPosition)
                .map((doc) => (
                  <article key={doc.id} className="margin-bottom--xl">
                    <div className="card">
                      <div className="card__header">
                        <div className="flex items-center justify-between">
                          <h2 className="margin-bottom--sm">{doc.title}</h2>
                          <CopyButton text={doc.content} />
                        </div>
                        <small className="text--muted">Path: {doc.permalink}</small>
                      </div>
                      <div className="card__body">
                        <div dangerouslySetInnerHTML={{ __html: doc.contentHtml }} />
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}