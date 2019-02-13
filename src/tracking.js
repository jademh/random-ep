/* global gtag */

export default function trackEvent(eventCategory, eventAction, eventLabel) {
  if (process.env.NODE_ENV === 'production') {
    gtag('event', eventAction, {
      event_category: eventCategory,
      event_label: eventLabel,
    });
  } else {
    let consolePrefix = '👁👁 ';
    let consoleStyle =
      'background:blue; color: white; font-size: 15px; padding: 4px;';
    console.log(
      `%c ${consolePrefix} ${eventCategory}, ${eventAction}, ${eventLabel}`,
      consoleStyle
    );
  }
}
