# Unique Engineering website

Static site (no build step). Open `index.html`, or run `python3 -m http.server 8000` and visit http://localhost:8000.

| Page | File |
|---|---|
| Home | `index.html` |
| Products | `products.html` |
| Infrastructure | `infrastructure.html` |
| Gallery | `gallery.html` |
| Clients & Quality | `clients.html` |
| Contact | `contact.html` |

- Styles: `css/style.css` (sectioned, one file)
- Scripts: `js/main.js` (menu, lightbox, products filter, enquiry form, animations)
- Images: `images/` (named by content; client logos in `images/logos/`)

## Contact form
Enquiries are emailed through Web3Forms. Paste the free access key into `WEB3FORMS_KEY` in `js/main.js`. Until then the form opens the visitor's email app instead.

## Header and footer
Each page repeats the same header and footer markup. When you change the menu, update it in every `.html` file.
