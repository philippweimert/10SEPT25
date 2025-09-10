# Agent Instructions

This document provides instructions and guidelines for AI agents working on this codebase.

## Standard Content Section

The visual language of the site uses sections separated by horizontal lines. A standard section should be used for most content.

### Page Structure
A typical page should have a main `<h1 class="page-title">` which has a bottom border that serves as the first separator line.

Following the title, there can be multiple content sections. Each subsequent section should be a `<div class="section">`, which has a `border-top` that creates the necessary separator line.

### Dynamic Empty Sections

**Important:** On all pages except "Kontakt", four empty, **title-less** sections are added dynamically by the `insertEmptySections` function in `js/script.js`. This is done to ensure a consistent page length and structure. **Do not manually add this HTML structure to the page files.**

If you need to change the number of empty sections or the pages they appear on, modify the logic in `js/script.js`.

### HTML Structure of a Dynamic Section (for reference)

The `insertEmptySections` function generates the following HTML structure for each empty section:

```html
<!-- Dynamically Injected Standard Section -->
<div class="section">
    <div class="section-content">
        <p>This is a placeholder paragraph inside the section.</p>
    </div>
</div>
```

### CSS Styling

The necessary styles are already defined in `css/style.css`.

- **`.section`**:
  - `border-top: 3px solid #001f3f;` (This creates the separator line)
  - `padding-top: 40px;` (Space below the line)
  - `margin-top: 40px;` (Space above the line)
  - `min-height: 300px;`

## Main Layout Structure

The main layout of the application is defined in `index.html` and consists of two primary components within the `.main-container`:

-   **`.sidebar`**: The navigation bar on the left. It contains the main navigation links for the site.
-   **`.content`**: The main content area on the right. This is where the content for each page is dynamically loaded.

**Styling Note:** These two components are visually distinct. Any styling applied to the content area (such as borders or backgrounds) should target the `.content` class specifically and should **not** include the `.sidebar`. The parent `.page-container` is used for overall alignment and should not have visual styles like borders that might incorrectly group the sidebar and content together.
