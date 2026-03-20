import React from 'react';
import Link from '@docusaurus/Link';

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default function RecentUpdates({ recentUpdates }) {
  const data = recentUpdates;

  if (!data || !data.updates || data.updates.length === 0) {
    return null;
  }

  return (
    <section className="homepage-updates container padding-bottom--xl">
      <div className="homepage-updates__header">
        <h2 className="blog__section_title margin-top--none">{data.title}</h2>
        <p className="homepage-updates__intro">
          This section is generated at build time from git history, so I do not have to keep a pinned changelog post at the top of the blog anymore.
        </p>
      </div>

      <div className="homepage-updates__card">
        <div className="homepage-updates__table-wrapper">
          <table className="homepage-updates__table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Section</th>
                <th>Updated page</th>
                <th>Commit note</th>
              </tr>
            </thead>
            <tbody>
              {data.updates.map((update) => (
                <tr key={`${update.sourceFilePath}-${update.lastModified}`}>
                  <td>{formatDate(update.lastModified)}</td>
                  <td>{update.section}</td>
                  <td>
                    <Link to={update.permalink}>{update.title}</Link>
                  </td>
                  <td>{update.commitMessage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}