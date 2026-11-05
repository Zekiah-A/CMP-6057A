# Newsletter

# Libraries

React
Next.js
Prisma + PostgreSQL
TailwindCSS + DaisyUI

# Postgres setup

```sh
sudo -iu postgres createuser --pwprompt --no-superuser --no-createdb --no-createrole newsletter_app
sudo -iu postgres createdb --owner=newsletter_app newsletter_db
psql -h 127.0.0.1 -U newsletter_app -d newsletter_db -W -c 'SELECT 1;'
```
