# s1lk08.com — static site

Plain HTML/CSS/JS rewrite of the original React/Vite/TypeScript project.
No build step, no Node, no npm install — drop these files straight into your
web root.

## Structure

```
/
├── index.html          Home
├── games.html           Games
├── socials.html          Socials
├── thumbnails.html        Thumbnails & Commissions
├── 404.html              Not-found page (optional, wire up via Nginx error_page)
├── favicon.ico
├── robots.txt
├── css/
│   └── style.css         Single consolidated stylesheet (design tokens, layout, components)
├── js/
│   ├── nav.js            Mobile nav toggle + dark mode toggle (all pages)
│   └── thumbnails.js     Canvas watermarking, currency picker, lightbox (thumbnails.html only)
├── images/                All image assets (png/jpg/svg)
└── fonts/                  Comic Sans-alike webfont files (ttf)
```

All internal links and asset references use root-relative paths (`/css/style.css`,
`/images/...`, `/games.html`, etc.), so the site expects to be served from the
domain root — which matches a standard Nginx static-site config.

## Deploying to Lightsail + Nginx

1. Push this folder to a GitHub repo (or copy it directly to the server).
2. On the Lightsail instance, pull/copy it into your site's document root, e.g.
   `/var/www/s1lk08.com`.
3. A minimal Nginx server block:

   ```nginx
   server {
       listen 80;
       server_name s1lk08.com www.s1lk08.com;
       root /var/www/s1lk08.com;
       index index.html;

       error_page 404 /404.html;

       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

4. `sudo nginx -t && sudo systemctl reload nginx`

## Notes on the rewrite

- All React components/routes were converted 1:1 into standalone HTML pages
  with the same file names used by the original router (`/`, `/games`,
  `/socials`, `/thumbnails`) so your existing links keep working:
  `index.html`, `games.html`, `socials.html`, `thumbnails.html`.
- Tailwind's design tokens (colors, radii, shadows) were hand-translated into
  plain CSS custom properties in `css/style.css`, including the light/dark
  theme swap (toggled via a `dark` class on `<html>`, same as before).
- The thumbnail watermarking canvas, live currency conversion, and image
  lightbox — previously React state/hooks — are now plain DOM/Canvas
  JavaScript in `js/thumbnails.js`.
- The mobile hamburger menu and dark-mode toggle live in `js/nav.js` and run
  on every page.
- No React Router — the "active" nav link state is simply hardcoded per
  page (each HTML file marks its own nav link with `class="nav-link active"`).
