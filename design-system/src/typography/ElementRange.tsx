import { Photo } from '../pages/Photo';
import { PHOTOS } from '../pages/content';
import { ProseFrame } from './ProseFrame';
import type { Measure } from './measure';

export function ElementRange({
  measure,
  onMeasureChange,
}: {
  measure: Measure;
  onMeasureChange: (measure: Measure) => void;
}) {
  return (
    <ProseFrame measure={measure} onMeasureChange={onMeasureChange}>
      <h1>Academy reading elements</h1>
      <p className="lead">
        This page shows every element that <code>prose</code> styles: headings,
        paragraphs, lists, a blockquote, code, a table, a figure, and a rule.
      </p>
      <h2>Headings sit on ink</h2>
      <p>
        Body copy uses Brand Sans 400 in ink <code>#212121</code> on paper{' '}
        <code>#FFFFFF</code>. A heading uses the same face at 700. The plugin
        sets the measure. Default long-form reading is 65ch.
      </p>
      <h3>Links, hover, and press</h3>
      <p>
        A rest link uses blue. Try the{' '}
        <a href="#element-range-table">space table</a>. Hover and focus fill
        blue with white type. Press fills yellow with ink type.
      </p>
      <h4>Inline code and keyboard</h4>
      <p>
        Inline code looks like <code>prose prose-academy</code>. A shortcut
        uses <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> when you paste
        a story as plain text.
      </p>
      <blockquote>
        <p>
          Keep the line short enough to say out loud. Say what challenge you
          chose, why it is uncomfortable, why Mobilise, and what the reader
          must do.
        </p>
      </blockquote>
      <h2>Lists</h2>
      <p>Week 0 asks for five actions. Complete them in any order.</p>
      <ul>
        <li>Complete the Circle profile.</li>
        <li>Say hi in the Lounge.</li>
        <li>Find your Buddy and your Team.</li>
        <li>Set the goal to $3,000.</li>
        <li>RSVP to Learn + Do.</li>
      </ul>
      <p>Foundation steps on the fundraising page:</p>
      <ol>
        <li>Register and create the page.</li>
        <li>Add a face photo as JPG or PNG under 2MB.</li>
        <li>Write a draft story. Week 1 refines it.</li>
        <li>Set the target to $3,000.</li>
        <li>Publish the page and bookmark the share link.</li>
      </ol>
      <h2>A figure in the flow</h2>
      <Photo
        src={PHOTOS.crowd.src}
        alt={PHOTOS.crowd.alt}
        caption={PHOTOS.crowd.caption}
      />
      <h2 id="element-range-table">A table of Academy spaces</h2>
      <table>
        <thead>
          <tr>
            <th>Space</th>
            <th>Role</th>
            <th>When you use it</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Start</td>
            <td>Set up</td>
            <td>Week 0</td>
          </tr>
          <tr>
            <td>Learn</td>
            <td>Weekly lessons</td>
            <td>Six weeks before the challenge</td>
          </tr>
          <tr>
            <td>Tools</td>
            <td>Tracker and plan</td>
            <td>Inner circle, then ten days</td>
          </tr>
          <tr>
            <td>Events</td>
            <td>Learn + Do</td>
            <td>Sunday sessions</td>
          </tr>
          <tr>
            <td>Lounge</td>
            <td>Buddy and Team</td>
            <td>Check in when someone stalls</td>
          </tr>
        </tbody>
      </table>
      <h2>A code block</h2>
      <p>
        Wrap article HTML you do not control with the Academy prose theme. Do
        not write a second type system.
      </p>
      <pre tabIndex={0}>
        <code>{`<article class="prose prose-academy">
  <!-- Markdown output or CMS HTML -->
</article>`}</code>
      </pre>
      <hr />
      <p>
        Quiet <code>#A6A6A6</code> is a hairline and disabled mark only. It
        fails WCAG 2.2 AA as body text at 2.4 to 1.
      </p>
    </ProseFrame>
  );
}
