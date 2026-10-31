# Global Sentinel

BUILD: GLOBAL SITUATIONAL AWARENESS & OSINT INTELLIGENCE PLATFORM

PROJECT OVERVIEW

Build a professional, fully interactive, web-based Global Security Operations Center (GSOC) intelligence platform called:

GLOBAL SENTINEL | Situational Awareness & OSINT

This platform will support corporate security analysts monitoring threats to employees, travelers, offices, and business operations worldwide.

It must combine a zoomable global map, a searchable geographic intelligence directory, official emergency resources, local and global news, publicly available incident information, social media monitoring, translation capabilities, and analytical reference tools.

This must be a functional, data-driven application—not a static dashboard, mockup, or collection of decorative cards.

The primary objective is to answer:

"Something is happening near our employees. Where can I find the most accurate, timely, geographically relevant information to verify it?"

The application should feel like a professional intelligence platform used by a corporate GSOC.

1. DESIGN & USER EXPERIENCE

Create a sophisticated, modern intelligence dashboard.

Visual design

Dark navy/charcoal theme with optional light mode.

High-resolution interactive world map as the centerpiece.

Professional typography and restrained accent colors.

Teal/blue for normal operations.

Amber for caution or unverified information.

Red for confirmed critical incidents.

Green for verified/available resources.

Clean, responsive layouts.

Collapsible navigation and intelligence panels.

Minimal clutter and excellent readability.

Desktop-first design, with tablet support.

Take inspiration from modern GIS platforms, emergency operations centers, aviation monitoring interfaces, and professional threat-intelligence dashboards.

Do not use unnecessary animations or flashy graphics.

Main layout

Top navigation

GLOBAL SENTINEL | Global Situational Awareness

Include:

Global Overview

Incident Explorer

Live Monitoring

News & Social Intelligence

Resource Directory

Regional Watch

Administration

Left sidebar

Geographic navigation, filters, and incident categories.

Center

Large interactive global map.

Right sidebar

Context-sensitive intelligence and resource information for the selected location.

Bottom expandable panel

Searchable resource directory, incident information, source details, and supporting intelligence.

The map should remain visible while analysts investigate resources.

2. INTERACTIVE GLOBAL MAP

Use MapLibre GL JS or Leaflet with an appropriate mapping provider.

The map must support:

Worldwide navigation.

Smooth zoom and pan.

Searchable countries, states, provinces, districts, counties, and cities.

Location autocomplete.

Geographic boundaries where available.

Country and administrative-area highlighting.

Multiple map styles.

Clickable geographic locations.

Context-sensitive resource panels.

Map-layer toggles.

Marker clustering.

Fullscreen map mode.

Geographic hierarchy

Region → Country → State/Province/District → County/Municipality → City

Not every country uses the same administrative structure. Support country-specific geography instead of assuming all countries have U.S.-style states and counties.

When an analyst selects a location, automatically display resources relevant to that location and all applicable higher geographic levels.

For example:

Wichita, Kansas, United States

Display resources applicable to:

Wichita

Sedgwick County

Kansas

United States

Global monitoring

Avoid duplicate records.

Selecting Spain should show Spanish national resources and any relevant regional resources.

Selecting Madrid should additionally display Madrid-specific sources.

Map behavior

Selecting a location should automatically zoom to an appropriate level.

Changing incident categories should update the resource results without losing the selected location.

Include an option to reset the map to the global overview.

3. EMPLOYEE FOOTPRINT

Initially prioritize the following countries.

AMER

United States, Canada, Mexico, Costa Rica, Guatemala, Colombia, Peru, Brazil, Argentina.

EMEA

Spain, Portugal, Ireland, United Kingdom, France, Switzerland, Italy, Austria, Hungary, Romania, Poland, Czechia, Germany, Belgium, Netherlands, Denmark, Norway, Sweden, Finland, Estonia, Iceland, Greece, Israel, Saudi Arabia, United Arab Emirates, South Africa, Jordan.

APAC

India, Thailand, China, Taiwan, Singapore, Vietnam, Philippines, Japan, South Korea, Australia, New Zealand.

Prague, Czechia, and Johannesburg, South Africa, should be supported as priority city locations.

Include the ability to add other countries as Regional Watch locations even if no employees are currently based there.

Do not assume the initial employee footprint represents every location requiring monitoring.

4. RESOURCE CATEGORIES

Build a comprehensive resource taxonomy.

Every resource must have one or more cate

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1ac6d831-56d0-5280-87f0-d0420bdb8308).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
