# Local uploads

All file upload handlers now save to `src/babylon_image_File` inside the backend. The existing category folders are reused (including `gallery/videos`); `users` is created automatically for profile pictures. Files receive unique names while retaining their image, video or document extension.

The backend serves this directory at `/babylon-school`. For example, uploading a faculty photo saves:

- File: `src/babylon_image_File/faculty/<unique-id>.png`
- Database path: `/babylon-school/faculty/<unique-id>.png`

`http://localhost:5000` is the local backend's HTTP address, not the file's disk location. The database stores only the path so moving the site to another computer or domain does not break new uploads.

Database field names and upload form fields are unchanged. Profile images also retain `publicId`, now a local file identifier used when replacing or deleting the photo.

When a record is updated, its replaced or removed local images, videos and documents are deleted after the database save succeeds. Deleting a record also removes its unused media. Retained gallery/ECA items, files referenced elsewhere in the database, and the homepage background video are preserved. Cleanup supports both generated filenames and the imported filenames. Failed saves keep the previous files; cleanup never follows external URLs or paths outside the upload directory.

Restart the backend and frontend development servers after these changes. The unused Cloudinary configuration, environment keys, and installed dependency have been removed. The home-page video is now served locally from `gallery/videos/videoPlay_zx3gc8.mp4`.

## Deployment

For a frontend and backend on the same domain, route both `/api/*` and `/babylon-school/*` to the backend. The Vite development proxy already forwards both paths to port 5000.

If the frontend and backend use different domains, set this in the frontend environment and rebuild:

```env
VITE_API_URL=https://api.your-school-domain.com/api/v1
```

The frontend resolves media paths against that API origin for display and sends relative paths back when editing existing media. It also handles earlier `localhost:5000/babylon-school/...` URLs. No backend `PUBLIC_BASE_URL` setting is needed.

The upload directory must be writable and retained across server restarts and deployments. Back it up with the database. Optionally set `LOCAL_UPLOAD_DIR` to a persistent directory; relative paths resolve from the backend directory. Copy the existing category folders into that location when using this option.

## Existing records

The migration script converts existing localhost and Cloudinary media URLs only when the matching local file exists. Missing files and ambiguous filenames are left unchanged. It updates individual URL fields, retains all records, and saves original values in the ignored `.local-media-backups` directory before applying changes.

```sh
node scripts/migrateLocalMedia.js          # Preview
node scripts/migrateLocalMedia.js --apply  # Back up and apply
```

## Verification

Run `npm test` in both projects and `npm run build` in the frontend. Tests use temporary local files and mocked database writes; they do not connect to MongoDB or Cloudinary. The migration commands above use the database configured in the backend `.env`.
