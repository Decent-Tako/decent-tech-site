import { Photo } from '../pages/Photo';
import { PHOTOS } from '../pages/content';
import { ProseFrame } from './ProseFrame';
import type { Measure } from './measure';

export function LongReference({
  measure,
  onMeasureChange,
}: {
  measure: Measure;
  onMeasureChange: (measure: Measure) => void;
}) {
  return (
    <ProseFrame measure={measure} onMeasureChange={onMeasureChange}>
      <h1>Academy reading reference</h1>
      <p className="lead">
        This page puts <code>prose</code> under pressure. It is a dense
        reference for the people who write Academy long-form: tokens, spaces,
        weeks, measures, and the exact classes the plugin needs. It is not a
        second type system. It is the same Brand Sans reading surface with
        tables, nested lists, and code in the flow.
      </p>
      <h2>Why this plugin exists here</h2>
      <p>
        Article bodies and Markdown output are HTML we do not control. The
        maintained answer is <code>@tailwindcss/typography</code> 0.5.20, MIT,
        from the Tailwind team. Tailwind 4.3.3 is already in{' '}
        <code>design-system/</code>. The Tailwind 4 install path is a CSS
        <code>@plugin</code> directive, not a <code>tailwind.config.js</code>{' '}
        plugins array. Writing heading sizes, list spacing, and table rules
        by hand is the work the repository contract tells us not to do.
      </p>
      <p>
        The Academy theme is <code>prose-academy</code>. It maps plugin
        variables onto issue 231 tokens. Body and headings use Brand Sans.
        They must not render as Arial. Arial is removed from every Academy
        stack. The fallback is Brand Sans, our own OFL face.
      </p>
      <pre tabIndex={0}>
        <code>{`@import "tailwindcss";
@plugin "@tailwindcss/typography";`}</code>
      </pre>
      <h2>Tokens the theme may use</h2>
      <p>
        Neutrals are the rest state. Blue is hover and{' '}
        <code>:focus-visible</code>, with white type. Yellow is press{' '}
        <code>:active</code> and confirmed success, with ink type. Quiet is
        a hairline and disabled mark only. It fails AA as body text.
      </p>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Hex</th>
            <th>Prose role</th>
            <th>Body text</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>--ink</code>
            </td>
            <td>#212121</td>
            <td>Body, headings, quotes, bold, bullets, inline code</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>--paper</code>
            </td>
            <td>#FFFFFF</td>
            <td>Page surface. Type on blue. Type in code blocks</td>
            <td>Yes, on ink or blue</td>
          </tr>
          <tr>
            <td>
              <code>--soft</code>
            </td>
            <td>#F2F2F2</td>
            <td>Quiet surface. Invert lead and captions</td>
            <td>Yes, on ink</td>
          </tr>
          <tr>
            <td>
              <code>--line</code>
            </td>
            <td>#D9D9D9</td>
            <td>Rules and table borders</td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>--quiet</code>
            </td>
            <td>#A6A6A6</td>
            <td>Not used for prose text</td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>--charcoal</code>
            </td>
            <td>#4A4A4A</td>
            <td>Lead, captions, counters</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>--accent-blue</code>
            </td>
            <td>#0035B1</td>
            <td>Links at rest. Hover and focus fill</td>
            <td>Yes, on paper</td>
          </tr>
          <tr>
            <td>
              <code>--accent-yellow</code>
            </td>
            <td>#DEF54F</td>
            <td>Press fill</td>
            <td>Ink on yellow only</td>
          </tr>
        </tbody>
      </table>
      <p>
        Rejected lookalikes stay rejected: <code>#0170B9</code>,{' '}
        <code>#6EC1E4</code>, <code>#2A6FFB</code>, <code>#FCB900</code>. Do
        not pick them because they look close. The kit cyan is not the accent
        pair. The WordPress gold is not the press fill.
      </p>
      <h3>Measure</h3>
      <p>
        Long-form text needs a controlled line length, roughly 60 to 75
        characters. The plugin default is 65ch. The control on this page
        switches three measures so you can compare them on the same copy.
      </p>
      <table>
        <thead>
          <tr>
            <th>Control</th>
            <th>Class</th>
            <th>Width</th>
            <th>Use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Narrow</td>
            <td>
              <code>prose-measure-narrow</code>
            </td>
            <td>50ch</td>
            <td>Below the reading range. Use it to compare.</td>
          </tr>
          <tr>
            <td>Default</td>
            <td>
              <code>prose-measure-default</code>
            </td>
            <td>65ch</td>
            <td>Inside the 60 to 75 range. This is the reading default.</td>
          </tr>
          <tr>
            <td>Wide</td>
            <td>
              <code>prose-measure-wide</code>
            </td>
            <td>80ch</td>
            <td>Above the reading range. Use it to compare.</td>
          </tr>
        </tbody>
      </table>
      <h2>Circle map the copy must obey</h2>
      <p>
        Uncomfortable Academy is a Circle space group, not a space. The
        group is private and hidden. Membership must be granted. A public
        link alone lands on a locked page. Long-form copy should use the
        space names the participant will see, not internal ids, except in
        reference tables like this one.
      </p>
      <table>
        <thead>
          <tr>
            <th>Space</th>
            <th>Id</th>
            <th>Type</th>
            <th>Copy name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Start</td>
            <td>
              <code>2783885</code>
            </td>
            <td>basic</td>
            <td>Start. Week 0 Set Up.</td>
          </tr>
          <tr>
            <td>Lounge</td>
            <td>
              <code>2783886</code>
            </td>
            <td>chat</td>
            <td>Lounge. Buddy and Team talk here.</td>
          </tr>
          <tr>
            <td>Tools</td>
            <td>
              <code>2783887</code>
            </td>
            <td>basic</td>
            <td>Tools. Tracker and ten-day plan.</td>
          </tr>
          <tr>
            <td>Leaders</td>
            <td>
              <code>2783888</code>
            </td>
            <td>basic</td>
            <td>Leaders. Not a participant home.</td>
          </tr>
          <tr>
            <td>Learn</td>
            <td>
              <code>2783889</code>
            </td>
            <td>basic</td>
            <td>Learn. Six weekly lessons.</td>
          </tr>
          <tr>
            <td>Events</td>
            <td>
              <code>2783890</code>
            </td>
            <td>event</td>
            <td>Events. Learn + Do and Challenge week.</td>
          </tr>
        </tbody>
      </table>
      <h3>Systems around the page</h3>
      <p>
        Funraisin is where a person registers to fundraise. Circle is where
        the Academy lives. PhoApp is the decision engine for work Circle
        cannot decide by itself. Shared Mobilise data lives in PostgreSQL
        <code>nuc-db</code>. Reading surfaces do not invent a fourth name
        for those systems.
      </p>
      <h2>Week structure in nested lists</h2>
      <p>
        The six weeks plus Challenge week are a sequence. Complete the
        current lesson and its action before the next week opens. The nested
        lists below are the same facts the motion pages already use. They
        are here to show how <code>prose</code> handles depth.
      </p>
      <ul>
        <li>
          Start · Week 0
          <ul>
            <li>Complete the Circle profile.</li>
            <li>Say hi in the Lounge.</li>
            <li>Find Buddy and Team.</li>
            <li>Set $3,000 and publish the page.</li>
            <li>RSVP to Learn + Do.</li>
          </ul>
        </li>
        <li>
          Learn · six published weeks
          <ol>
            <li>Week 1. Finding your why. Story Formula and true believers.</li>
            <li>Later weeks. Complete the current lesson before the next opens.</li>
            <li>Keep the line short enough to say out loud.</li>
          </ol>
        </li>
        <li>
          Tools
          <ul>
            <li>Map 100 people.</li>
            <li>Start with the inner circle, not the whole list.</li>
            <li>Use the ten-day content plan during Challenge week.</li>
          </ul>
        </li>
        <li>
          Challenge week · 19–28 October 2026
          <ol>
            <li>Do the challenge.</li>
            <li>Film it or photograph it.</li>
            <li>Thank people.</li>
            <li>Follow up.</li>
          </ol>
        </li>
      </ul>
      <h3>Story Formula, for paste into an article</h3>
      <p>Include these five, in your own words.</p>
      <ol>
        <li>Why you are here.</li>
        <li>Your personal connection to the cause.</li>
        <li>What you are taking on, and why it is hard.</li>
        <li>What the money actually does.</li>
        <li>A direct and specific ask.</li>
      </ol>
      <p>Leave these out.</p>
      <ul>
        <li>Statistics with no human being in them.</li>
        <li>Apologising for asking.</li>
        <li>Vague requests for support.</li>
        <li>Copying somebody else&apos;s voice.</li>
        <li>Waiting until it is perfect.</li>
      </ul>
      <blockquote>
        <p>
          A page with a photo and a real story performs much better than a
          bare one. We workshop your story properly in Week 1. Getting the
          basics done now frees you to focus on message and network.
        </p>
      </blockquote>
      <h2>Markup the theme expects</h2>
      <p>
        Wrap CMS HTML or Markdown output in one element. Use the two classes
        together. Add a measure class when the layout is not already 65ch.
        Use <code>not-prose</code> around a widget that must not inherit
        article styles.
      </p>
      <pre tabIndex={0}>
        <code>{`<article class="prose prose-academy prose-measure-default">
  <h1>Set up before the first session</h1>
  <p class="lead">Register. Choose the 10-day challenge.</p>
  <p>See <a href="#tools">Tools</a> for the tracker.</p>
</article>`}</code>
      </pre>
      <p>
        Link rest colour is <code>#0035B1</code>. Hover and focus use white
        on blue. Press uses ink on <code>#DEF54F</code>. Code blocks invert
        to paper on ink, which is a verified pair. Captions use charcoal, not
        quiet.
      </p>
      <h3>Keyboard and paste</h3>
      <p>
        If story formatting looks wrong, paste as plain text with{' '}
        <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> or <kbd>Cmd</kbd> +{' '}
        <kbd>Shift</kbd> + <kbd>V</kbd>. If changes do not show, hard refresh
        with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd>. If the photo
        will not upload, convert HEIC to JPG or PNG under 2MB.
      </p>
      <Photo
        src={PHOTOS.community.src}
        alt={PHOTOS.community.alt}
        caption={PHOTOS.community.caption}
      />
      <h2>Facts this surface must not drift</h2>
      <p>
        The participant goal is $3,000. Challenge week is 19 to 28 October
        2026. Weekly time is one to two hours. Learn + Do is thirty minutes
        learn and thirty minutes do. Photographs stay in natural colour.
        The wordmark is live text: Brand Sans 700 uppercase Uncomfortable over
        Brand Script 400 Academy. Long-form body copy does not use
        the script face.
      </p>
      <p>
        Apply the same <code>prose prose-academy</code> pair to every
        long-form reading surface, including the existing Pages/Article
        motion template. Do not add a bespoke article type scale beside the
        plugin. If a heading needs display size, that is a page masthead,
        not an article body, and it stays outside the <code>prose</code>{' '}
        element.
      </p>
      <hr />
      <p>
        Official plugin docs:{' '}
        <a href="https://github.com/tailwindlabs/tailwindcss-typography">
          github.com/tailwindlabs/tailwindcss-typography
        </a>
        . Tailwind 4 plugin directive:{' '}
        <a href="https://tailwindcss.com/docs/functions-and-directives#plugin-directive">
          @plugin
        </a>
        . Brand tokens: issue 231, merged in pull request 234. This page is
        the dense proof that those tokens still hold when the HTML is tables,
        code, and nested lists instead of a single column of paragraphs.
      </p>
    </ProseFrame>
  );
}
