type WordmarkSize = 'tiny' | 'small' | 'hero' | 'footer';

export function Wordmark({
  size = 'small',
  href = '#top',
  label = 'Uncomfortable Academy',
}: {
  size?: WordmarkSize;
  href?: string | null;
  label?: string;
}) {
  const content = (
    <>
      <span className="wordmark__lead">Uncomfortable</span>
      <span className="wordmark__script">Academy</span>
    </>
  );

  const className = `wordmark wordmark--${size}`;

  if (!href) {
    return <span className={className}>{content}</span>;
  }

  return (
    <a className={className} href={href} aria-label={label}>
      {content}
    </a>
  );
}
