# Static Assets Folder

Drop real media files here — the React app already references these exact
paths, so files placed here will appear automatically with no code changes.

```
public/
├── favicon.svg                      ✅ included
├── videos/
│   └── martial-arts-hero.mp4        ← autoplaying hero background video
├── images/
│   ├── hero-poster.jpg              ← fallback poster frame for the hero video
│   ├── founder.jpg                  ← Master R. HariHaran portrait
│   ├── aff1.png / aff2.png / fit-india.png   ← affiliation logos
│   ├── courses/
│   │   ├── taekwondo.jpg, taekwondo-1.jpg, taekwondo-2.jpg, taekwondo-3.jpg
│   │   ├── boxing.jpg, boxing-1.jpg, ...
│   │   └── (one banner + 3 gallery shots per course slug, see src/data/courses.js)
│   ├── gallery/
│   │   └── <category>-<n>.jpg       ← e.g. competitions-1.jpg, training-2.jpg (see src/data/gallery.js)
│   └── awards/
│       └── award-1.jpg … award-4.jpg
```

Until real files are added, every image gracefully falls back to a
gold-icon placeholder (see the `onError` handlers throughout the
component tree), so the site is fully usable without any media present.

In production, the **Gallery Management** and **Trainer Management**
tabs in the Admin Panel let staff upload real photos directly — those
go through the backend `/api/admin/gallery` and `/api/admin/trainers`
endpoints and are stored on disk / object storage rather than in this
folder.
